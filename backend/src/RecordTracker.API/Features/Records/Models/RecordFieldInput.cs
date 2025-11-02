using FluentValidation;
using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.API.Features.Records.Models;

public record RecordFieldInput
{
    public string Name { get; set; } = default!;
    public FieldType FieldType { get; set; }
    public bool IsRequired { get; set; }
    public int Order { get; set; }
}

public class RecordFieldInputValidator : AbstractValidator<RecordFieldInput>
{
    public RecordFieldInputValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.FieldType)
            .IsInEnum();

        RuleFor(x => x.Order)
            .GreaterThanOrEqualTo(0);
    }
}

