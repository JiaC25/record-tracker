using FluentValidation;
using RecordTracker.API.Features.Analytics.Models;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Entities;
using RecordTracker.Infrastructure.Repositories.Interfaces;
using System.Text.Json;

namespace RecordTracker.API.Features.Analytics;

public class CreateAnalyticHandler
{
    private readonly IValidator<CreateAnalyticRequest> _validator;
    private readonly ICurrentUserService _currentUserService;
    private readonly IAnalyticRepository _analyticRepository;
    private readonly IRecordRepository _recordRepository;

    public CreateAnalyticHandler(
        IValidator<CreateAnalyticRequest> validator,
        ICurrentUserService currentUserService,
        IAnalyticRepository analyticRepository,
        IRecordRepository recordRepository)
    {
        _validator = validator;
        _currentUserService = currentUserService;
        _analyticRepository = analyticRepository;
        _recordRepository = recordRepository;
    }

    public async Task<IResult> HandleAsync(CreateAnalyticRequest request, CancellationToken ct = default)
    {
        var validationResult = await _validator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var userId = _currentUserService.GetUserId();

        // Verify record ownership
        var record = await _recordRepository.GetRecordByIdWithFieldsAsync(request.RecordId, userId, ct);
        if (record == null)
            return Results.NotFound(new { Message = "Record not found or user has no access." });

        // Validate JSON configuration
        try
        {
            JsonDocument.Parse(request.Configuration);
        }
        catch (JsonException)
        {
            return Results.BadRequest(new { Message = "Invalid JSON configuration." });
        }

        // Validate field IDs exist in record (basic validation - frontend handles type compatibility)
        var configDoc = JsonDocument.Parse(request.Configuration);
        var fieldIds = ExtractFieldIdsFromConfig(configDoc.RootElement);
        var validFieldIds = record.RecordFields.Select(f => f.Id).ToHashSet();
        var invalidFieldIds = fieldIds.Except(validFieldIds);
        if (invalidFieldIds.Any())
        {
            return Results.BadRequest(new { Message = $"Invalid field IDs: {string.Join(", ", invalidFieldIds)}" });
        }

        var analytic = new Analytic
        {
            Id = Guid.NewGuid(),
            RecordId = request.RecordId,
            Name = request.Name,
            Type = request.Type,
            Configuration = request.Configuration,
            Order = request.Order,
            CreatedByUserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        await _analyticRepository.AddAnalyticAsync(analytic, ct);
        await _analyticRepository.SaveChangesAsync(ct);

        var dto = new AnalyticDto
        {
            Id = analytic.Id,
            CreatedAt = analytic.CreatedAt,
            Name = analytic.Name,
            Type = analytic.Type.ToString(),
            Configuration = analytic.Configuration,
            Order = analytic.Order,
            RecordId = analytic.RecordId
        };

        return Results.Created($"/api/records/{request.RecordId}/analytics/{analytic.Id}", dto);
    }

    private static HashSet<Guid> ExtractFieldIdsFromConfig(JsonElement config)
    {
        var fieldIds = new HashSet<Guid>();

        // Common field ID keys in config
        var fieldIdKeys = new[] { "xAxisFieldId", "yAxisFieldId", "valueFieldId", "groupByFieldId" };

        foreach (var key in fieldIdKeys)
        {
            if (config.TryGetProperty(key, out var element) && element.ValueKind == JsonValueKind.String)
            {
                if (Guid.TryParse(element.GetString(), out var fieldId))
                {
                    fieldIds.Add(fieldId);
                }
            }
        }

        return fieldIds;
    }
}

