import { CreateRecordItemsRequest, GetAllRecordsResponse, Record, RecordSummary } from '@/lib/types/records';
import { apiClient } from './apiClient';

export const recordApi = {
    getRecordSummaries: async () : Promise<RecordSummary[]> => {
        const data = await apiClient.get<GetAllRecordsResponse>('records');
        return data.records;
    },

    getRecord: (recordId: string) : Promise<Record> =>
        apiClient.get<Record>(`records/${recordId}`),

    createRecordItems: (recordId: string, requestBody: CreateRecordItemsRequest) : Promise<void> =>
        apiClient.post<void>(`records/${recordId}/items`, requestBody),
}