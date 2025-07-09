using Microsoft.AspNetCore.Authorization;
using RecordTracker.API.Common;
using RecordTracker.API.Features.Records;

namespace RecordTracker.API.Endpoints;

public class RecordsEndpoints : IEndpointDefinition
{
    public void RegisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/records").WithTags("Records").RequireAuthorization();

        #region Get
        // Returns List<RecordSummaryDto> : Records with metadata only (without Items)
        group.MapGet("/", async (
            GetAllRecordsHandler handler,
            CancellationToken ct) =>
        {
            return await handler.HandleAsync(ct);
        });

        // Returns RecordDto : Full Record object (with Items)
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

        group.MapPost("/{id:guid}/items", async (
            Guid id,
            CreateRecordItemsRequest request,
            CreateRecordItemsHandler handler,
            CancellationToken ct) =>
        {
            return await handler.HandleAsync(id, request, ct);
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
