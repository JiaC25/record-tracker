using FluentValidation;

namespace RecordTracker.API.Features.Records.Models;

public record RecordItemInput
{
    public List<RecordValueInput> Values { get; init; } = [];
}

public class RecordItemInputValidator : AbstractValidator<RecordItemInput>
{
    public RecordItemInputValidator()
    {
        RuleFor(x => x.Values).NotEmpty().WithMessage("Item must have at least one Value");

        RuleForEach(x => x.Values).SetValidator(new RecordValueInputValidator());
    }
}

public record RecordValueInput
{
    public Guid RecordFieldId { get; init; }
    public string Value { get; init; } = default!;
}

public class RecordValueInputValidator : AbstractValidator<RecordValueInput>
{
    public RecordValueInputValidator()
    {
        RuleFor(x => x.RecordFieldId).NotEmpty().WithMessage("Value must have an associated Field");
        RuleFor(x => x.Value).NotEmpty().WithMessage("Value must not be empty");
    }
}

