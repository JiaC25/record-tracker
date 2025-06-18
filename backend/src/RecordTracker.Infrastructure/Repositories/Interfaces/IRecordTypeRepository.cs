using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.Infrastructure.Repositories.Interfaces;

public interface IRecordTypeRepository
{
    #region Create
    Task AddAsync(RecordType recordType, CancellationToken ct = default);
    #endregion

    #region Read
    Task<List<RecordType>> GetAllAsync(Guid userId, CancellationToken ct = default);
    
    Task<RecordType?> GetByIdAsync(Guid id, Guid userId, CancellationToken ct = default);
    Task<RecordType?> GetByIdWithFieldsAsync(Guid id, Guid userId, CancellationToken ct = default);
    Task<RecordType?> GetByIdFullAsync(Guid id, Guid userId, CancellationToken ct = default);

    #endregion
}
