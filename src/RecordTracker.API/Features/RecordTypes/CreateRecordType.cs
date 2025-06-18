using AutoMapper;
using FluentValidation;
using RecordTracker.API.Features.RecordFields;
using RecordTracker.API.Features.RecordFields.Dtos;
using RecordTracker.API.Features.RecordTypes.Dtos;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Entities;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.RecordTypes
{
    public record CreateRecordTypeRequest
    {
        public string Name { get; init; } = default!;
        public string? Description { get; init; }
        public List<CreateRecordFieldDto> RecordFields { get; init; } = [];
    }

    public class CreateRecordTypeValidator : AbstractValidator<CreateRecordTypeRequest>
    {
        public CreateRecordTypeValidator()
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

    public class CreateRecordTypeHandler
    {
        private readonly IValidator<CreateRecordTypeRequest> _validator;
        private readonly IRecordTypeRepository _recordTypeRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IMapper _mapper;

        public CreateRecordTypeHandler(
            IValidator<CreateRecordTypeRequest> validator,
            IRecordTypeRepository recordTypeRepository,
            ICurrentUserService currentUserService,
            IMapper mapper)
        {
            _validator = validator;
            _recordTypeRepository = recordTypeRepository;
            _currentUserService = currentUserService;
            _mapper = mapper;
        }

        public async Task<IResult> HandleAsync(CreateRecordTypeRequest request, CancellationToken ct = default)
        {
            var validationResult = await _validator.ValidateAsync(request, ct);
            if (!validationResult.IsValid)
                return Results.ValidationProblem(validationResult.ToDictionary());

            var userId = _currentUserService.GetUserId();
            
            var recordType = new RecordType
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow,
                CreatedByUserId = userId,
                RecordFields = _mapper.Map<List<RecordField>>(request.RecordFields)
            };

            await _recordTypeRepository.AddAsync(recordType, ct);

            var dto = _mapper.Map<RecordTypeSummaryDto>(recordType);

            return Results.Created($"/api/recordtypes/{dto.Id}", dto);
        }
    }
}
