using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.Infrastructure.Persistence.Configurations;

public class RecordConfiguration : IEntityTypeConfiguration<Record>
{
    public void Configure(EntityTypeBuilder<Record> builder)
    {
        builder.ToTable("Record");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .ValueGeneratedOnAdd();

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
        builder.HasOne(x => x.CreatedByUser) // TODO: Add Records collection nav to User model and move OnDelete config there
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(x => x.DeletedByUser)
            .WithMany()
            .HasForeignKey(x => x.DeletedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.RecordFields)
            .WithOne(x => x.Record)
            .HasForeignKey(x => x.RecordId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.RecordItems)
            .WithOne(x => x.Record)
            .HasForeignKey(x => x.RecordId)
            .OnDelete(DeleteBehavior.Cascade);

        // Global filter to exclude soft-deleted records
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
