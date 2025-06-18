namespace RecordTracker.Infrastructure.Entities;

public class RecordType
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    
    // FK
    public Guid CreatedByUserId { get; set; }

    // Soft Delete
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
    public Guid? DeletedByUserId { get; set; }

    // Navigation
    public User CreatedByUser { get; set; } = default!;
    public User? DeletedByUser { get; set; }
    public ICollection<RecordField> RecordFields { get; set; } = [];
    public ICollection<RecordItem> RecordItems { get; set; } = [];
}
