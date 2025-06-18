using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RecordTracker.Infrastructure.Persistence;
using RecordTracker.Infrastructure.Repositories;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.Infrastructure.Configuration;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // DbContext
        services.AddDbContext<RecordTrackerDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // Repositories
        services.AddScoped<IRecordTypeRepository, RecordTypeRepository>();
        services.AddScoped<IUserRepository, UserRepository>();

        return services;
    }
}
