namespace RecordTracker.Infrastructure.Entities;

public class RecordField
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = default!;
    public FieldType FieldType { get; set; }
    public bool IsRequired { get; set; } = false;
    public int Order { get; set; }

    // FK
    public Guid RecordId { get; set; }

    // Soft Delete
    public bool IsDeleted { get; set; } = false;

    // Navigation
    public Record Record { get; set; } = default!;
    public ICollection<RecordValue> RecordValues { get; set; } = new List<RecordValue>();
}
