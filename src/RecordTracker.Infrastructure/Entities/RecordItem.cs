namespace RecordTracker.Infrastructure.Entities;

public class RecordItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // FK
    public Guid RecordTypeId { get; set; }
    public Guid? CreatedByUserId { get; set; }

    // Navigation
    public User? CreatedByUser {  get; set; }
    public RecordType RecordType { get; set; } = default!;
    public ICollection<RecordValue> RecordValues { get; set; } = new List<RecordValue>();
}

