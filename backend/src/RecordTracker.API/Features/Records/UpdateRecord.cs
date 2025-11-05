using FluentValidation;
using Microsoft.EntityFrameworkCore;
using RecordTracker.API.Services.Interfaces;
using RecordTracker.Infrastructure.Entities;
using RecordTracker.Infrastructure.Persistence;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.API.Features.Records;

public record UpdateRecordRequest
{
    public Guid RecordId { get; init; }
    public string Name { get; init; } = default!;
    public string? Description { get; init; }
    public List<UpdateRecordFieldInput> RecordFields { get; init; } = [];
    
}

public record UpdateRecordFieldInput
{
    // If Id is null or Guid.Empty, add new field
    // If Id has a value, update existing field
    public Guid? Id { get; init; }
    public string Name { get; init; } = default!;
    public int Order { get; init; }
    public FieldType FieldType { get; init; }
    public bool IsRequired { get; init; }
}

public class UpdateRecordValidator : AbstractValidator<UpdateRecordRequest>
{
    public UpdateRecordValidator()
    {
        RuleFor(x => x.RecordId)
            .NotEmpty()
            .WithMessage("Record ID is required and cannot be an empty GUID.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100);
        
        RuleFor(x => x.Description)
            .MaximumLength(500);

        // Ensure no duplicate Orders
        RuleFor(x => x.RecordFields)
            .Must(fields => fields.Select(f => f.Order).Distinct().Count() == fields.Count)
            .WithMessage("RecordFields must have unique Order values.");
        
        RuleForEach(x => x.RecordFields)
            .SetValidator(new UpdateRecordFieldInputValidator());
    }
}

public class UpdateRecordFieldInputValidator : AbstractValidator<UpdateRecordFieldInput>
{
    public UpdateRecordFieldInputValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Order)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.FieldType)
            .IsInEnum()
            .WithMessage("FieldType must be a valid enum value.");

        // FieldType and IsRequired are required for new fields (when Id is null/empty)
        When(x => !x.Id.HasValue || x.Id.Value == Guid.Empty, () =>
        {
            RuleFor(x => x.FieldType)
                .IsInEnum()
                .WithMessage("FieldType is required for new fields.");
        });
    }
}

public class UpdateRecordHandler
{
    private readonly RecordTrackerDbContext _dbContext;
    private readonly IValidator<UpdateRecordRequest> _validator;
    private readonly ICurrentUserService _currentUserService;
    private readonly IRecordRepository _recordRepository;

    public UpdateRecordHandler(
        RecordTrackerDbContext dbContext,
        IValidator<UpdateRecordRequest> validator,
        ICurrentUserService currentUserService,
        IRecordRepository recordRepository)
    {
        _dbContext = dbContext;
        _validator = validator;
        _currentUserService = currentUserService;
        _recordRepository = recordRepository;
    }

    public async Task<IResult> HandleAsync(UpdateRecordRequest request, CancellationToken ct = default)
    {
        var validationResult = await _validator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var userId = _currentUserService.GetUserId();

        // Get the record to verify ownership
        var existingRecord = await _recordRepository.GetRecordByIdFullAsync(request.RecordId, userId, ct);
        if (existingRecord == null)
            return Results.NotFound(new { Message = "Record not found or user no access." });

        // Validate that existing fields cannot change FieldType or IsRequired
        var existingFieldsDict = existingRecord.RecordFields.ToDictionary(f => f.Id);
        var validationErrors = new Dictionary<string, string[]>();

        for (int i = 0; i < request.RecordFields.Count; i++)
        {
            var fieldInput = request.RecordFields[i];
            
            // Only validate existing fields (those with Id)
            if (fieldInput.Id.HasValue && fieldInput.Id.Value != Guid.Empty)
            {
                var fieldId = fieldInput.Id.Value;
                if (!existingFieldsDict.TryGetValue(fieldId, out var existingField))
                {
                    validationErrors.Add(
                        $"RecordFields[{i}].Id",
                        new[] { $"RecordField with Id '{fieldId}' does not exist or does not belong to this record." }
                    );
                    continue;
                }

                if (existingField.FieldType != fieldInput.FieldType)
                {
                    validationErrors.Add(
                        $"RecordFields[{i}].FieldType",
                        new[] { "FieldType cannot be changed for existing fields." }
                    );
                }

                if (existingField.IsRequired != fieldInput.IsRequired)
                {
                    validationErrors.Add(
                        $"RecordFields[{i}].IsRequired",
                        new[] { "IsRequired cannot be changed for existing fields." }
                    );
                }
            }
        }

        if (validationErrors.Any())
        {
            return Results.ValidationProblem(validationErrors);
        }

        // Normalize Order values to be sequential (0, 1, 2, ...) based on provided Order
        var normalizedFields = request.RecordFields
            .OrderBy(f => f.Order)
            .Select((f, index) => new UpdateRecordFieldInput
            {
                Id = f.Id,
                Name = f.Name,
                Order = index, // Normalize to sequential order
                FieldType = f.FieldType,
                IsRequired = f.IsRequired
            })
            .ToList();

        // 1. Update the main Record entity properties
        existingRecord.Name = request.Name;
        existingRecord.Description = request.Description;

        // Synchronize the RecordFields collection
        var existingFieldIds = existingRecord.RecordFields.Select(f => f.Id).ToList();
        var inputFieldIds = normalizedFields
            .Where(f => f.Id.HasValue && f.Id.Value != Guid.Empty)
            .Select(f => f.Id!.Value)
            .ToList();

        // 2. Fields to DELETE (exist in DB, not in the request list)
        var fieldsToDelete = existingRecord.RecordFields
            .Where(f => !inputFieldIds.Contains(f.Id))
            .ToList();

        // Soft delete each field
        foreach (var field in fieldsToDelete)
        {
            field.IsDeleted = true;
        }

        // 3. Fields to UPDATE (exist in both DB and request list)
        foreach (var fieldInput in normalizedFields.Where(f => f.Id.HasValue && f.Id.Value != Guid.Empty))
        {
            var fieldId = fieldInput.Id!.Value;
            var existingField = existingFieldsDict[fieldId];
            
            existingField.Name = fieldInput.Name;
            existingField.Order = fieldInput.Order;
            // FieldType and IsRequired are already validated above and cannot change
        }

        // 4. Fields to ADD (do not exist in DB - Id is null or empty)
        foreach (var fieldInput in normalizedFields.Where(f => !f.Id.HasValue || f.Id.Value == Guid.Empty))
        {
            var newField = new RecordField
            {
                // Don't generate GUID here to avoid EF tracking new field as Modified
                Name = fieldInput.Name,
                FieldType = fieldInput.FieldType,
                IsRequired = fieldInput.IsRequired,
                Order = fieldInput.Order,
                RecordId = existingRecord.Id
            };

            // Add to navigation collection for relationship tracking
            existingRecord.RecordFields.Add(newField);
        }

        await _recordRepository.SaveChangesAsync(ct);

        return Results.NoContent();
    }
}