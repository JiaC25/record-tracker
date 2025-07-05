using FluentValidation;
using Microsoft.AspNetCore.Http.Json;
using RecordTracker.API.Mappings;
using System.Text.Json.Serialization;

namespace RecordTracker.API.Configuration;

public static class ApplicationConfiguration
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        var currentAssembly = typeof(Program).Assembly;

        // Allow input of enums as strings in JSON
        services.Configure<JsonOptions>(options =>
        {
            options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });

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