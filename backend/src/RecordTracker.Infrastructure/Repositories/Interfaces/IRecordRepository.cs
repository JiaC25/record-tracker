using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.Infrastructure.Repositories.Interfaces;

public interface IRecordRepository
{
    #region Create
    Task AddAsync(Record record, CancellationToken ct = default);
    #endregion

    #region Read
    Task<List<Record>> GetAllWithFieldsAsync(Guid userId, CancellationToken ct = default);
    
    Task<Record?> GetByIdAsync(Guid id, Guid userId, CancellationToken ct = default);
    Task<Record?> GetByIdWithFieldsAsync(Guid id, Guid userId, CancellationToken ct = default);
    Task<Record?> GetByIdFullAsync(Guid id, Guid userId, CancellationToken ct = default);

    #endregion
}
