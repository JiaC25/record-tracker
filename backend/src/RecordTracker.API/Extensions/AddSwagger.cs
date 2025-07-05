using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

namespace RecordTracker.API.Configuration;

public static class AddSwaggerExtension
{
    /// <summary>
    /// Adds Swagger generation services to the specified <see cref="IServiceCollection"/>.
    /// </summary>
    /// <param name="services">The service collection to add the Swagger services to.</param>
    /// <returns>The updated service collection.</returns>
    /// 
    /// Launch url - http://localhost:5000/swagger/index.html
    public static IServiceCollection AddSwagger(this IServiceCollection services)
    {
        return services.AddSwaggerGen(options =>
        {
            // Describe JWT authentication token scheme
            options.AddSecurityDefinition(AddJwtAuthenticationExtension.BEARER,
            new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey,
                Scheme = AddJwtAuthenticationExtension.BEARER,
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
                            Id = AddJwtAuthenticationExtension.BEARER,
                            Type = ReferenceType.SecurityScheme
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });
    }

    public static RouteHandlerBuilder ProduceValidationProblemsApiDocumentation(
        this RouteHandlerBuilder builder,
        int statusCode,
        Microsoft.OpenApi.Any.OpenApiObject errors)
    {
        // This method can be used to produce API documentation if needed.
        return builder.Produces<ValidationProblemDetails>(statusCode)
            .WithOpenApi(op =>
            {
                op.Responses[statusCode.ToString()]
                .Content["application/json"]
                .Example = new Microsoft.OpenApi.Any.OpenApiObject
                {
                    ["title"] = new Microsoft.OpenApi.Any.OpenApiString("One or more validation errors occurred."),
                    ["status"] = new Microsoft.OpenApi.Any.OpenApiInteger(statusCode),
                    ["errors"] = errors
                };
                return op;
            });
    }
}