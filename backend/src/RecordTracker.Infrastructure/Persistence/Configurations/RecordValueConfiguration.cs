using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.Infrastructure.Persistence.Configurations;

public class RecordValueConfiguration : IEntityTypeConfiguration<RecordValue>
{
    public void Configure(EntityTypeBuilder<RecordValue> builder)
    {
        builder.ToTable("RecordValue");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Value)
            .IsRequired();

        // FK
        builder.Property(x => x.RecordItemId)
            .IsRequired();

        builder.Property(x => x.RecordFieldId)
            .IsRequired();

        // Navigation
        builder.HasOne(x => x.RecordItem)
            .WithMany(x => x.RecordValues)
            .HasForeignKey(x => x.RecordItemId);

        builder.HasOne(x => x.RecordField)
            .WithMany(x => x.RecordValues)
            .HasForeignKey(x => x.RecordFieldId);
    }
}