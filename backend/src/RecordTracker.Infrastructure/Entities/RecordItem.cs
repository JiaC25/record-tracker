namespace RecordTracker.Infrastructure.Entities;

public class RecordItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // FK
    public Guid RecordTypeId { get; set; }
    public Guid CreatedByUserId { get; set; }

    // Soft Delete
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
    public Guid? DeletedByUserId { get; set; }

    // Navigation
    public User CreatedByUser {  get; set; } = default!;
    public User? DeletedByUser { get; set; }
    public RecordType RecordType { get; set; } = default!;
    public ICollection<RecordValue> RecordValues { get; set; } = new List<RecordValue>();
}

