using Microsoft.EntityFrameworkCore;
using RecordTracker.Infrastructure.Entities;
using RecordTracker.Infrastructure.Persistence;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.Infrastructure.Repositories;

public class RecordTypeRepository : IRecordTypeRepository
{
    private readonly RecordTrackerDbContext _dbContext;

    public RecordTypeRepository(RecordTrackerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    #region Create
    public async Task AddAsync(RecordType recordType, CancellationToken ct = default)
    {
        await _dbContext.RecordType.AddAsync(recordType, ct);
        await _dbContext.SaveChangesAsync(ct);
    }
    #endregion

    #region Read
    public async Task<List<RecordType>> GetAllAsync(Guid userId, CancellationToken ct = default)
    {
        return await _dbContext.RecordType
            .Where(rt => rt.CreatedByUserId == userId)
            .OrderByDescending(rt => rt.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<RecordType?> GetByIdAsync(Guid id, Guid userId, CancellationToken ct = default)
    {
        return await _dbContext.RecordType
            .Where(rt => rt.Id == id && rt.CreatedByUserId == userId)
            .FirstOrDefaultAsync(ct);
    }
    public async Task<RecordType?> GetByIdWithFieldsAsync(Guid id, Guid userId, CancellationToken ct = default)
    {
        return await _dbContext.RecordType
            .Where(rt => rt.Id == id && rt.CreatedByUserId == userId)
            .Include(rt => rt.RecordFields)
            .FirstOrDefaultAsync(ct);
    }
    public async Task<RecordType?> GetByIdFullAsync(Guid id, Guid userId, CancellationToken ct = default)
    {
        return await _dbContext.RecordType
            .Where(rt => rt.Id == id && rt.CreatedByUserId == userId)
            .Include(rt => rt.RecordFields)
            .Include(rt => rt.RecordItems)
                .ThenInclude(ri => ri.RecordValues)
            .FirstOrDefaultAsync(ct);
    }
    #endregion
}
