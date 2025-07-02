using AutoMapper;
using FluentValidation;
using RecordTracker.API.Features.Records.Dtos;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Records;

public record GetRecordByIdRequest(Guid Id);

public class GetRecordByIdValidator : AbstractValidator<GetRecordByIdRequest>
{
    public GetRecordByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Record Type ID is required and cannot be an empty GUID.");
    }
}

public class GetRecordByIdHandler
{
    private readonly IValidator<GetRecordByIdRequest> _validator;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;
    private readonly IRecordRepository _recordRepository;

    public GetRecordByIdHandler(
        IValidator<GetRecordByIdRequest> validator,
        IMapper mapper,
        ICurrentUserService currentUserService,
        IRecordRepository recordRepository)
    {
        _validator = validator;
        _mapper = mapper;
        _currentUserService = currentUserService;
        _recordRepository = recordRepository;
    }

    public async Task<IResult> HandleAsync(GetRecordByIdRequest request, CancellationToken ct = default)
    {
        var validationResult = await _validator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var userId = _currentUserService.GetUserId();

        var record = await _recordRepository.GetByIdWithFieldsAsync(request.Id, userId, ct);
        if (record == null)
            return Results.NotFound(new { Message = "Record Type not found." });

        var dto = _mapper.Map<RecordDto>(record);

        return Results.Ok(dto);
    }
}
