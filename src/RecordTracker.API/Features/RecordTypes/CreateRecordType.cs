using AutoMapper;
using FluentValidation;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Entities;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.RecordTypes
{
    public record CreateRecordTypeRequest(string Name, string? Description);

    public class CreateRecordTypeValidator : AbstractValidator<CreateRecordTypeRequest>
    {
        public CreateRecordTypeValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.Description)
                .MaximumLength(500);
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

        public async Task<IResult> HandleAsync(CreateRecordTypeRequest request)
        {
            var validationResult = await _validator.ValidateAsync(request);
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
            };

            await _recordTypeRepository.AddAsync(recordType);

            var dto = _mapper.Map<RecordTypeDto>(recordType);

            return Results.Created($"/api/recordtypes/{dto.Id}", dto);
        }
    }
}
