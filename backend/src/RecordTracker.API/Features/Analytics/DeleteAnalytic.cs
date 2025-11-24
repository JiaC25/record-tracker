using FluentValidation;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Analytics;

public record DeleteAnalyticRequest(Guid RecordId, Guid AnalyticId);

public class DeleteAnalyticValidator : AbstractValidator<DeleteAnalyticRequest>
{
    public DeleteAnalyticValidator()
    {
        RuleFor(x => x.RecordId)
            .NotEmpty()
            .WithMessage("Record ID is required.");

        RuleFor(x => x.AnalyticId)
            .NotEmpty()
            .WithMessage("Analytic ID is required.");
    }
}

public class DeleteAnalyticHandler
{
    private readonly IValidator<DeleteAnalyticRequest> _validator;
    private readonly ICurrentUserService _currentUserService;
    private readonly IAnalyticRepository _analyticRepository;
    private readonly IRecordRepository _recordRepository;

    public DeleteAnalyticHandler(
        IValidator<DeleteAnalyticRequest> validator,
        ICurrentUserService currentUserService,
        IAnalyticRepository analyticRepository,
        IRecordRepository recordRepository)
    {
        _validator = validator;
        _currentUserService = currentUserService;
        _analyticRepository = analyticRepository;
        _recordRepository = recordRepository;
    }

    public async Task<IResult> HandleAsync(DeleteAnalyticRequest request, CancellationToken ct = default)
    {
        var validationResult = await _validator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var userId = _currentUserService.GetUserId();

        // Verify record ownership
        var record = await _recordRepository.GetRecordByIdAsync(request.RecordId, userId, ct);
        if (record == null)
            return Results.NotFound(new { Message = "Record not found or user has no access." });

        // Get the analytic
        var analytic = await _analyticRepository.GetAnalyticByIdAsync(request.AnalyticId, userId, ct);
        if (analytic == null)
            return Results.NotFound(new { Message = "Analytic not found or user has no access." });

        // Verify analytic belongs to the record
        if (analytic.RecordId != request.RecordId)
            return Results.BadRequest(new { Message = "Analytic does not belong to the specified record." });

        // Soft delete
        analytic.IsDeleted = true;
        analytic.DeletedByUserId = userId;
        analytic.DeletedAt = DateTime.UtcNow;

        await _analyticRepository.UpdateAnalyticAsync(analytic, ct);
        await _analyticRepository.SaveChangesAsync(ct);

        return Results.NoContent();
    }
}

