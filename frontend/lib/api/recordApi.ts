import { CreateRecordRequest, GetAllRecordsResponse, RecordEntity, RecordItem, RecordItemInput, RecordSummary, UpdateRecordRequest } from '@/lib/types/records';
import { apiClient } from './apiClient';

export const recordApi = {
  getRecordSummaries: async () : Promise<RecordSummary[]> => {
    const data = await apiClient.get<GetAllRecordsResponse>('records');
    return data.records;
  },

  getRecord: (recordId: string) : Promise<RecordEntity> =>
    apiClient.get<RecordEntity>(`records/${recordId}`),

  createRecord: (requestBody: CreateRecordRequest) : Promise<RecordSummary> =>
    apiClient.post<RecordSummary>('records', requestBody),

  updateRecord: (recordId: string, requestBody: UpdateRecordRequest) : Promise<void> =>
    apiClient.put<void>(`records/${recordId}`, requestBody),

  createRecordItems: (recordId: string, items: RecordItemInput[]) : Promise<RecordItem[]> =>
    apiClient.post<RecordItem[]>(`records/${recordId}/items`, items),
  
  updateRecordItem: (recordId: string, itemId: string, requestBody: RecordItemInput) : Promise<RecordItem> =>
    apiClient.put<RecordItem>(`records/${recordId}/items/${itemId}`, requestBody),

  deleteRecord: (recordId: string) : Promise<void> =>
    apiClient.delete<void>(`records/${recordId}`),

  deleteRecordItem: (recordId: string, itemId: string) : Promise<void> =>
    apiClient.delete<void>(`records/${recordId}/items/${itemId}`),
};