using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RecordTracker.API.Configuration.Options;
using RecordTracker.API.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RecordTracker.API.Services;

static class CustomClaimTypes
{
    public const string UserId = "userId";
    public const string Email = "email";
}

public class AuthService : IAuthService
{
    private readonly AuthOptions _authConfig;
    private readonly JwtOptions _jwtConfig;
    private readonly AuthCookieOptions _cookieConfig;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuthService(
        IOptions<AuthOptions> authConfig,
        IHttpContextAccessor httpContextAccessor)
    {
        _authConfig = authConfig?.Value ?? throw new ArgumentNullException(nameof(authConfig));
        _jwtConfig = _authConfig.Jwt;
        _cookieConfig = _authConfig.Cookie;
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
    }

    #region Jwt
    public string GenerateJwtToken(Guid userId, string email)
    {
        if (string.IsNullOrWhiteSpace(_jwtConfig.Key))
            throw new InvalidOperationException("Missing JWT Key");

        // Secret key used to sign the token
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.Key));

        // Sign the token with HMAC SHA256
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Claims = key-value pairs embedded in the token (who is this user?)
        var claims = new List<Claim>
        {
            new Claim(CustomClaimTypes.UserId, userId.ToString()),
            new Claim(CustomClaimTypes.Email, email)
        };

        // Construct the token object
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(_jwtConfig.ExpiryDays),
            signingCredentials: credentials
        );

        // Convert token object to string
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    #endregion

    #region Cookie
    public void SetAuthCookie(string token)
    {
        _httpContextAccessor.HttpContext?.Response.Cookies.Append(
            _cookieConfig.Name,
            token,
            new CookieOptions
            {
                Path = "/",
                HttpOnly = true,
                Secure = _cookieConfig.Secure,
                SameSite = Enum.Parse<SameSiteMode>(_cookieConfig.SameSite, ignoreCase: true),
                Expires = DateTimeOffset.UtcNow.AddDays(_cookieConfig.ExpiryDays),
            }
        );
    }

    public void ClearAuthCookie()
    {
        _httpContextAccessor.HttpContext?.Response.Cookies.Delete(
            _cookieConfig.Name,
            new CookieOptions
            {
                Path = "/",
                HttpOnly = true,
                Secure = _cookieConfig.Secure,
                SameSite = Enum.Parse<SameSiteMode>(_cookieConfig.SameSite, ignoreCase: true),
            }
        );
    }
    #endregion
}
