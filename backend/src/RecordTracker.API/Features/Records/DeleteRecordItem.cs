using FluentValidation;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Persistence;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Records;

public record DeleteRecordItemRequest(Guid RecordId, Guid ItemId);

public class DeleteRecordItemValidator : AbstractValidator<DeleteRecordItemRequest>
{
    public DeleteRecordItemValidator()
    {
        RuleFor(x => x.RecordId)
            .NotEmpty()
            .WithMessage("Record ID is required and cannot be an empty GUID.");
        
        RuleFor(x => x.ItemId)
            .NotEmpty()
            .WithMessage("Record Item ID is required and cannot be an empty GUID.");
    }
}

public class DeleteRecordItemHandler
{
    private readonly RecordTrackerDbContext _dbContext;
    private readonly IValidator<DeleteRecordItemRequest> _validator;
    private readonly ICurrentUserService _currentUserService;
    private readonly IRecordRepository _recordRepository;

    public DeleteRecordItemHandler(
        RecordTrackerDbContext dbContext,
        IValidator<DeleteRecordItemRequest> validator,
        ICurrentUserService currentUserService,
        IRecordRepository recordRepository)
    {
        _dbContext = dbContext;
        _validator = validator;
        _currentUserService = currentUserService;
        _recordRepository = recordRepository;
    }

    public async Task<IResult> HandleAsync(DeleteRecordItemRequest request, CancellationToken ct = default)
    {
        var validationResult = await _validator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var userId = _currentUserService.GetUserId();

        // Get the record to verify ownership and find the item
        var record = await _recordRepository.GetRecordByIdFullAsync(request.RecordId, userId, ct);
        if (record == null)
            return Results.NotFound(new { Message = "Record not found or user no access." });

        // Find the record item
        var recordItem = record.RecordItems.FirstOrDefault(item => item.Id == request.ItemId);
        if (recordItem == null)
            return Results.NotFound(new { Message = "Record Item not found." });

        // Soft delete the RecordItem
        recordItem.IsDeleted = true;
        recordItem.DeletedByUserId = userId;
        recordItem.DeletedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(ct);
        return Results.NoContent();
    }
}

