# Feature Organization Pattern

## Adding a New Feature

When implementing a new feature:

1. **Create the feature folder** under `Features/`
   - Name it using PascalCase (e.g., `Orders`, `Products`)

2. **Define your handler(s)**
   - Create handler files (e.g., `CreateOrder.cs`, `GetOrder.cs`)
   - Each handler should have a `xxxRequest` record for its input

3. **Use shared contracts when appropriate**
   - If DTOs/Inputs are used by multiple handlers, create a `Models/` subfolder
   - Place shared contracts in `Models/` (e.g., `OrderDto.cs`, `OrderItemInput.cs`)
   - For simple, single-use contracts, you can define them directly in the handler file

4. **Follow the naming conventions**
   - Handlers: `{Action}{Entity}Handler` (e.g., `CreateOrderHandler`)
   - Requests: `{Action}{Entity}Request` (e.g., `CreateOrderRequest`)
   - Validators: `{Action}{Entity}Validator` (e.g., `CreateOrderValidator`)
   - DTOs: `{Entity}Dto` (e.g., `OrderDto`)
   - Inputs: `{Entity}Input` (e.g., `OrderInput`)

5. **Register endpoints**
   - Add endpoint definitions in the appropriate `Endpoints/` file
   - Use the handler's `HandleAsync` method in the endpoint mapping

6. **Example folder structure:**
   ```
   Orders/
   ├── CreateOrder.cs          (CreateOrderRequest, CreateOrderValidator, CreateOrderHandler)
   ├── GetOrder.cs             (GetOrderRequest, GetOrderHandler)
   ├── UpdateOrder.cs          (UpdateOrderRequest, UpdateOrderValidator, UpdateOrderHandler)
   └── Models/
       ├── OrderDto.cs         (Shared DTO)
       └── OrderItemInput.cs   (Shared Input with validator)
   ```

## Examples

### Simple Feature (No Shared Contracts)
```csharp
// Features/Auth/LoginUser.cs
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
    public async Task<Results<Ok<UserDto>, ValidationProblem>> HandleAsync(LoginUserRequest request)
    {
        // Implementation
    }
}
```

### Feature with Shared Models
```csharp
// Features/Records/Models/RecordItemInput.cs
namespace RecordTracker.API.Features.Records.Models;

public record RecordItemInput
{
    public List<RecordValueInput> Values { get; init; } = [];
}

public class RecordItemInputValidator : AbstractValidator<RecordItemInput>
{
    // Validator implementation
}
```

```csharp
// Features/Records/CreateRecordItems.cs
namespace RecordTracker.API.Features.Records;

public record CreateRecordItemsRequest(Guid RecordId)
{
    public List<RecordItemInput> Items { get; init; } = [];
}

public class CreateRecordItemsValidator : AbstractValidator<CreateRecordItemsRequest>
{
    public CreateRecordItemsValidator()
    {
        RuleFor(x => x.RecordId).NotEmpty();
        RuleForEach(x => x.Items).SetValidator(new RecordItemInputValidator());
    }
}

public class CreateRecordItemsHandler
{
    public async Task<IResult> HandleAsync(CreateRecordItemsRequest request, CancellationToken ct)
    {
        // Implementation
    }
}
```

