using FluentValidation;
using RecordTracker.API.Features.RecordFields.Dtos;

namespace RecordTracker.API.Features.RecordFields
{
    public record CreateRecordFieldRequest(CreateRecordFieldDto createRecordFieldDto);

    public class CreateRecordFieldValidator : AbstractValidator<CreateRecordFieldDto>
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

    public class CreateRecordFieldHandler
    {
        private readonly IValidator<CreateRecordFieldDto> _validator;

        public CreateRecordFieldHandler(IValidator<CreateRecordFieldDto> validator)
        {
            _validator = validator;
        }

        public async Task<IResult> HandleAsync(CreateRecordFieldRequest request)
        {
            var validationResult = await _validator.ValidateAsync(request.createRecordFieldDto);
            if (!validationResult.IsValid)
                return Results.ValidationProblem(validationResult.ToDictionary());

            // Implement core logic here

            return Results.Ok();
        }
    }
}
