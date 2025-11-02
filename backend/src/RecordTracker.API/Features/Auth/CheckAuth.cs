using Microsoft.AspNetCore.Http.HttpResults;
using RecordTracker.API.Features.Auth.Models;
using RecordTracker.API.Services;
using RecordTracker.API.Services.Interfaces;

namespace RecordTracker.API.Features.Auth;

public class CheckAuthHandler
{
    private readonly ICurrentUserService _currentUserService;

    public CheckAuthHandler(ICurrentUserService currentUserService)
    {
        _currentUserService = currentUserService;
    }

    public Results<Ok<UserDto>, UnauthorizedHttpResult> Handle()
    {
        try
        {
            var user = _currentUserService.GetCurrentUser();
            return TypedResults.Ok(user);
        }
        catch (UnauthorizedAccessException)
        {
            return TypedResults.Unauthorized();
        }
    }
}