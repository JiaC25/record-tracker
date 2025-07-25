﻿using Microsoft.EntityFrameworkCore;
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
        builder.Property(x => x.RecordId)
            .IsRequired();
        
        builder.HasIndex(x => x.CreatedByUserId);

        // Navigation
        builder.HasOne(x => x.CreatedByUser) // TODO: Add RecordItems collection nav to User model and move OnDelete config there
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.DeletedByUser)
            .WithMany()
            .HasForeignKey(x => x.DeletedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Record)
            .WithMany(x => x.RecordItems)
            .HasForeignKey(x => x.RecordId);

        builder.HasMany(x => x.RecordValues)
            .WithOne(x => x.RecordItem)
            .HasForeignKey(x => x.RecordItemId)
            .OnDelete(DeleteBehavior.Cascade);

        // Global filter to exclude soft-deleted records
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}