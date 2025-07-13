using RecordTracker.API.Common;
using RecordTracker.API.Features.Auth;

namespace RecordTracker.API.Endpoints;

public class AuthEndpoints : IEndpointDefinition
{
    public void RegisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Auth");

        group.MapPost("/signup", async (CreateUserRequest request, CreateUserHandler handler) =>
        {
            return await handler.HandleAsync(request);
        }).ProduceCreateUserApiDocumentation();

        group.MapPost("/login", async (LoginUserRequest request, LoginUserHandler handler) =>
        {
            return await handler.HandleAsync(request);
        }).ProduceLoginUserApiDocumentation();

        group.MapPost("/logout", (LogoutUserHandler handler) =>
        {
            return handler.Handle();
        });
    }
}