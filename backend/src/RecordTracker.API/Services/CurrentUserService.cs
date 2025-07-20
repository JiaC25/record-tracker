using RecordTracker.API.Features.Auth.Dtos;
using RecordTracker.API.Services.Interfaces;

namespace RecordTracker.API.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid GetUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(CustomClaimTypes.UserId);

        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            throw new UnauthorizedAccessException($"{CustomClaimTypes.UserId} is not available in the current context or the user is not authenticated.");
        
        return userId;
    }

    public string GetUserEmail()
    {
        var userEmail = _httpContextAccessor.HttpContext?.User?.FindFirst(CustomClaimTypes.UserEmail)?.Value;
        
        if (string.IsNullOrEmpty(userEmail))
            throw new UnauthorizedAccessException($"{CustomClaimTypes.UserEmail} is not available in the current context or the user is not authenticated.");
        
        return userEmail;
    }

    public UserDto GetCurrentUser()
    {
        var userId = GetUserId();
        var userEmail = GetUserEmail();

        return new UserDto(userId, userEmail);
    }
}
