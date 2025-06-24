using RecordTracker.API.Services.Interfaces;
using System.Security.Claims;

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
        {
            throw new UnauthorizedAccessException($"{CustomClaimTypes.UserId} is not available in the current context. User is not authenticated.");
        }

        return userId;
    }
}
