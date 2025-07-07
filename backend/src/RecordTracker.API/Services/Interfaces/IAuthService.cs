using System.Security.Claims;

namespace RecordTracker.API.Services.Interfaces;

public interface IAuthService
{
    #region Jwt
    string GenerateJwtToken(Guid userId, string email);
    #endregion

    #region Cookie
    void SetAuthCookie(string token);
    #endregion


    //string GenerateToken(Guid userId, string email, string role, DateTime expirationDate);
    //ClaimsPrincipal ValidateToken(string token);
    //bool IsTokenExpired(string token);
    //string GetUserIdFromToken(string token);
    //string GetEmailFromToken(string token);
    //string GetRoleFromToken(string token);
    //DateTime GetExpirationDateFromToken(string token);
}
