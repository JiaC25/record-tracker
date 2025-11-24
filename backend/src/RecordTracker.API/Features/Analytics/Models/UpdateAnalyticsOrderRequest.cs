using FluentValidation;

namespace RecordTracker.API.Features.Analytics.Models;

public record UpdateAnalyticsOrderRequest
{
    public Guid RecordId { get; init; }
    public List<AnalyticOrderItem> Analytics { get; init; } = [];
}

public record AnalyticOrderItem
{
    public Guid AnalyticId { get; init; }
    public int Order { get; init; }
}

public class UpdateAnalyticsOrderRequestValidator : AbstractValidator<UpdateAnalyticsOrderRequest>
{
    public UpdateAnalyticsOrderRequestValidator()
    {
        RuleFor(x => x.RecordId)
            .NotEmpty()
            .WithMessage("Record ID is required.");

        RuleFor(x => x.Analytics)
            .NotEmpty()
            .WithMessage("At least one analytic order item is required.");

        RuleForEach(x => x.Analytics)
            .ChildRules(item =>
            {
                item.RuleFor(i => i.AnalyticId)
                    .NotEmpty()
                    .WithMessage("Analytic ID is required.");

                item.RuleFor(i => i.Order)
                    .GreaterThanOrEqualTo(0)
                    .WithMessage("Order must be greater than or equal to 0.");
            });
    }
}

