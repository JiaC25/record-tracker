using RecordTracker.Infrastructure.Entities;

namespace RecordTracker.Infrastructure.Repositories.Interfaces;

public interface IRecordTypeRepository
{
    #region Create
    Task AddAsync(RecordType recordType, CancellationToken ct = default);
    #endregion

    #region Read

    #endregion
}
