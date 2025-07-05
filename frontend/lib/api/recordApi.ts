import { fetchGet, fetchPost } from '@/lib/api/fetchConfig';
import { CreateRecordItemsRequest, Record, RecordSummary } from '@/lib/types/records';

export const getRecordSummaries = async () : Promise<RecordSummary[]> => {
    const response = await fetchGet('records');
    const data: RecordSummary[] = await response.json();
    return data;
};

export const getRecord = async (recordId: string) : Promise<Record> => {
    const response = await fetchGet(`records/${recordId}`);
    const data: Record = await response.json();
    return data;
}

export const createRecordItems = async (recordId: string, requestBody: CreateRecordItemsRequest) => {
    await fetchPost(`records/${recordId}/items`, {
        body: JSON.stringify(requestBody)
    });
}