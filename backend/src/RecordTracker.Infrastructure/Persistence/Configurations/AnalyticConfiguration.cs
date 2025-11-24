using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.Infrastructure.Persistence.Configurations;

public class AnalyticConfiguration : IEntityTypeConfiguration<Analytic>
{
    public void Configure(EntityTypeBuilder<Analytic> builder)
    {
        builder.ToTable("Analytic");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .ValueGeneratedOnAdd();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.Type)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(x => x.Configuration)
            .IsRequired()
            .HasColumnType("jsonb");

        builder.Property(x => x.Order)
            .IsRequired();

        // FK
        builder.HasIndex(x => x.RecordId);
        builder.HasIndex(x => x.CreatedByUserId);

        // Navigation
        builder.HasOne(x => x.CreatedByUser)
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.DeletedByUser)
            .WithMany()
            .HasForeignKey(x => x.DeletedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Record)
            .WithMany()
            .HasForeignKey(x => x.RecordId)
            .OnDelete(DeleteBehavior.Cascade);

        // Global filter to exclude soft-deleted analytics
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}

