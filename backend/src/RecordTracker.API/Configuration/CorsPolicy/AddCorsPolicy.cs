namespace RecordTracker.API.Configuration.CorsPolicy;

public static class CorsPolicy
{
    const string ORIGIN = "http://localhost:3000";
    const string POLICY_ALLOW_FRONTEND_DEV = "AllowFrontendDev";
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