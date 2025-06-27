using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using RecordTracker.API.Configuration;
using RecordTracker.Infrastructure.Entities;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Auth;

public record CreateUserResponse(Guid Id, string Email);
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

    public CreateUserHandler(
        IValidator<CreateUserRequest> validator,
        IUserRepository userRepository)
    {
        _validator = validator;
        _userRepository = userRepository;
    }

    public async Task<Results<Created<CreateUserResponse>, ValidationProblem>> HandleAsync(CreateUserRequest request)
    {
        var validationResult = await _validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return TypedResults.ValidationProblem(validationResult.ToDictionary());

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
        };
        user.PasswordHash = new PasswordHasher<User>().HashPassword(user, request.Password);

        await _userRepository.AddAsync(user);

        return TypedResults.Created($"/api/users/{user.Id}", new CreateUserResponse(user.Id, user.Email));
    }
}

public static class CreateUserApiDocumentation
{
    public static RouteHandlerBuilder ProduceCreateUserApiDocumentation(this RouteHandlerBuilder builder)
    {
        // This method can be used to produce API documentation if needed.
        return SwaggerConfiguration.ProduceValidationProblemsApiDocumentation(
            builder,
            StatusCodes.Status400BadRequest,
            new Microsoft.OpenApi.Any.OpenApiObject
            {
                ["Email"] = new Microsoft.OpenApi.Any.OpenApiArray
                        {
                            new Microsoft.OpenApi.Any.OpenApiString(""),
                        },
                ["Password"] = new Microsoft.OpenApi.Any.OpenApiArray
                        {
                            new Microsoft.OpenApi.Any.OpenApiString("")
                        }
            });
    }
}
