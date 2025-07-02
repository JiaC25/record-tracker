using FluentValidation;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Persistence;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Records;

public record DeleteRecordRequest(Guid Id);

public class DeleteRecordValidator : AbstractValidator<DeleteRecordRequest>
{
    public DeleteRecordValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Record Type ID is required and cannot be an empty GUID.");
    }
}

public class DeleteRecordHandler
{
    private readonly RecordTrackerDbContext _dbContext;
    private readonly IValidator<DeleteRecordRequest> _validator;
    private readonly ICurrentUserService _currentUserService;
    private readonly IRecordRepository _recordRepository;

    public DeleteRecordHandler(
        RecordTrackerDbContext dbContext,
        IValidator<DeleteRecordRequest> validator,
        ICurrentUserService currentUserService,
        IRecordRepository recordRepository)
    {
        _dbContext = dbContext;
        _validator = validator;
        _currentUserService = currentUserService;
        _recordRepository = recordRepository;
    }

    public async Task<IResult> HandleAsync(DeleteRecordRequest request, CancellationToken ct = default)
    {
        var validationResult = await _validator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var userId = _currentUserService.GetUserId();

        var record = await _recordRepository.GetByIdFullAsync(request.Id, userId, ct);
        if (record == null)
            return Results.NotFound(new { Message = "Record Type not found." });

        // Delete the main Record
        record.IsDeleted = true;
        record.DeletedByUserId = userId;
        record.DeletedAt = DateTime.UtcNow;

        // Delete all associated RecordFields
        foreach (var field in record.RecordFields)
            field.IsDeleted = true;

        // Delete all associated RecordItems and RecordValues
        foreach (var item in record.RecordItems)
        {
            item.IsDeleted = true;
            item.DeletedByUserId = userId;
            item.DeletedAt = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync(ct);
        return Results.NoContent();
    }
}
