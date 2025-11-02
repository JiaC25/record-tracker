using RecordTracker.API.Features.Auth.Models;

namespace RecordTracker.API.Services.Interfaces;

public interface ICurrentUserService
{
    Guid GetUserId();
    string GetUserEmail();
    UserDto GetCurrentUser();
}
