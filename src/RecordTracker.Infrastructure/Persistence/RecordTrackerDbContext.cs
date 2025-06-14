using Microsoft.EntityFrameworkCore;
using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.Infrastructure.Persistence;

public class RecordTrackerDbContext : DbContext
{
    public RecordTrackerDbContext(DbContextOptions<RecordTrackerDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(RecordTrackerDbContext).Assembly);
    }
}