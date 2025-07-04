using Microsoft.AspNetCore.Http.Json;
using RecordTracker.API.Common;
using RecordTracker.API.Configuration;
using RecordTracker.API.Configuration.CorsPolicy;
using RecordTracker.Infrastructure.Configuration;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Allow CORS for frontend development
builder.Services.AddCorsPolicy(new CorsPolicyConfig
{
    Origin = "http://localhost:3000" // Adjust this to your frontend's URL
});

// Add DB Infrastructure services
builder.Services.AddInfrastructureServices(builder.Configuration);
// Dependency injection for application services
builder.Services.AddApplicationServices();

// Set up JWT authentication
builder.Services.AddJwtAuthentication(builder.Configuration);

// Allow input of enums as strings in JSON
builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
// /swagger/index.html
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(CorsPolicy.POLICY_ALLOW_FRONTEND_DEV);
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapAllFeatureEndpoints();

app.Run();
