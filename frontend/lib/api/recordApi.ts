import { fetchGet } from '@/lib/api/fetchConfig';
import { RecordSummary } from '@/lib/types/records';

export const getRecordSummaries = async () : Promise<RecordSummary[]> => {
    const response = await fetchGet('records');
    const data = await response.json();
    return data;
};