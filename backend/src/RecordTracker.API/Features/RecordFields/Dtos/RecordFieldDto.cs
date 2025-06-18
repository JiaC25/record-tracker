using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.API.Features.RecordFields.Dtos;

public class RecordFieldDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public FieldType FieldType { get; set; }
    public bool IsRequired { get; set; }
    public int Order { get; set; }
}
