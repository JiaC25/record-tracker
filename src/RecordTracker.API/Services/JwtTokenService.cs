using Microsoft.IdentityModel.Tokens;
using RecordTracker.API.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RecordTracker.API.Services;

public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _configuration;

    public JwtTokenService(IConfiguration configuration)
    {
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }

    public string GenerateToken(Guid userId, string email)
    {
        // Secret key used to sign the token
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Missing JWT Key")));

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
