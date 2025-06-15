using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage;
using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.Infrastructure.Persistence.Configurations;

public class RecordItemConfiguration : IEntityTypeConfiguration<RecordItem>
{
    public void Configure(EntityTypeBuilder<RecordItem> builder)
    {
        builder.ToTable("RecordItem");

        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.CreatedAt)
            .IsRequired();

        // FK
        builder.Property(x => x.RecordTypeId)
            .IsRequired();
        
        builder.HasIndex(x => x.CreatedByUserId);

        // Navigation
        builder.HasOne(x => x.CreatedByUser) // TODO: Add RecordItems collection nav to User model and move OnDelete config there
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.RecordType)
            .WithMany(x => x.RecordItems)
            .HasForeignKey(x => x.RecordTypeId);

        builder.HasMany(x => x.RecordValues)
            .WithOne(x => x.RecordItem)
            .HasForeignKey(x => x.RecordItemId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}