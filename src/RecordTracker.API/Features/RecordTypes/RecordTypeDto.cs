namespace RecordTracker.API.Features.RecordTypes;

public class RecordTypeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
}
