namespace RecordTracker.API.Common;

public interface IEndpointDefinition
{
    void RegisterEndpoints(IEndpointRouteBuilder app);
}
