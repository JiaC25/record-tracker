using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecordTracker.API.Common;
using RecordTracker.API.Features.Analytics;
using RecordTracker.API.Features.Analytics.Models;

namespace RecordTracker.API.Endpoints;

public class AnalyticsEndpoints : IEndpointDefinition
{
    public void RegisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/records/{recordId:guid}/analytics").WithTags("Analytics").RequireAuthorization();

        #region Get
        group.MapGet("/", async (
            Guid recordId,
            GetAnalyticsByRecordIdHandler handler,
            CancellationToken ct) =>
        {
            var request = new GetAnalyticsByRecordIdRequest(recordId);
            return await handler.HandleAsync(request, ct);
        });
        #endregion

        #region Post
        group.MapPost("/", async (
            Guid recordId,
            [FromBody] CreateAnalyticRequest request,
            CreateAnalyticHandler handler,
            CancellationToken ct) =>
        {
            // Verify that the recordId in route matches the RecordId in request body
            if (recordId != request.RecordId)
                return Results.BadRequest(new { Message = "The recordId in the route does not match the RecordId in the request body." });

            return await handler.HandleAsync(request, ct);
        });
        #endregion

        #region Put
        group.MapPut("/{analyticId:guid}", async (
            Guid recordId,
            Guid analyticId,
            [FromBody] UpdateAnalyticRequest request,
            UpdateAnalyticHandler handler,
            CancellationToken ct) =>
        {
            // Verify that the recordId and analyticId in route match the request body
            if (recordId != request.RecordId)
                return Results.BadRequest(new { Message = "The recordId in the route does not match the RecordId in the request body." });
            if (analyticId != request.AnalyticId)
                return Results.BadRequest(new { Message = "The analyticId in the route does not match the AnalyticId in the request body." });

            return await handler.HandleAsync(request, ct);
        });

        group.MapPut("/order", async (
            Guid recordId,
            [FromBody] UpdateAnalyticsOrderRequest request,
            UpdateAnalyticsOrderHandler handler,
            CancellationToken ct) =>
        {
            // Verify that the recordId in route matches the RecordId in request body
            if (recordId != request.RecordId)
                return Results.BadRequest(new { Message = "The recordId in the route does not match the RecordId in the request body." });

            return await handler.HandleAsync(request, ct);
        });
        #endregion

        #region Delete
        group.MapDelete("/{analyticId:guid}", async (
            [AsParameters] DeleteAnalyticRequest request,
            DeleteAnalyticHandler handler,
            CancellationToken ct) =>
        {
            return await handler.HandleAsync(request, ct);
        });
        #endregion
    }
}

