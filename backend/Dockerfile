# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files (for dependency resolution and layer caching)
COPY ["src/RecordTracker.API/RecordTracker.API.csproj", "src/RecordTracker.API/"]
COPY ["src/RecordTracker.Infrastructure/RecordTracker.Infrastructure.csproj", "src/RecordTracker.Infrastructure/"]

# Restore dependencies (this layer is cached if project files don't change)
RUN dotnet restore "src/RecordTracker.API/RecordTracker.API.csproj"

# Copy all source code
COPY src/ src/

# Build and publish the application
WORKDIR "/src/src/RecordTracker.API"
RUN dotnet build "RecordTracker.API.csproj" -c Release -o /app/build
RUN dotnet publish "RecordTracker.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published application from build stage
COPY --from=build /app/publish .

# Expose port (Railway will set PORT env var, but we expose default)
EXPOSE 5000

# Set environment to Production
ENV ASPNETCORE_ENVIRONMENT=Production

# Railway will set PORT environment variable at runtime
# We handle it in Program.cs

# Entry point
ENTRYPOINT ["dotnet", "RecordTracker.API.dll"]
