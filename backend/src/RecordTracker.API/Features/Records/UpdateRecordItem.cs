using FluentValidation;
using RecordTracker.API.Features.Records.Models;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Persistence;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Records;

public record UpdateRecordItemRequest(Guid RecordId, Guid ItemId)
{
    public RecordItemInput Item { get; init; } = default!;
}

public class UpdateRecordItemValidator : AbstractValidator<UpdateRecordItemRequest>
{
    public UpdateRecordItemValidator()
    {
        RuleFor(x => x.RecordId)
            .NotEmpty()
            .WithMessage("Record ID is required and cannot be an empty GUID.");
        
        RuleFor(x => x.ItemId)
            .NotEmpty()
            .WithMessage("Record Item ID is required and cannot be an empty GUID.");

        RuleFor(x => x.Item)
            .NotEmpty()
            .WithMessage("Item is required")
            .SetValidator(new RecordItemInputValidator());
    }
}

public class UpdateRecordItemHandler
{
    private readonly RecordTrackerDbContext _dbContext;
    private readonly IValidator<UpdateRecordItemRequest> _validator;
    private readonly ICurrentUserService _currentUserService;
    private readonly IRecordRepository _recordRepository;

    public UpdateRecordItemHandler(
        RecordTrackerDbContext dbContext,
        IValidator<UpdateRecordItemRequest> validator,
        ICurrentUserService currentUserService,
        IRecordRepository recordRepository)
    {
        _dbContext = dbContext;
        _validator = validator;
        _currentUserService = currentUserService;
        _recordRepository = recordRepository;
    }

    public async Task<IResult> HandleAsync(UpdateRecordItemRequest request, CancellationToken ct = default)
    {
        var validationResult = await _validator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var userId = _currentUserService.GetUserId();

        // Get the full record to verify ownership and validate fields (includes RecordValues for item lookup)
        var record = await _recordRepository.GetRecordByIdFullAsync(request.RecordId, userId, ct);
        if (record == null)
            return Results.NotFound(new { Message = "Record not found or user no access." });

        // Validate all provided RecordFieldIds are valid
        var validFieldIds = record.RecordFields.Select(f => f.Id).ToHashSet();
        var invalidIds = request.Item.Values
            .Select(v => v.RecordFieldId)
            .Except(validFieldIds);
        if (invalidIds.Any())
            return Results.BadRequest($"Invalid field ID: {string.Join(", ", invalidIds)}");

        // Find the record item
        var recordItem = record.RecordItems.FirstOrDefault(item => item.Id == request.ItemId);
        if (recordItem == null)
            return Results.NotFound(new { Message = "Record Item not found." });

        // Verify ownership via the record
        if (recordItem.CreatedByUserId != userId)
            return Results.Forbid();

        // Replace all RecordValues with new ones
        // Delete existing values
        _dbContext.RecordValue.RemoveRange(recordItem.RecordValues);

        // Add new values
        var newRecordValues = request.Item.Values.Select(valueInput => new RecordTracker.Infrastructure.Entities.RecordValue
        {
            Id = Guid.NewGuid(),
            Value = valueInput.Value,
            RecordFieldId = valueInput.RecordFieldId,
            RecordItemId = recordItem.Id,
        }).ToList();

        await _dbContext.RecordValue.AddRangeAsync(newRecordValues, ct);
        await _dbContext.SaveChangesAsync(ct);

        // Reload the record item with its values to build the response
        await _dbContext.Entry(recordItem).Collection(r => r.RecordValues).LoadAsync(ct);

        // Build response in the same flattened format as GetRecordById
        var responseItem = new Dictionary<string, string>
        {
            ["id"] = recordItem.Id.ToString(),
            ["createdAt"] = recordItem.CreatedAt.ToString("o")
        };

        // Populate all fields according to RecordFields order
        foreach (var field in record.RecordFields.OrderBy(f => f.Order))
        {
            var matchingValue = recordItem.RecordValues.FirstOrDefault(v => v.RecordFieldId == field.Id);
            responseItem[field.Id.ToString()] = matchingValue?.Value ?? "";
        }

        return Results.Ok(responseItem);
    }
}

