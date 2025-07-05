using Microsoft.IdentityModel.Tokens;

namespace RecordTracker.API.Configuration;

public static class AddJwtAuthenticationExtension
{
    public static string BEARER = "Bearer";
    public static string GetSecretKeyOrThrow(string? jwtKey = "Jwt:Key")
    {
        return jwtKey ?? throw new InvalidOperationException("Missing JWT secret key in appsettings.json");
    }

    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSecretKey = GetSecretKeyOrThrow(configuration["Jwt:Key"]);
        // Register the JwtTokenService from the configuration
        services.Configure<JwtConfig>(configuration.GetSection("Jwt"));
        services.AddAuthorization();
        services.AddAuthentication(BEARER)
            .AddJwtBearer(BEARER, options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwtSecretKey)),
                };
            });
        return services;
    }
}