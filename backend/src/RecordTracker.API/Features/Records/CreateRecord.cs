using AutoMapper;
using FluentValidation;
using RecordTracker.API.Features.RecordFields;
using RecordTracker.API.Features.RecordFields.Dtos;
using RecordTracker.API.Features.Records.Dtos;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Entities;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Records
{
    public record CreateRecordRequest
    {
        public string Name { get; init; } = default!;
        public string? Description { get; init; }
        public List<CreateRecordFieldDto> RecordFields { get; init; } = [];
    }

    public class CreateRecordValidator : AbstractValidator<CreateRecordRequest>
    {
        public CreateRecordValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.Description)
                .MaximumLength(500);

            RuleForEach(x => x.RecordFields)
                .SetValidator(new CreateRecordFieldValidator());
        }
    }

    public class CreateRecordHandler
    {
        private readonly IValidator<CreateRecordRequest> _validator;
        private readonly IRecordRepository _recordRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IMapper _mapper;

        public CreateRecordHandler(
            IValidator<CreateRecordRequest> validator,
            IRecordRepository recordRepository,
            ICurrentUserService currentUserService,
            IMapper mapper)
        {
            _validator = validator;
            _recordRepository = recordRepository;
            _currentUserService = currentUserService;
            _mapper = mapper;
        }

        public async Task<IResult> HandleAsync(CreateRecordRequest request, CancellationToken ct = default)
        {
            var validationResult = await _validator.ValidateAsync(request, ct);
            if (!validationResult.IsValid)
                return Results.ValidationProblem(validationResult.ToDictionary());

            var userId = _currentUserService.GetUserId();
            
            var record = new Record
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow,
                CreatedByUserId = userId,
                RecordFields = _mapper.Map<List<RecordField>>(request.RecordFields)
            };

            await _recordRepository.AddAsync(record, ct);

            var dto = _mapper.Map<RecordSummaryDto>(record);

            return Results.Created($"/api/records/{dto.Id}", dto);
        }
    }
}
