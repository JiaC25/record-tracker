namespace RecordTracker.Infrastructure.Entities;

public class RecordType
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    
    // FK
    public Guid? CreatedByUserId { get; set; }

    // Navigation
    public User? CreatedByUser {  get; set; }
    public ICollection<RecordField> RecordFields { get; set; } = new List<RecordField>();
    public ICollection<RecordItem> RecordItems { get; set; } = new List<RecordItem>();
}
