using FluentValidation;
using RecordTracker.API.Features.Analytics.Models;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Repositories.Interfaces;
using System.Text.Json;

namespace RecordTracker.API.Features.Analytics;

public class UpdateAnalyticHandler
{
    private readonly IValidator<UpdateAnalyticRequest> _validator;
    private readonly ICurrentUserService _currentUserService;
    private readonly IAnalyticRepository _analyticRepository;
    private readonly IRecordRepository _recordRepository;

    public UpdateAnalyticHandler(
        IValidator<UpdateAnalyticRequest> validator,
        ICurrentUserService currentUserService,
        IAnalyticRepository analyticRepository,
        IRecordRepository recordRepository)
    {
        _validator = validator;
        _currentUserService = currentUserService;
        _analyticRepository = analyticRepository;
        _recordRepository = recordRepository;
    }

    public async Task<IResult> HandleAsync(UpdateAnalyticRequest request, CancellationToken ct = default)
    {
        var validationResult = await _validator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var userId = _currentUserService.GetUserId();

        // Verify record ownership
        var record = await _recordRepository.GetRecordByIdWithFieldsAsync(request.RecordId, userId, ct);
        if (record == null)
            return Results.NotFound(new { Message = "Record not found or user has no access." });

        // Get the analytic
        var analytic = await _analyticRepository.GetAnalyticByIdAsync(request.AnalyticId, userId, ct);
        if (analytic == null)
            return Results.NotFound(new { Message = "Analytic not found or user has no access." });

        // Verify analytic belongs to the record
        if (analytic.RecordId != request.RecordId)
            return Results.BadRequest(new { Message = "Analytic does not belong to the specified record." });

        // Validate JSON configuration
        try
        {
            JsonDocument.Parse(request.Configuration);
        }
        catch (JsonException)
        {
            return Results.BadRequest(new { Message = "Invalid JSON configuration." });
        }

        // Validate field IDs exist in record
        var configDoc = JsonDocument.Parse(request.Configuration);
        var fieldIds = ExtractFieldIdsFromConfig(configDoc.RootElement);
        var validFieldIds = record.RecordFields.Select(f => f.Id).ToHashSet();
        var invalidFieldIds = fieldIds.Except(validFieldIds);
        if (invalidFieldIds.Any())
        {
            return Results.BadRequest(new { Message = $"Invalid field IDs: {string.Join(", ", invalidFieldIds)}" });
        }

        // Update analytic
        analytic.Name = request.Name;
        analytic.Configuration = request.Configuration;
        analytic.Order = request.Order;

        await _analyticRepository.UpdateAnalyticAsync(analytic, ct);
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

        return Results.Ok(dto);
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

