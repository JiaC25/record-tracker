using Microsoft.EntityFrameworkCore;
using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.Infrastructure.Persistence;

public class RecordTrackerDbContext : DbContext
{
    public RecordTrackerDbContext(DbContextOptions<RecordTrackerDbContext> options) : base(options) { }

    public DbSet<User> User => Set<User>();
    public DbSet<Record> Record => Set<Record>();
    public DbSet<RecordField> RecordField => Set<RecordField>();
    public DbSet<RecordItem> RecordItem => Set<RecordItem>();
    public DbSet<RecordValue> RecordValue => Set<RecordValue>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(RecordTrackerDbContext).Assembly);
    }
}