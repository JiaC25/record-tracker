
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
    private const string AUTH_TYPE = "TestAuth";

    [Test]
    public void GetUserId_ShouldReturnUserId_WhenUserIsAuthenticated()
    {
        // Arrange
        var userId = Guid.NewGuid();
        mockHttpContextAccessor.Setup(context => context.HttpContext).Returns(mockHttpContext.Object);
        mockHttpContext.Setup(context => context.User)
            .Returns(CreateClaimsPrincipal(userId));

        // Act
        currentUserService = new CurrentUserService(mockHttpContextAccessor.Object);
        var result = currentUserService.GetUserId();

        // Assert
        Assert.That(result, Is.EqualTo(userId));
    }

    [Test]
    public void GetUserId_ShouldThrowUnauthorizedAccessException_WhenUserIdClaimIsMissing()
    {
        // Arrange
        mockHttpContextAccessor.Setup(context => context.HttpContext).Returns(mockHttpContext.Object);
        mockHttpContext.Setup(context => context.User)
            .Returns(new ClaimsPrincipal(new ClaimsIdentity(null, AUTH_TYPE)));

        // Act & Assert
        currentUserService = new CurrentUserService(mockHttpContextAccessor.Object);
        Assert.Throws<UnauthorizedAccessException>(() => currentUserService.GetUserId());
    }

    [Test]
    public void GetUserEmail_ShouldReturnUserEmail_WhenUserIsAuthenticated()
    {
        // Arrange
        var email = "email";
        mockHttpContextAccessor.Setup(context => context.HttpContext).Returns(mockHttpContext.Object);
        mockHttpContext.Setup(context => context.User)
            .Returns(CreateClaimsPrincipal(email));

        // Act
        currentUserService = new CurrentUserService(mockHttpContextAccessor.Object);
        var result = currentUserService.GetUserEmail();

        // Assert
        Assert.That(result, Is.EqualTo(email));
    }

    [Test]
    public void GetUserEmail_ShouldThrowUnauthorizedAccessException_WhenUserEmailClaimIsMissing()
    {
        // Arrange
        mockHttpContextAccessor.Setup(context => context.HttpContext).Returns(mockHttpContext.Object);
        mockHttpContext.Setup(context => context.User)
            .Returns(new ClaimsPrincipal(new ClaimsIdentity(null, AUTH_TYPE)));
        // Act & Assert
        currentUserService = new CurrentUserService(mockHttpContextAccessor.Object);
        Assert.Throws<UnauthorizedAccessException>(() => currentUserService.GetUserEmail());
    }

    private ClaimsPrincipal CreateClaimsPrincipal(Guid userId)
    {
        var claims = new List<Claim>
        {
            new Claim(CustomClaimTypes.UserId, userId.ToString()),
        };
        return new ClaimsPrincipal(new ClaimsIdentity(claims, AUTH_TYPE));
    }

    private ClaimsPrincipal CreateClaimsPrincipal(string email)
    {
        var claims = new List<Claim>
        {
            new Claim(CustomClaimTypes.UserEmail, email),
        };
        return new ClaimsPrincipal(new ClaimsIdentity(claims, AUTH_TYPE));
    }
}