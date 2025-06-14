using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.Infrastructure.Repositories.Interfaces;

public interface IUserRepository
{
    #region Create
    Task AddAsync(User user, CancellationToken ct = default);
    #endregion

    #region Read
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<bool> IsEmailUniqueAsync(string email, CancellationToken ct = default);
    #endregion
}
