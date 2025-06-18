using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RecordTracker.API.Configuration;
using RecordTracker.API.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RecordTracker.API.Services;

public class JwtTokenService : IJwtTokenService
{
    private readonly JwtConfig _jwtConfig;

    public JwtTokenService(IOptions<JwtConfig> jwtConfig)
    {
        _jwtConfig = jwtConfig?.Value ?? throw new ArgumentNullException(nameof(jwtConfig));
    }

    public string GenerateToken(Guid userId, string email)
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
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Email, email)
        };

        // Construct the token object
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );

        // Convert token object to string
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
