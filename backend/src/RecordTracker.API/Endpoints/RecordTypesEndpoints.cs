using RecordTracker.API.Common;
using RecordTracker.API.Features.RecordTypes;

namespace RecordTracker.API.Endpoints;

public class RecordTypesEndpoints : IEndpointDefinition
{
    public void RegisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/recordtypes").WithTags("RecordTypes");

        #region Get
        group.MapGet("/", async (
            GetAllUserRecordTypesHandler handler,
            CancellationToken ct) =>
        {
            return await handler.HandleAsync(ct);
        });

        group.MapGet("/{id:guid}", async (
            [AsParameters] GetRecordTypeByIdRequest request,
            GetRecordTypeByIdHandler handler,
            CancellationToken ct) =>
        {
            return await handler.HandleAsync(request, ct);
        });
        #endregion

        #region Post
        group.MapPost("/", async (
            CreateRecordTypeRequest request,
            CreateRecordTypeHandler handler,
            CancellationToken ct) =>
        {
            return await handler.HandleAsync(request, ct);
        });
        #endregion

        #region Delete
        group.MapDelete("/{id:guid}", async (
            [AsParameters] DeleteRecordTypeRequest request,
            DeleteRecordTypeHandler handler,
            CancellationToken ct) =>
        {
            return await handler.HandleAsync(request, ct);
        });
        #endregion
    }
}
