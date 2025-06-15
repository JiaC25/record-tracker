using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.Infrastructure.Persistence.Configurations;

public class RecordFieldConfiguration : IEntityTypeConfiguration<RecordField>
{
    public void Configure(EntityTypeBuilder<RecordField> builder)
    {
        builder.ToTable("RecordField");

        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.FieldType)
            .IsRequired();

        builder.Property(x => x.IsRequired)
            .IsRequired();
        
        builder.Property(x => x.Order)
            .IsRequired();

        // FK
        builder.Property(x => x.RecordTypeId)
            .IsRequired();

        // Navigation
        builder.HasOne(x => x.RecordType)
            .WithMany(x => x.RecordFields)
            .HasForeignKey(x => x.RecordTypeId);

        builder.HasMany(x => x.RecordValues)
            .WithOne(x => x.RecordField)
            .HasForeignKey(x => x.RecordFieldId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
