using RecordTracker.API.Configuration.Options;

namespace RecordTracker.API.Configuration;

public static class CorsConfiguration
{
    private const string POLICY_NAME = "AllowConfiguredOrigins";
    private const string CORS_CONFIG_KEY = "Cors";

    public static IServiceCollection AddCorsPolicy(this IServiceCollection services, IConfiguration config)
    {
        var corsConfigSection = config.GetSection(CORS_CONFIG_KEY);
        // Bind options from appsettings
        services.Configure<CorsOptions>(corsConfigSection);

        services.AddCors(options =>
        {
            var corsOptions = corsConfigSection.Get<CorsOptions>() ?? new CorsOptions();
            options.AddPolicy(POLICY_NAME, builder =>
            {
                builder.WithOrigins(corsOptions.AllowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        return services;
    }

    public static string GetPolicyName() => POLICY_NAME;
}