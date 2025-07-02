using Microsoft.EntityFrameworkCore;
using RecordTracker.Infrastructure.Entities;
using RecordTracker.Infrastructure.Persistence;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.Infrastructure.Repositories;

public class RecordRepository : IRecordRepository
{
    private readonly RecordTrackerDbContext _dbContext;

    public RecordRepository(RecordTrackerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    #region Create
    public async Task AddAsync(Record record, CancellationToken ct = default)
    {
        await _dbContext.Record.AddAsync(record, ct);
        await _dbContext.SaveChangesAsync(ct);
    }
    #endregion

    #region Read
    public async Task<List<Record>> GetAllWithFieldsAsync(Guid userId, CancellationToken ct = default)
    {
        return await _dbContext.Record
            .Where(rt => rt.CreatedByUserId == userId)
            .Include(rt => rt.RecordFields)
            .OrderByDescending(rt => rt.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<Record?> GetByIdAsync(Guid id, Guid userId, CancellationToken ct = default)
    {
        return await _dbContext.Record
            .Where(rt => rt.Id == id && rt.CreatedByUserId == userId)
            .FirstOrDefaultAsync(ct);
    }
    public async Task<Record?> GetByIdWithFieldsAsync(Guid id, Guid userId, CancellationToken ct = default)
    {
        return await _dbContext.Record
            .Where(rt => rt.Id == id && rt.CreatedByUserId == userId)
            .Include(rt => rt.RecordFields)
            .FirstOrDefaultAsync(ct);
    }
    public async Task<Record?> GetByIdFullAsync(Guid id, Guid userId, CancellationToken ct = default)
    {
        return await _dbContext.Record
            .Where(rt => rt.Id == id && rt.CreatedByUserId == userId)
            .Include(rt => rt.RecordFields)
            .Include(rt => rt.RecordItems)
                .ThenInclude(ri => ri.RecordValues)
            .FirstOrDefaultAsync(ct);
    }
    #endregion
}
