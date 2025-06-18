using FluentValidation;
using Microsoft.AspNetCore.Identity;
using RecordTracker.Infrastructure.Entities;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Auth;

public record CreateUserRequest(string Email, string Password);

public class CreateUserValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserValidator(IUserRepository userRepository)
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(256)
            .MustAsync(async (email, _) => await userRepository.IsEmailUniqueAsync(email))
            .WithMessage("Email is already registered.");

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .MaximumLength(100);
    }
}

public class CreateUserHandler
{
    private readonly IValidator<CreateUserRequest> _validator;
    private readonly IUserRepository _userRepository;

    public CreateUserHandler(IValidator<CreateUserRequest> validator,
        IUserRepository userRepository)
    {
        _validator = validator;
        _userRepository = userRepository;
    }

    public async Task<IResult> HandleAsync(CreateUserRequest request)
    {
        var validationResult = await _validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
        };
        user.PasswordHash = new PasswordHasher<User>().HashPassword(user, request.Password);

        await _userRepository.AddAsync(user);

        return Results.Created($"/api/users/{user.Id}", new { user.Id, user.Email });
    }
}
