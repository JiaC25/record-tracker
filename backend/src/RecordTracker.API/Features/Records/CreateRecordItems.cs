using FluentValidation;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Entities;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Records;

public record CreateRecordItemsRequest
{
    public List<RecordItemInput> Items { get; init; } = [];

    public record RecordItemInput
    {
        public List<RecordValueInput> Values { get; init; } = [];
    }

    public record RecordValueInput
    {
        public Guid RecordFieldId { get; init; }
        public string Value { get; init; } = default!;
    }
}

public class CreateRecordItemsValidator : AbstractValidator<CreateRecordItemsRequest>
{
    public CreateRecordItemsValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one Item is required.");

        RuleForEach(x => x.Items).SetValidator(new RecordItemInputValidator());
    }

    private class RecordItemInputValidator : AbstractValidator<CreateRecordItemsRequest.RecordItemInput>
    {
        public RecordItemInputValidator()
        {
            RuleFor(x => x.Values).NotEmpty().WithMessage("Item must have at least one Value");

            RuleForEach(x => x.Values).SetValidator(new RecordValueInputValidator());
        }
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

public class CreateRecordItemsHandler
{
    private readonly IValidator<CreateRecordItemsRequest> _validator;
    private readonly IRecordRepository _recordRepository;
    private readonly ICurrentUserService _currentUserService;

    public CreateRecordItemsHandler(
        IValidator<CreateRecordItemsRequest> validator,
        IRecordRepository recordRepository,
        ICurrentUserService currentUserService)
    {
        _validator = validator;
        _recordRepository = recordRepository;
        _currentUserService = currentUserService;
    }

    public async Task<IResult> HandleAsync(Guid recordId, CreateRecordItemsRequest request, CancellationToken ct = default)
    {
        var validationResult = await _validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return TypedResults.ValidationProblem(validationResult.ToDictionary());

        var userId = _currentUserService.GetUserId();

        // Validate the record exists and belongs to the current user
        var record = await _recordRepository.GetRecordByIdWithFieldsAsync(recordId, userId, ct);
        if (record == null)
            return TypedResults.NotFound("Record not found or user no access");

        // Validate all provided RecordFieldIds are valid
        var validFieldIds = record.RecordFields.Select(f => f.Id).ToHashSet();
        var allValueInputFieldIds = request.Items
            .SelectMany(i => i.Values)
            .Select(v => v.RecordFieldId)
            .ToHashSet();
        var invalidIds = allValueInputFieldIds.Except(validFieldIds);
        if (invalidIds.Any())
            return TypedResults.BadRequest($"Invalid field ID: {string.Join(", ", invalidIds)}");

        // Create RecordItems with RecordValues
        foreach (var itemInput in request.Items)
        {           
            var recordItem = new RecordItem
            {
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow,
                RecordId = record.Id,
                CreatedByUserId = userId,
                RecordValues = itemInput.Values.Select(valueInput => new RecordValue
                {
                    Id = Guid.NewGuid(),
                    Value = valueInput.Value,
                    RecordFieldId = valueInput.RecordFieldId,
                }).ToList()
            };

            await _recordRepository.AddRecordItemAsync(recordItem, ct);
        }

        await _recordRepository.SaveChangesAsync(ct);

        return TypedResults.NoContent();
    }

}
