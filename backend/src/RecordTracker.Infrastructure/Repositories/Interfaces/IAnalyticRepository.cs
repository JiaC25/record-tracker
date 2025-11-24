using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.Infrastructure.Repositories.Interfaces;

public interface IAnalyticRepository
{
    #region Create
    Task AddAnalyticAsync(Analytic analytic, CancellationToken ct = default);
    #endregion

    #region Read
    Task<List<Analytic>> GetAnalyticsByRecordIdAsync(Guid recordId, Guid userId, CancellationToken ct = default);
    Task<Analytic?> GetAnalyticByIdAsync(Guid analyticId, Guid userId, CancellationToken ct = default);
    #endregion

    #region Update
    Task UpdateAnalyticAsync(Analytic analytic, CancellationToken ct = default);
    #endregion

    Task SaveChangesAsync(CancellationToken ct = default);
}

