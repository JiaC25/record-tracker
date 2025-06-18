using FluentValidation;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Persistence;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.RecordTypes;

public record DeleteRecordTypeRequest(Guid Id);

public class DeleteRecordTypeValidator : AbstractValidator<DeleteRecordTypeRequest>
{
    public DeleteRecordTypeValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Record Type ID is required and cannot be an empty GUID.");
    }
}

public class DeleteRecordTypeHandler
{
    private readonly RecordTrackerDbContext _dbContext;
    private readonly IValidator<DeleteRecordTypeRequest> _validator;
    private readonly ICurrentUserService _currentUserService;
    private readonly IRecordTypeRepository _recordTypeRepository;

    public DeleteRecordTypeHandler(
        RecordTrackerDbContext dbContext,
        IValidator<DeleteRecordTypeRequest> validator,
        ICurrentUserService currentUserService,
        IRecordTypeRepository recordTypeRepository)
    {
        _dbContext = dbContext;
        _validator = validator;
        _currentUserService = currentUserService;
        _recordTypeRepository = recordTypeRepository;
    }

    public async Task<IResult> HandleAsync(DeleteRecordTypeRequest request, CancellationToken ct = default)
    {
        var validationResult = await _validator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var userId = _currentUserService.GetUserId();

        var recordType = await _recordTypeRepository.GetByIdFullAsync(request.Id, userId, ct);
        if (recordType == null)
            return Results.NotFound(new { Message = "Record Type not found." });

        // Delete the main RecordType
        recordType.IsDeleted = true;
        recordType.DeletedByUserId = userId;
        recordType.DeletedAt = DateTime.UtcNow;

        // Delete all associated RecordFields
        foreach (var field in recordType.RecordFields)
            field.IsDeleted = true;

        // Delete all associated RecordItems and RecordValues
        foreach (var item in recordType.RecordItems)
        {
            item.IsDeleted = true;
            item.DeletedByUserId = userId;
            item.DeletedAt = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync(ct);
        return Results.NoContent();
    }
}
