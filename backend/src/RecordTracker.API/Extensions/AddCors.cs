namespace RecordTracker.API.Configuration.CorsPolicy;

public static class AddCorsExtension
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