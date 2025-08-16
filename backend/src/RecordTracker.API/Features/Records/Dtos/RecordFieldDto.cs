using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.API.Features.Records.Dtos;

public class RecordFieldDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public FieldType FieldType { get; set; }
    public bool IsRequired { get; set; }
    public bool IsPrimary { get; set; }
    public int Order { get; set; }
}
