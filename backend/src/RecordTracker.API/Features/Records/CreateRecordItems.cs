using FluentValidation;
using Microsoft.EntityFrameworkCore;
using RecordTracker.API.Features.Records.Models;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Entities;
using RecordTracker.Infrastructure.Persistence;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Records;

public record CreateRecordItemsRequest(Guid RecordId)
{
    public List<RecordItemInput> Items { get; init; } = [];
}

public class CreateRecordItemsValidator : AbstractValidator<CreateRecordItemsRequest>
{
    public CreateRecordItemsValidator()
    {
        RuleFor(x => x.RecordId)
            .NotEmpty()
            .WithMessage("Record ID is required and cannot be an empty GUID.");

        RuleFor(x => x.Items)
            .NotEmpty()
            .WithMessage("At least one Item is required.");

        RuleForEach(x => x.Items)
            .SetValidator(new RecordItemInputValidator());
    }
}

public class CreateRecordItemsHandler
{
    private readonly IValidator<CreateRecordItemsRequest> _validator;
    private readonly IRecordRepository _recordRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly RecordTrackerDbContext _dbContext;

    public CreateRecordItemsHandler(
        IValidator<CreateRecordItemsRequest> validator,
        IRecordRepository recordRepository,
        ICurrentUserService currentUserService,
        RecordTrackerDbContext dbContext)
    {
        _validator = validator;
        _recordRepository = recordRepository;
        _currentUserService = currentUserService;
        _dbContext = dbContext;
    }

    public async Task<IResult> HandleAsync(CreateRecordItemsRequest request, CancellationToken ct = default)
    {
        var validationResult = await _validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return TypedResults.ValidationProblem(validationResult.ToDictionary());

        var userId = _currentUserService.GetUserId();

        // Validate the record exists and belongs to the current user
        var record = await _recordRepository.GetRecordByIdWithFieldsAsync(request.RecordId, userId, ct);
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
        var createdItems = new List<RecordItem>();
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
            createdItems.Add(recordItem);
        }

        await _recordRepository.SaveChangesAsync(ct);

        // Reload RecordValues to ensure we have the latest data from the database
        foreach (var item in createdItems)
        {
            await _dbContext.Entry(item).Collection(r => r.RecordValues).LoadAsync(ct);
        }

        // Build response in the same flattened format as GetRecordById
        var responseItems = createdItems.Select(item =>
        {
            var dict = new Dictionary<string, string>
            {
                ["id"] = item.Id.ToString(),
                ["createdAt"] = item.CreatedAt.ToString("o")
            };

            // Populate all fields according to RecordFields order
            foreach (var field in record.RecordFields.OrderBy(f => f.Order))
            {
                var matchingValue = item.RecordValues.FirstOrDefault(v => v.RecordFieldId == field.Id);
                dict[field.Id.ToString()] = matchingValue?.Value ?? "";
            }

            return dict;
        }).ToList();

        return TypedResults.Ok(responseItems);
    }

}
