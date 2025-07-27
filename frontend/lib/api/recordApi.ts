import { CreateRecordItemsRequest, GetAllRecordsResponse, RecordEntity, RecordSummary } from '@/lib/types/records';
import { apiClient } from './apiClient';

export const recordApi = {
  getRecordSummaries: async () : Promise<RecordSummary[]> => {
    const data = await apiClient.get<GetAllRecordsResponse>('records');
    return data.records;
  },

  getRecord: (recordId: string) : Promise<RecordEntity> =>
    apiClient.get<RecordEntity>(`records/${recordId}`),

  createRecordItems: (recordId: string, requestBody: CreateRecordItemsRequest) : Promise<void> =>
    apiClient.post<void>(`records/${recordId}/items`, requestBody),
};