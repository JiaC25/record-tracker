
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Moq;
using NUnit.Framework;
using RecordTracker.API.Services;

namespace RecordTracker.UnitTests.Services;

[TestFixture]
public class CurrentUserServiceTest
{
    private readonly Mock<HttpContext> mockHttpContext = new();
    private readonly Mock<IHttpContextAccessor> mockHttpContextAccessor = new();
    private CurrentUserService? currentUserService;
    private const string USER_AUTH = "UserAuth";

    [OneTimeSetUp]
    public void Setup()
    {
        mockHttpContextAccessor.Setup(context => context.HttpContext).Returns(mockHttpContext.Object);
        currentUserService = new CurrentUserService(mockHttpContextAccessor.Object);
    }

    [Test]
    public void GetUserId_WhenUserIsAuthenticated_ShouldReturnUserId()
    {
        // Arrange
        var userId = Guid.NewGuid();
        mockHttpContext.Setup(context => context.User)
            .Returns(CreateClaimsPrincipal(userId));

        // Act
        var result = currentUserService!.GetUserId();

        // Assert
        Assert.That(result, Is.EqualTo(userId));
    }

    [Test]
    public void GetUserId_WhenUserIdClaimIsMissing_ShouldThrowUnauthorizedAccessException()
    {
        // Arrange
        mockHttpContext.Setup(context => context.User)
            .Returns(new ClaimsPrincipal(new ClaimsIdentity(null, USER_AUTH)));

        // Act & Assert
        Assert.Throws<UnauthorizedAccessException>(() => currentUserService!.GetUserId());
    }

    [Test]
    public void GetUserEmail_WhenUserIsAuthenticated_ShouldReturnUserEmail()
    {
        // Arrange
        var email = "email";
        mockHttpContext.Setup(context => context.User)
            .Returns(CreateClaimsPrincipal(email));

        // Act
        var result = currentUserService!.GetUserEmail();

        // Assert
        Assert.That(result, Is.EqualTo(email));
    }

    [Test]
    public void GetUserEmail_WhenUserEmailClaimIsMissing_ShouldThrowUnauthorizedAccessException()
    {
        // Arrange
        mockHttpContext.Setup(context => context.User)
            .Returns(new ClaimsPrincipal(new ClaimsIdentity(null, USER_AUTH)));
        // Act & Assert
        Assert.Throws<UnauthorizedAccessException>(() => currentUserService!.GetUserEmail());
    }

    private ClaimsPrincipal CreateClaimsPrincipal(Guid userId)
    {
        var claims = new List<Claim>
        {
            new Claim(CustomClaimTypes.UserId, userId.ToString()),
        };
        return new ClaimsPrincipal(new ClaimsIdentity(claims, USER_AUTH));
    }

    private ClaimsPrincipal CreateClaimsPrincipal(string email)
    {
        var claims = new List<Claim>
        {
            new Claim(CustomClaimTypes.UserEmail, email),
        };
        return new ClaimsPrincipal(new ClaimsIdentity(claims, USER_AUTH));
    }
}