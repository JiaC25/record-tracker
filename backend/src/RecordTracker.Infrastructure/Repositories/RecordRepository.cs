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
    // -- Record --
    public async Task AddRecordAsync(Record record, CancellationToken ct = default)
    {
        await _dbContext.Record.AddAsync(record, ct);
    }

    // -- RecordItem --
    public async Task AddRecordItemAsync(RecordItem item, CancellationToken ct = default)
    {
        await _dbContext.RecordItem.AddAsync(item, ct);
    }
    #endregion

    #region Read
    // -- Record --
    public async Task<List<Record>> GetAllRecordsWithFieldsAsync(Guid userId, CancellationToken ct = default)
    {
        return await _dbContext.Record
            .Where(rt => rt.CreatedByUserId == userId)
            .Include(rt => rt.RecordFields)
            .OrderByDescending(rt => rt.CreatedAt)
            .ToListAsync(ct);
    }
    public async Task<Record?> GetRecordByIdAsync(Guid id, Guid userId, CancellationToken ct = default)
    {
        return await _dbContext.Record
            .Where(rt => rt.Id == id && rt.CreatedByUserId == userId)
            .FirstOrDefaultAsync(ct);
    }
    public async Task<Record?> GetRecordByIdWithFieldsAsync(Guid id, Guid userId, CancellationToken ct = default)
    {
        return await _dbContext.Record
            .Where(rt => rt.Id == id && rt.CreatedByUserId == userId)
            .Include(rt => rt.RecordFields)
            .FirstOrDefaultAsync(ct);
    }
    public async Task<Record?> GetRecordByIdFullAsync(Guid id, Guid userId, CancellationToken ct = default)
    {
        return await _dbContext.Record
            .Where(rt => rt.Id == id && rt.CreatedByUserId == userId)
            .Include(rt => rt.RecordFields)
            .Include(rt => rt.RecordItems)
                .ThenInclude(ri => ri.RecordValues)
            .FirstOrDefaultAsync(ct);
    }
    #endregion

    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        await _dbContext.SaveChangesAsync(ct);
    }
}
