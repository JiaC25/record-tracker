namespace RecordTracker.API.Configuration.CorsPolicy;

public class CorsPolicyConfig
{
    public string Origin { get; set; } = "";
}

public static class CorsPolicy
{
    const string ORIGIN = "http://localhost:3000";
    public static readonly string POLICY_ALLOW_FRONTEND_DEV = "AllowFrontendDev";
    public static IServiceCollection AddCorsPolicy(this IServiceCollection services, CorsPolicyConfig config)
    {
        return services.AddCors(options =>
        {
            options.AddPolicy(POLICY_ALLOW_FRONTEND_DEV, policy =>
            {
                policy.WithOrigins(config.Origin)
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });
    }
}