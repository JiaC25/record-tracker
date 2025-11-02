using AutoMapper;
using FluentValidation;
using RecordTracker.API.Features.Records.Models;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Records;

public record GetRecordByIdRequest(Guid RecordId);

public class GetRecordByIdValidator : AbstractValidator<GetRecordByIdRequest>
{
    public GetRecordByIdValidator()
    {
        RuleFor(x => x.RecordId)
            .NotEmpty()
            .WithMessage("Record ID is required and cannot be an empty GUID.");
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

        var record = await _recordRepository.GetRecordByIdFullAsync(request.RecordId, userId, ct);
        if (record == null)
            return Results.NotFound(new { Message = "Record Type not found." });

        var dto = _mapper.Map<RecordDto>(record);

        // Mapping to the flattened RecordItems representation
        dto.RecordItems = record.RecordItems
            .OrderByDescending(item => item.CreatedAt)
            .Select(item =>
            {
                var dict = new Dictionary<string, string>
                {
                    ["id"] = item.Id.ToString(),
                    ["createdAt"] = item.CreatedAt.ToString("o")
                };

                // Populate all fields according to RecordFields orders
                // "record-field-guid" : "corresponding record value"
                foreach (var field in dto.RecordFields)
                {
                    var matchingValue = item.RecordValues.FirstOrDefault(v => v.RecordFieldId == field.Id);
                    dict[field.Id.ToString()] = matchingValue?.Value ?? "";
                }

                return dict;
            })
            .ToList();

        return Results.Ok(dto);
    }
}
