using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.Infrastructure.Persistence.Configurations;

public class RecordTypeConfiguration : IEntityTypeConfiguration<RecordType>
{
    public void Configure(EntityTypeBuilder<RecordType> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasMaxLength(500);

        // FK
        builder.HasIndex(x => x.CreatedByUserId);

        // Navigation
        builder.HasOne(x => x.CreatedByUser) // TODO: Add RecordTypes collection nav to User model and move OnDelete config there
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(x => x.RecordFields)
            .WithOne(x => x.RecordType)
            .HasForeignKey(x => x.RecordTypeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.RecordItems)
            .WithOne(x => x.RecordType)
            .HasForeignKey(x => x.RecordTypeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
