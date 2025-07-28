using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using RecordTracker.Infrastructure.Persistence;

namespace RecordTracker.Infrastructure.Configuration
{
    public static class DatabaseExtensions
    {
        public static void ApplyDevelopmentMigrations(this IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<RecordTrackerDbContext>();
            dbContext.Database.Migrate();
        }
    }
}
