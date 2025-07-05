using RecordTracker.API.Common;
using RecordTracker.API.Configuration;
using RecordTracker.Infrastructure.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Configure Services
builder.Services
    .AddApplicationServices() // Dependency injection for application services
    .AddInfrastructureServices(builder.Configuration) // Add DB Infrastructure services
    .AddCorsPolicy(builder.Configuration)
    .AddJwtAuthentication(builder.Configuration)
    .AddEndpointsApiExplorer()
    .AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(CorsConfiguration.GetPolicyName());
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapAllFeatureEndpoints();

app.Run();
