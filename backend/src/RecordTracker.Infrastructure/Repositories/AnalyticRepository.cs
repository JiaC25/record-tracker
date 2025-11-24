using Microsoft.EntityFrameworkCore;
using RecordTracker.Infrastructure.Entities;
using RecordTracker.Infrastructure.Persistence;
using RecordTracker.Infrastructure.Repositories.Interfaces;

namespace RecordTracker.Infrastructure.Repositories;

public class AnalyticRepository : IAnalyticRepository
{
    private readonly RecordTrackerDbContext _dbContext;

    public AnalyticRepository(RecordTrackerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    #region Create
    public async Task AddAnalyticAsync(Analytic analytic, CancellationToken ct = default)
    {
        await _dbContext.Analytic.AddAsync(analytic, ct);
    }
    #endregion

    #region Read
    public async Task<List<Analytic>> GetAnalyticsByRecordIdAsync(Guid recordId, Guid userId, CancellationToken ct = default)
    {
        return await _dbContext.Analytic
            .Where(a => a.RecordId == recordId && a.Record.CreatedByUserId == userId)
            .OrderBy(a => a.Order)
            .ToListAsync(ct);
    }

    public async Task<Analytic?> GetAnalyticByIdAsync(Guid analyticId, Guid userId, CancellationToken ct = default)
    {
        return await _dbContext.Analytic
            .Where(a => a.Id == analyticId && a.Record.CreatedByUserId == userId)
            .FirstOrDefaultAsync(ct);
    }
    #endregion

    #region Update
    public async Task UpdateAnalyticAsync(Analytic analytic, CancellationToken ct = default)
    {
        _dbContext.Analytic.Update(analytic);
        await Task.CompletedTask;
    }
    #endregion

    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        await _dbContext.SaveChangesAsync(ct);
    }
}

