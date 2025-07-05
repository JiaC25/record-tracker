namespace RecordTracker.API.Features.Records.Dtos;

public class RecordSummaryDto
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public List<RecordFieldDto> RecordFields { get; set; } = [];
}
