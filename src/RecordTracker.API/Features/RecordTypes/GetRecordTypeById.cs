using AutoMapper;
using FluentValidation;
using RecordTracker.API.Features.RecordTypes.Dtos;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.RecordTypes;

public record GetRecordTypeByIdRequest(Guid Id);

public class GetRecordTypeByIdValidator : AbstractValidator<GetRecordTypeByIdRequest>
{
    public GetRecordTypeByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Record Type ID is required and cannot be an empty GUID.");
    }
}

public class GetRecordTypeByIdHandler
{
    private readonly IValidator<GetRecordTypeByIdRequest> _validator;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;
    private readonly IRecordTypeRepository _recordTypeRepository;

    public GetRecordTypeByIdHandler(
        IValidator<GetRecordTypeByIdRequest> validator,
        IMapper mapper,
        ICurrentUserService currentUserService,
        IRecordTypeRepository recordTypeRepository)
    {
        _validator = validator;
        _mapper = mapper;
        _currentUserService = currentUserService;
        _recordTypeRepository = recordTypeRepository;
    }

    public async Task<IResult> HandleAsync(GetRecordTypeByIdRequest request, CancellationToken ct = default)
    {
        var validationResult = await _validator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var userId = _currentUserService.GetUserId();

        var recordType = await _recordTypeRepository.GetByIdWithFieldsAsync(request.Id, userId, ct);
        if (recordType == null)
            return Results.NotFound(new { Message = "Record Type not found." });

        var dto = _mapper.Map<RecordTypeDto>(recordType);

        return Results.Ok(dto);
    }
}
