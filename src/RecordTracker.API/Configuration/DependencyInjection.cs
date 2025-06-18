using FluentValidation;
using RecordTracker.API.Mappings;

namespace RecordTracker.API.Configuration;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        var currentAssembly = typeof(Program).Assembly;
        
        services.AddAutoMapper(typeof(MappingProfile));
        services.AddHttpContextAccessor();

        // Services
        services.Scan(scan => scan
            .FromAssemblies(currentAssembly)
            .AddClasses(c => c.Where(t => t.Name.EndsWith("Service")))
            .AsImplementedInterfaces()
            .WithScopedLifetime());

        // Register all FluentValidation validators
        services.AddValidatorsFromAssembly(currentAssembly);

        // Register all Handler classes
        services.Scan(scan => scan
            .FromAssemblies(currentAssembly)
            .AddClasses(c => c.Where(t => t.Name.EndsWith("Handler")))
            .AsSelf()
            .WithScopedLifetime());

        return services;
    }
}