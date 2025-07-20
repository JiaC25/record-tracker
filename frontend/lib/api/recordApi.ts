import { fetchGet, fetchPost } from '@/lib/api/fetchConfig';
import { CreateRecordItemsRequest, GetAllRecordsResponse, Record, RecordSummary } from '@/lib/types/records';

/** GET */
export const getRecordSummaries = async () : Promise<RecordSummary[]> => {
    const response = await fetchGet('records');
    const data: GetAllRecordsResponse = await response.json();
    return data.records;
};

export const getRecord = async (recordId: string) : Promise<Record> => {
    const response = await fetchGet(`records/${recordId}`);
    const data: Record = await response.json();
    return data;
}

/** POST */
export const createRecordItems = async (recordId: string, requestBody: CreateRecordItemsRequest) => {
    await fetchPost(`records/${recordId}/items`, {
        body: JSON.stringify(requestBody)
    });
}