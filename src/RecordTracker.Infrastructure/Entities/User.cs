namespace RecordTracker.Infrastructure.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string Email { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;

    public bool IsDeactivated { get; set; } = false;
}
