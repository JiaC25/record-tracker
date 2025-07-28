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

if (app.Environment.IsDevelopment())
{
    // Apply any pending migration
    app.Services.ApplyDevelopmentMigrations();

    // Enable Swagger
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

app.Run();
