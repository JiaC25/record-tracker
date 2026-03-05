using Microsoft.AspNetCore.Http.HttpResults;
using RecordTracker.API.Features.Auth.Models;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Auth;

public class DemoLoginUserHandler
{
    private readonly IUserRepository _userRepository;
    private readonly IAuthService _authService;

    // TODO: maybe move this to appsettings
    private const string DemoUserEmail = "demo@recordtracker.com";

    public DemoLoginUserHandler(IUserRepository userRepository, IAuthService authService)
    {
        _userRepository = userRepository;
        _authService = authService;
    }

    public async Task<Results<Ok<UserDto>, NotFound>> HandleAsync()
    {
        var user = await _userRepository.GetByEmailAsync(DemoUserEmail);
        if (user == null)
            return TypedResults.NotFound();

        var token = _authService.GenerateJwtToken(user.Id, user.Email);
        _authService.SetAuthCookie(token);

        return TypedResults.Ok(new UserDto(user.Id, user.Email));
    }
}