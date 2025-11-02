using FluentValidation;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Persistence;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Records;

public record UpdateRecordItemRequest(Guid RecordId, Guid ItemId)
{
    public CreateRecordItemsRequest.RecordItemInput Item { get; init; } = default!;
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
            .WithMessage("Item is required");

        RuleFor(x => x.Item.Values)
            .NotEmpty()
            .WithMessage("Item must have at least one Value");

        RuleForEach(x => x.Item.Values).SetValidator(new RecordValueInputValidator());
    }

    private class RecordValueInputValidator : AbstractValidator<CreateRecordItemsRequest.RecordValueInput>
    {
        public RecordValueInputValidator()
        {
            RuleFor(x => x.RecordFieldId).NotEmpty().WithMessage("Value must have an associated Field");
            RuleFor(x => x.Value).NotEmpty().WithMessage("Value must not be empty");
        }
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

        return Results.NoContent();
    }
}

