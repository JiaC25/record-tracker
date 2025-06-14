using Microsoft.EntityFrameworkCore;
using RecordTracker.Infrastructure.Entities;
using RecordTracker.Infrastructure.Persistence;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly RecordTrackerDbContext _dbContext;

    public UserRepository(RecordTrackerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    #region Create
    public async Task AddAsync(User user, CancellationToken ct = default)
    {
        await _dbContext.Users.AddAsync(user, ct);
        await _dbContext.SaveChangesAsync(ct);
    }
    #endregion

    #region Read
    public async Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email, ct);
    }

    public async Task<bool> IsEmailUniqueAsync(string email, CancellationToken ct = default)
    {
        return !await _dbContext.Users.AnyAsync(u => u.Email == email, ct);
    }
    #endregion
}
