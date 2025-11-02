namespace RecordTracker.API.Features.Records.Models;

public class RecordDto
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public List<RecordFieldDto> RecordFields { get; set; } = [];

    /// <summary>
    /// Flattened representation of RecordItems to make it easier for frontend table rendering
    /// Each item is a key-value dictionary containing:
    /// - "id" : string (RecordItem ID)
    /// - "createdAt" : ISO 8601 datetime string
    /// - one entry per RecordField (fieldId as key, value as string)
    /// </summary>
    public List<Dictionary<string, string>> RecordItems { get; set; } = [];
}
