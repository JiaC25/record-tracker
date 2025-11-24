namespace RecordTracker.API.Features.Analytics.Models;

public class AnalyticDto
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Name { get; set; } = default!;
    public string Type { get; set; } = default!; // Serialized enum as string
    public string Configuration { get; set; } = default!; // JSON string
    public int Order { get; set; }
    public Guid RecordId { get; set; }
}

