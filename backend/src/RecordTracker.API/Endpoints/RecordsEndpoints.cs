using RecordTracker.API.Common;
using RecordTracker.API.Features.Records;
using RecordTracker.API.Features.Records;

namespace RecordTracker.API.Endpoints;

public class RecordsEndpoints : IEndpointDefinition
{
    public void RegisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/records").WithTags("Records");

        #region Get
        group.MapGet("/", async (
            GetAllRecordsHandler handler,
            CancellationToken ct) =>
        {
            return await handler.HandleAsync(ct);
        });

        group.MapGet("/{id:guid}", async (
            [AsParameters] GetRecordByIdRequest request,
            GetRecordByIdHandler handler,
            CancellationToken ct) =>
        {
            return await handler.HandleAsync(request, ct);
        });
        #endregion

        #region Post
        group.MapPost("/", async (
            CreateRecordRequest request,
            CreateRecordHandler handler,
            CancellationToken ct) =>
        {
            return await handler.HandleAsync(request, ct);
        });
        #endregion

        #region Delete
        group.MapDelete("/{id:guid}", async (
            [AsParameters] DeleteRecordRequest request,
            DeleteRecordHandler handler,
            CancellationToken ct) =>
        {
            return await handler.HandleAsync(request, ct);
        });
        #endregion
    }
}
