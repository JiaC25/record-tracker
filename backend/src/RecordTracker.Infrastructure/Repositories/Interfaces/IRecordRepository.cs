using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.Infrastructure.Repositories.Interfaces;

public interface IRecordRepository
{
    #region Create
    // -- Record --
    Task AddRecordAsync(Record record, CancellationToken ct = default);
    // -- RecordItem --
    Task AddRecordItemAsync(RecordItem item, CancellationToken ct = default);
    #endregion

    #region Read
    // -- Record --
    Task<List<Record>> GetAllRecordsWithFieldsAsync(Guid userId, CancellationToken ct = default);
    Task<Record?> GetRecordByIdAsync(Guid id, Guid userId, CancellationToken ct = default);
    Task<Record?> GetRecordByIdWithFieldsAsync(Guid id, Guid userId, CancellationToken ct = default);
    Task<Record?> GetRecordByIdFullAsync(Guid id, Guid userId, CancellationToken ct = default);
    #endregion

    Task SaveChangesAsync(CancellationToken ct = default);
}
