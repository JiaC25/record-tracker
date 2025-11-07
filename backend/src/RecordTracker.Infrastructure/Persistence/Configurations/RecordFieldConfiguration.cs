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
        
        builder.Property(x => x.Id)
            .ValueGeneratedOnAdd();
        
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
        builder.Property(x => x.RecordId)
            .IsRequired();

        // Navigation
        builder.HasOne(x => x.Record)
            .WithMany(x => x.RecordFields)
            .HasForeignKey(x => x.RecordId);

        builder.HasMany(x => x.RecordValues)
            .WithOne(x => x.RecordField)
            .HasForeignKey(x => x.RecordFieldId)
            .OnDelete(DeleteBehavior.Cascade);

        // Global filter to exclude soft-deleted records
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
