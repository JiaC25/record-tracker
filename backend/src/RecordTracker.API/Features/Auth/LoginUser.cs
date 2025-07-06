using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using RecordTracker.API.Configuration;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Entities;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Auth;

public record LoginUserRequest(string Email, string Password);
public record LoginUserResponse(string Token, string Email, Guid UserId);

public class LoginUserValidator : AbstractValidator<LoginUserRequest>
{
    public LoginUserValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty();
    }
}

public class LoginUserHandler
{
    private readonly IValidator<LoginUserRequest> _validator;
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenService _jwtTokenService;

    public LoginUserHandler(
        IValidator<LoginUserRequest> validator,
        IUserRepository userRepository,
        IJwtTokenService jwtTokenService)
    {
        _validator = validator;
        _userRepository = userRepository;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<Results<Ok<LoginUserResponse>, NotFound, UnauthorizedHttpResult, ValidationProblem>> HandleAsync(LoginUserRequest request)
    {
        var validationResult = await _validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return TypedResults.ValidationProblem(validationResult.ToDictionary());

        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null)
            return TypedResults.NotFound();

        var hasher = new PasswordHasher<User>();
        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result != PasswordVerificationResult.Success)
            return TypedResults.Unauthorized();

        var token = _jwtTokenService.GenerateToken(user.Id, user.Email);

        return TypedResults.Ok(new LoginUserResponse(token, user.Email, user.Id));
    }
}

public static class LoginUserApiDocumentation
{
    public static RouteHandlerBuilder ProduceLoginUserApiDocumentation(this RouteHandlerBuilder builder)
    {
        // This method can be used to produce API documentation for the login endpoint.
        return SwaggerConfiguration.ProduceValidationProblemsApiDocumentation(
            builder,
            StatusCodes.Status400BadRequest,
            new Microsoft.OpenApi.Any.OpenApiObject
            {
                ["Email"] = new Microsoft.OpenApi.Any.OpenApiArray
                {
                    new Microsoft.OpenApi.Any.OpenApiString("")
                },
                ["Password"] = new Microsoft.OpenApi.Any.OpenApiArray
                {
                    new Microsoft.OpenApi.Any.OpenApiString("")
                }
            });
    }
}