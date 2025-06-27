using Microsoft.OpenApi.Models;

namespace RecordTracker.API.Configuration;

public static class SwaggerConfiguration
{
    /// <summary>
    /// Adds Swagger generation services to the specified <see cref="IServiceCollection"/>.
    /// </summary>
    /// <param name="services">The service collection to add the Swagger services to.</param>
    /// <returns>The updated service collection.</returns>
    /// 
    /// Launch url - http://localhost:5000/swagger/index.html
    public static IServiceCollection AddSwaggerGen(this IServiceCollection services)
    {
        return services.AddSwaggerGen(options =>
        {
            // Describe JWT authentication token scheme
            options.AddSecurityDefinition(JwtAuthenticationService.BEARER,
            new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey,
                Scheme = JwtAuthenticationService.BEARER,
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Enter 'Bearer {token}'"
            });

            // Enforce JWT authentication for all endpoints
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Id = JwtAuthenticationService.BEARER,
                            Type = ReferenceType.SecurityScheme
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });
    }
}