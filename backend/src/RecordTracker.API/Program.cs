using Microsoft.EntityFrameworkCore;
using RecordTracker.API.Common;
using RecordTracker.API.Configuration;
using RecordTracker.Infrastructure.Configuration;
using RecordTracker.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Configure Services
builder.Services
    .AddApplicationServices() // Dependency injection for application services
    .AddInfrastructureServices(builder.Configuration) // Add DB Infrastructure services
    .AddCorsPolicy(builder.Configuration)
    .AddAuthenticationServices(builder.Configuration)
    .AddEndpointsApiExplorer()
    .AddSwaggerGen();

var app = builder.Build();

// Apply database migrations
if (app.Environment.IsDevelopment())
{
    app.Services.ApplyDevelopmentMigrations();
}
else if (app.Environment.IsProduction())
{
    // Apply migrations in production (Railway will handle this on startup)
    app.Services.ApplyProductionMigrations();
}

if (app.Environment.IsDevelopment())
{
    // Enable Swagger only in development
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.ConfigObject.AdditionalItems["withCredentials"] = true;
    });
}

app.UseHttpsRedirection();
app.UseCors(CorsConfiguration.GetPolicyName());
app.UseAuthentication();
app.UseAuthorization();

app.MapAllFeatureEndpoints();

// Configure port from Railway's PORT environment variable, or default to 5000
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Urls.Add($"http://+:{port}");

app.Run();
