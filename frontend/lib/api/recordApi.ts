import { fetchGet } from '@/lib/api/fetchConfig';
import { RecordSummary } from '@/lib/types/records';

export const getRecordSummaries = async () : Promise<RecordSummary[]> => {
    return await fetchGet<RecordSummary[]>('records').then(res => res.json());
};