using FluentValidation;
using Microsoft.AspNetCore.Identity;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Entities;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Auth;

public record LoginUserRequest(string Email, string Password);

public class LoginUserValidator : AbstractValidator<LoginUserRequest>
{
    public LoginUserValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty();
    }
}

public class LoginUserHandler
{
    private readonly IValidator<LoginUserRequest> _validator;
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly IJwtTokenService _jwtTokenService;

    public LoginUserHandler(IValidator<LoginUserRequest> validator,
        IUserRepository userRepository,
        IConfiguration configuration,
        IJwtTokenService jwtTokenService)
    {
        _validator = validator;
        _userRepository = userRepository;
        _configuration = configuration;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<IResult> HandleAsync(LoginUserRequest request)
    {
        var validationResult = await _validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null)
            return Results.Unauthorized();

        var hasher = new PasswordHasher<User>();
        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result != PasswordVerificationResult.Success)
            return Results.Unauthorized();

        var token = _jwtTokenService.GenerateToken(user.Id, user.Email);

        return Results.Ok(new { token });
    }
}