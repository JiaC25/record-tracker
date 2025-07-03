using FluentValidation;
using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.API.Features.Records.Requests;

public record CreateRecordFieldRequest
{
    public string Name { get; set; } = default!;
    public FieldType FieldType { get; set; }
    public bool IsRequired { get; set; }
    public int Order { get; set; }
}

public class CreateRecordFieldValidator : AbstractValidator<Records.Requests.CreateRecordFieldRequest>
{
    public CreateRecordFieldValidator()
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