using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using RecordTracker.API.Configuration.Options;
using System.Text;

namespace RecordTracker.API.Configuration;

public static class AuthenticationConfiguration
{
    public const string BEARER = "Bearer";
    private const string AUTH_CONFIG_KEY = "Auth";

    public static IServiceCollection AddAuthenticationServices(this IServiceCollection services, IConfiguration config)
    {
        var authConfigSection = config.GetSection(AUTH_CONFIG_KEY);

        // Bind options from appsettings
        services.Configure<AuthOptions>(authConfigSection);

        var authOptions = authConfigSection.Get<AuthOptions>() ?? new AuthOptions();
        var secretKey = authOptions.Jwt.Key ?? throw new InvalidOperationException("JWT secret key (Auth:Jwt:Key) is missing in appsettings.json.");

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

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        if (context.Request.Cookies.TryGetValue(authOptions.Cookie.Name, out var token))
                        {
                            context.Token = token;
                        }

                        return Task.CompletedTask;
                    }
                };
            });

        services.AddAuthorization();

        return services;
    }
}