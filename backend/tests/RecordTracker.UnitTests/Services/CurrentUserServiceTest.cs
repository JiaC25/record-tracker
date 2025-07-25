
using System.Security.Claims;
using FluentAssertions;
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
        var userId = Guid.NewGuid();
        mockHttpContext.Setup(context => context.User)
            .Returns(CreateClaimsPrincipal(userId));

        var result = currentUserService!.GetUserId();

        result.Should().Be(userId);
    }

    [Test]
    public void GetUserId_WhenUserIdClaimIsMissing_ShouldThrowUnauthorizedAccessException()
    {
        mockHttpContext.Setup(context => context.User)
            .Returns(new ClaimsPrincipal(new ClaimsIdentity(null, USER_AUTH)));

        currentUserService.Invoking((subject) => subject!.GetUserId())
        .Should()
        .Throw<UnauthorizedAccessException>();
    }

    [Test]
    public void GetUserEmail_WhenUserIsAuthenticated_ShouldReturnUserEmail()
    {
        var email = "email";
        mockHttpContext.Setup(context => context.User)
            .Returns(CreateClaimsPrincipal(email));

        var result = currentUserService!.GetUserEmail();

        result.Should().Be(email);
    }

    [Test]
    public void GetUserEmail_WhenUserEmailClaimIsMissing_ShouldThrowUnauthorizedAccessException()
    {
        mockHttpContext.Setup(context => context.User)
            .Returns(new ClaimsPrincipal(new ClaimsIdentity(null, USER_AUTH)));

        currentUserService.Invoking((subject) => subject!.GetUserEmail())
        .Should()
        .Throw<UnauthorizedAccessException>();
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