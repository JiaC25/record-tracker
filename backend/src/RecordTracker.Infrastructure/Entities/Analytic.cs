namespace RecordTracker.Infrastructure.Entities;

public class Analytic
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string Name { get; set; } = default!;
    public AnalyticType Type { get; set; }
    public string Configuration { get; set; } = default!; // JSON blob
    public int Order { get; set; }

    // FK
    public Guid RecordId { get; set; }
    public Guid CreatedByUserId { get; set; }

    // Soft Delete
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
    public Guid? DeletedByUserId { get; set; }

    // Navigation
    public User CreatedByUser { get; set; } = default!;
    public User? DeletedByUser { get; set; }
    public Record Record { get; set; } = default!;
}

