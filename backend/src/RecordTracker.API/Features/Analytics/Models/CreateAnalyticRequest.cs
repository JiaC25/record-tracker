using FluentValidation;
using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.API.Features.Analytics.Models;

public record CreateAnalyticRequest
{
    public Guid RecordId { get; init; }
    public string Name { get; init; } = default!;
    public AnalyticType Type { get; init; }
    public string Configuration { get; init; } = default!; // JSON string
    public int Order { get; init; }
}

public class CreateAnalyticRequestValidator : AbstractValidator<CreateAnalyticRequest>
{
    public CreateAnalyticRequestValidator()
    {
        RuleFor(x => x.RecordId)
            .NotEmpty()
            .WithMessage("Record ID is required.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100)
            .WithMessage("Name is required and cannot exceed 100 characters.");

        RuleFor(x => x.Type)
            .IsInEnum()
            .WithMessage("Invalid analytic type.");

        RuleFor(x => x.Configuration)
            .NotEmpty()
            .WithMessage("Configuration is required.");

        RuleFor(x => x.Order)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Order must be greater than or equal to 0.");
    }
}

