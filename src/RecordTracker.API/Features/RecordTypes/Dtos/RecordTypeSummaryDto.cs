using RecordTracker.API.Features.RecordFields.Dtos;

namespace RecordTracker.API.Features.RecordTypes.Dtos;

public class RecordTypeSummaryDto
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public List<RecordFieldDto> RecordFields { get; set; } = [];
}
