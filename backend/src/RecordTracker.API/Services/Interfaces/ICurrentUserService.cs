using RecordTracker.API.Features.Auth.Dtos;

namespace RecordTracker.API.Services.Interfaces;

public interface ICurrentUserService
{
    Guid GetUserId();
    string GetUserEmail();
    UserDto GetCurrentUser();
}
