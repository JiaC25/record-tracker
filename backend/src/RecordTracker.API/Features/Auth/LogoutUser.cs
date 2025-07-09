using Microsoft.AspNetCore.Http.HttpResults;
using RecordTracker.API.Services.Interfaces;

namespace RecordTracker.API.Features.Auth;

public record LogoutUserResponse(string Message);

public class LogoutUserHandler
{
    private readonly IAuthService _authService;
    public LogoutUserHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public Ok<LogoutUserResponse> Handle()
    {
        _authService.ClearAuthCookie();
        return TypedResults.Ok(new LogoutUserResponse("Logged out"));
    }
}
