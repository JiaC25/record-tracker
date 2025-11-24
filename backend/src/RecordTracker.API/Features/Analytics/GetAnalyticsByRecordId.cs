using AutoMapper;
using FluentValidation;
using RecordTracker.API.Features.Analytics.Models;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Analytics;

public record GetAnalyticsByRecordIdRequest(Guid RecordId);

public class GetAnalyticsByRecordIdValidator : AbstractValidator<GetAnalyticsByRecordIdRequest>
{
    public GetAnalyticsByRecordIdValidator()
    {
        RuleFor(x => x.RecordId)
            .NotEmpty()
            .WithMessage("Record ID is required and cannot be an empty GUID.");
    }
}

public class GetAnalyticsByRecordIdHandler
{
    private readonly IValidator<GetAnalyticsByRecordIdRequest> _validator;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;
    private readonly IAnalyticRepository _analyticRepository;
    private readonly IRecordRepository _recordRepository;

    public GetAnalyticsByRecordIdHandler(
        IValidator<GetAnalyticsByRecordIdRequest> validator,
        IMapper mapper,
        ICurrentUserService currentUserService,
        IAnalyticRepository analyticRepository,
        IRecordRepository recordRepository)
    {
        _validator = validator;
        _mapper = mapper;
        _currentUserService = currentUserService;
        _analyticRepository = analyticRepository;
        _recordRepository = recordRepository;
    }

    public async Task<IResult> HandleAsync(GetAnalyticsByRecordIdRequest request, CancellationToken ct = default)
    {
        var validationResult = await _validator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var userId = _currentUserService.GetUserId();

        // Verify record ownership
        var record = await _recordRepository.GetRecordByIdAsync(request.RecordId, userId, ct);
        if (record == null)
            return Results.NotFound(new { Message = "Record not found or user has no access." });

        var analytics = await _analyticRepository.GetAnalyticsByRecordIdAsync(request.RecordId, userId, ct);
        var dtos = _mapper.Map<List<AnalyticDto>>(analytics);

        return Results.Ok(dtos);
    }
}

