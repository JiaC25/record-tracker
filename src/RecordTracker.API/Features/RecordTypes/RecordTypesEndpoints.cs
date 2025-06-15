using RecordTracker.API.Common;

namespace RecordTracker.API.Features.RecordTypes;

public class RecordTypesEndpoints : IEndpointDefinition
{
    public void RegisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/recordtypes").WithTags("RecordTypes");

        group.MapPost("/", async (
            CreateRecordTypeRequest request,
            CreateRecordTypeHandler handler) =>
        {
            return await handler.HandleAsync(request);
        });

        group.MapGet("/", async (GetAllUserRecordTypesHandler handler) =>
        {
            return await handler.HandleAsync();
        });
    }
}
