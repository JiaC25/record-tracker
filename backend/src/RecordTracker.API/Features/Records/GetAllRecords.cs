using AutoMapper;
using RecordTracker.API.Features.Records.Dtos;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Records;

public class GetAllUserRecordsHandler
{
    private readonly IRecordRepository _recordRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    public GetAllUserRecordsHandler(
        IRecordRepository recordRepository,
        ICurrentUserService currentUserService,
        IMapper mapper)
    {
        _recordRepository = recordRepository;
        _currentUserService = currentUserService;
        _mapper = mapper;
    }

    public async Task<IResult> HandleAsync(CancellationToken ct = default)
    {
        var userId = _currentUserService.GetUserId();

        var records = await _recordRepository.GetAllWithFieldsAsync(userId, ct);

        var recordDtos = _mapper.Map<List<RecordSummaryDto>>(records);

        return Results.Ok(recordDtos);
    }
}
