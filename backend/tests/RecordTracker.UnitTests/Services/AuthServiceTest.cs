using Moq;
using RecordTracker.API.Configuration.Options;
using NUnit.Framework;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http;
using RecordTracker.API.Services;

namespace RecordTracker.UnitTests.Services;

[TestFixture]
public class AuthServiceTest
{
    private IOptions<AuthOptions>? authConfig;
    private readonly Mock<IHttpContextAccessor> mockHttpContextAccessor = new();
    private readonly Mock<HttpContext> mockHttpContext = new();
    private AuthService? authService;

    const string JWT_KEY = "blaulaklaXk3zW$e8z%FNrR7L#7cUb2K";
    const string COOKIE_NAME = "myCookie";


    [OneTimeSetUp]
    public void Setup()
    {
        authConfig = CreateAuthConfig();
        mockHttpContext.Setup(m => m.Response.Cookies).Returns(new Mock<IResponseCookies>().Object);
        mockHttpContextAccessor.Setup(m => m.HttpContext).Returns(mockHttpContext.Object);
        authService = new AuthService(authConfig, mockHttpContextAccessor.Object);
    }

    [Test]
    public void GenerateJwtToken_WhenValidUserIdAndEmail_ShouldReturnToken()
    {
        var uid = Guid.NewGuid();
        var token = authService!.GenerateJwtToken(uid, "email");

        Assert.That(token, Is.Not.Null);
    }

    [Test]
    public void SetAuthCookie_WithValidToken_ShouldAppendCookie()
    {
        string TOKEN = "token";
        authService!.SetAuthCookie(TOKEN);
        
        mockHttpContext.Verify(
            context => context.Response.Cookies.Append(
                COOKIE_NAME,
                TOKEN,
                It.IsAny<CookieOptions>()
            ),
            Times.Once
        );
    }

    [Test]
    public void ClearAuthCookie_WhenLogout_ShouldDeleteCookie()
    {
        authService!.ClearAuthCookie();
        
        mockHttpContext.Verify(
            context => context.Response.Cookies.Delete(COOKIE_NAME, It.IsAny<CookieOptions>()),
            Times.Once
        );
    }

    private IOptions<AuthOptions> CreateAuthConfig()
    {
        AuthOptions authConfig = new AuthOptions()
        {
            Jwt = new JwtOptions()
            {
                Key = JWT_KEY,
                ExpiryDays = 35,
            },
            Cookie = new AuthCookieOptions()
            {
                Name = COOKIE_NAME,
                Secure = false,
                SameSite = "Lax",
                ExpiryDays = 35,
            }
        };
        return Options.Create(authConfig);
    }
}