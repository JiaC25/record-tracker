using AutoMapper;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.RecordTypes;

public class GetAllUserRecordTypesHandler
{
    private readonly IRecordTypeRepository _recordTypeRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    public GetAllUserRecordTypesHandler(
        IRecordTypeRepository recordTypeRepository,
        ICurrentUserService currentUserService,
        IMapper mapper)
    {
        _recordTypeRepository = recordTypeRepository;
        _currentUserService = currentUserService;
        _mapper = mapper;
    }

    public async Task<IResult> HandleAsync(CancellationToken ct = default)
    {
        var userId = _currentUserService.GetUserId();

        var recordTypes = await _recordTypeRepository.GetAllByUserIdAsync(userId, ct);

        var recordTypeDtos = _mapper.Map<List<RecordTypeDto>>(recordTypes);

        return Results.Ok(recordTypeDtos);
    }
}
