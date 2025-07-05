using Microsoft.IdentityModel.Tokens;
using RecordTracker.API.Configuration.Options;
using System.Text;

namespace RecordTracker.API.Configuration;

public static class JwtConfiguration
{
    public const string BEARER = "Bearer";
    private const string JWT_CONFIG_KEY = "Jwt";

    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration config)
    {
        var jwtConfigSection = config.GetSection(JWT_CONFIG_KEY);

        // Bind options from appsettings
        services.Configure<JwtOptions>(jwtConfigSection);

        var jwtOptions = jwtConfigSection.Get<JwtOptions>() ?? new JwtOptions();
        var secretKey = jwtOptions.Key ?? throw new InvalidOperationException("JWT secret key (Jwt:Key) is missing in appsettings.json.");

        services.AddAuthentication(BEARER)
            .AddJwtBearer(BEARER, options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false, // Todo: these config can be in appsettings as well
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                };
            });

        services.AddAuthorization();

        return services;
    }
}