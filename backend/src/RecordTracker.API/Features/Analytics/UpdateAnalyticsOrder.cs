using FluentValidation;
using RecordTracker.API.Features.Analytics.Models;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Analytics;

public class UpdateAnalyticsOrderHandler
{
    private readonly IValidator<UpdateAnalyticsOrderRequest> _validator;
    private readonly ICurrentUserService _currentUserService;
    private readonly IAnalyticRepository _analyticRepository;
    private readonly IRecordRepository _recordRepository;

    public UpdateAnalyticsOrderHandler(
        IValidator<UpdateAnalyticsOrderRequest> validator,
        ICurrentUserService currentUserService,
        IAnalyticRepository analyticRepository,
        IRecordRepository recordRepository)
    {
        _validator = validator;
        _currentUserService = currentUserService;
        _analyticRepository = analyticRepository;
        _recordRepository = recordRepository;
    }

    public async Task<IResult> HandleAsync(UpdateAnalyticsOrderRequest request, CancellationToken ct = default)
    {
        var validationResult = await _validator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var userId = _currentUserService.GetUserId();

        // Verify record ownership
        var record = await _recordRepository.GetRecordByIdAsync(request.RecordId, userId, ct);
        if (record == null)
            return Results.NotFound(new { Message = "Record not found or user has no access." });

        // Get all analytics for the record
        var analytics = await _analyticRepository.GetAnalyticsByRecordIdAsync(request.RecordId, userId, ct);
        var analyticsDict = analytics.ToDictionary(a => a.Id);

        // Validate all requested analytics exist and belong to the record
        foreach (var orderItem in request.Analytics)
        {
            if (!analyticsDict.ContainsKey(orderItem.AnalyticId))
            {
                return Results.BadRequest(new { Message = $"Analytic {orderItem.AnalyticId} not found or does not belong to the record." });
            }
        }

        // Update orders
        foreach (var orderItem in request.Analytics)
        {
            var analytic = analyticsDict[orderItem.AnalyticId];
            analytic.Order = orderItem.Order;
            await _analyticRepository.UpdateAnalyticAsync(analytic, ct);
        }

        await _analyticRepository.SaveChangesAsync(ct);

        return Results.NoContent();
    }
}

