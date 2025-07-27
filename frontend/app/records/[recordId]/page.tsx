'use client';

import { useRecordStore } from '@/lib/store/recordStore';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { RecordView } from './record-view';

const RecordPage = () => {
  const params = useParams<{ recordId: string }>();
  const recordId = params.recordId;

  const record = useRecordStore((state) => state.getRecord(recordId));
  const { fetchRecord } = useRecordStore();

  useEffect(() => {
    if (!record && recordId) {
      fetchRecord(recordId);
    }
  }, [recordId, record, fetchRecord]);

  return record ? (
    <RecordView record={record} />
  ) : (
    <div className="p-5 text-gray-500">Loading record...</div>
  );
};

export default RecordPage;
