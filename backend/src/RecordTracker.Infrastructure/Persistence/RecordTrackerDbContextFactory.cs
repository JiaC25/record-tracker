using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace RecordTracker.Infrastructure.Persistence;

public class RecordTrackerDbContextFactory : IDesignTimeDbContextFactory<RecordTrackerDbContext>
{
    public RecordTrackerDbContext CreateDbContext(string[] args)
    {
        // Build config manually so CLI can access it
        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false)
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<RecordTrackerDbContext>();
        var connectionString = config.GetConnectionString("DefaultConnection");

        optionsBuilder.UseNpgsql(connectionString);

        return new RecordTrackerDbContext(optionsBuilder.Options);
    }
}
