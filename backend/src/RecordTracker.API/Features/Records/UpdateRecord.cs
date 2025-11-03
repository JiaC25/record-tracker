using FluentValidation;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Persistence;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Records;

public record UpdateRecordRequest(Guid RecordId)
{
    public string Name { get; init; } = default!;
    public string? Description { get; init; }
    public List<UpdateRecordFieldInput> RecordFields { get; init; } = [];
    
}

public record UpdateRecordFieldInput
{
    public string Name { get; init; } = default!;
    public int Order { get; init; }
}

public class UpdateRecordValidator : AbstractValidator<UpdateRecordRequest>
{
    public UpdateRecordValidator()
    {
        RuleFor(x => x.RecordId)
            .NotEmpty()
            .WithMessage("Record ID is required and cannot be an empty GUID.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100);
        
        RuleFor(x => x.Description)
            .MaximumLength(500);
        
        RuleForEach(x => x.RecordFields)
            .SetValidator(new UpdateRecordFieldInputValidator());
    }
}

public class UpdateRecordFieldInputValidator : AbstractValidator<UpdateRecordFieldInput>
{
    public UpdateRecordFieldInputValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Order)
            .GreaterThanOrEqualTo(0);
    }
}

public class UpdateRecordHandler
{
    private readonly RecordTrackerDbContext _dbContext;
    private readonly IValidator<UpdateRecordRequest> _validator;
    private readonly ICurrentUserService _currentUserService;
    private readonly IRecordRepository _recordRepository;

    public UpdateRecordHandler(
        RecordTrackerDbContext dbContext,
        IValidator<UpdateRecordRequest> validator,
        ICurrentUserService currentUserService,
        IRecordRepository recordRepository)
    {
        _dbContext = dbContext;
        _validator = validator;
        _currentUserService = currentUserService;
        _recordRepository = recordRepository;
    }

    public async Task<IResult> HandleAsync(UpdateRecordRequest request, CancellationToken ct = default)
    {
        var validationResult = await _validator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var userId = _currentUserService.GetUserId();

        // Get the record to verify ownership
        var record = await _recordRepository.GetRecordByIdFullAsync(request.RecordId, userId, ct);
        if (record == null)
            return Results.NotFound(new { Message = "Record not found or user no access." });

        return Results.NoContent();
    }
}