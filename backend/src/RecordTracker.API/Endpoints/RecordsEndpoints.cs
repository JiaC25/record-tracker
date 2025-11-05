using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecordTracker.API.Common;
using RecordTracker.API.Features.Records;
using RecordTracker.API.Features.Records.Models;

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
        group.MapGet("/{recordId:guid}", async (
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

        group.MapPost("/{recordId:guid}/items", async (
            Guid recordId,
            [FromBody] List<RecordItemInput> items,
            CreateRecordItemsHandler handler,
            CancellationToken ct) =>
        {
            var request = new CreateRecordItemsRequest(recordId) { Items = items };
            return await handler.HandleAsync(request, ct);
        });
        #endregion

        #region Put
        // Update Record (metadata + fields)
        group.MapPut("/{recordId:guid}", async (
            Guid recordId,
            [FromBody] UpdateRecordRequest request,
            UpdateRecordHandler handler,
            CancellationToken ct) =>
        {
            // Verify that the recordId in route matches the RecordId in request body
            if (recordId != request.RecordId)
                return Results.BadRequest(new { Message = "The recordId in the route does not match the RecordId in the request body." });

            return await handler.HandleAsync(request, ct);
        });

        group.MapPut("/{recordId:guid}/items/{itemId:guid}", async (
            Guid recordId,
            Guid itemId,
            [FromBody] RecordItemInput item,
            UpdateRecordItemHandler handler,
            CancellationToken ct) =>
        {
            var request = new UpdateRecordItemRequest(recordId, itemId) { Item = item };
            return await handler.HandleAsync(request, ct);
        });
        #endregion

        #region Delete
        group.MapDelete("/{recordId:guid}", async (
            [AsParameters] DeleteRecordRequest request,
            DeleteRecordHandler handler,
            CancellationToken ct) =>
        {
            return await handler.HandleAsync(request, ct);
        });

        group.MapDelete("/{recordId:guid}/items/{itemId:guid}", async (
            [AsParameters] DeleteRecordItemRequest request,
            DeleteRecordItemHandler handler,
            CancellationToken ct) =>
        {
            return await handler.HandleAsync(request, ct);
        });
        #endregion
    }
}
