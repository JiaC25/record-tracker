using FluentValidation;
using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.API.Features.Analytics.Models;

public record UpdateAnalyticRequest
{
    public Guid AnalyticId { get; init; }
    public Guid RecordId { get; init; }
    public string Name { get; init; } = default!;
    public string Configuration { get; init; } = default!; // JSON string
    public int Order { get; init; }
}

public class UpdateAnalyticRequestValidator : AbstractValidator<UpdateAnalyticRequest>
{
    public UpdateAnalyticRequestValidator()
    {
        RuleFor(x => x.AnalyticId)
            .NotEmpty()
            .WithMessage("Analytic ID is required.");

        RuleFor(x => x.RecordId)
            .NotEmpty()
            .WithMessage("Record ID is required.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100)
            .WithMessage("Name is required and cannot exceed 100 characters.");

        RuleFor(x => x.Configuration)
            .NotEmpty()
            .WithMessage("Configuration is required.");

        RuleFor(x => x.Order)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Order must be greater than or equal to 0.");
    }
}

