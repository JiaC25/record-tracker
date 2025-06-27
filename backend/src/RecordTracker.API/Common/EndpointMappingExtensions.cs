namespace RecordTracker.API.Common;

// This class is responsible for mapping all feature endpoints defined in RecordTracker.API/Endpoints
public static class EndpointMappingExtensions
{
    public static void MapAllFeatureEndpoints(this IEndpointRouteBuilder app)
    {
        var endpointTypes = typeof(Program).Assembly
            .GetTypes()
            .Where(t => typeof(IEndpointDefinition).IsAssignableFrom(t) && !t.IsInterface && !t.IsAbstract);

        foreach (var endpointType in endpointTypes)
        {
            var instance = (IEndpointDefinition)Activator.CreateInstance(endpointType)!;
            instance.RegisterEndpoints(app);
        }
    }
}
