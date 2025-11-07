namespace RecordTracker.Infrastructure.Entities;

public class RecordValue
{
    public Guid Id { get; set; }
    public string Value { get; set; } = default!;

    // FK
    public Guid RecordItemId { get; set; }
    public Guid RecordFieldId { get; set; }

    // Navigation
    public RecordItem RecordItem { get; set; } = default!;
    public RecordField RecordField { get; set; } = default!;
}

