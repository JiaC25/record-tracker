'use client';

import { useRecordStore } from '@/lib/store/recordStore';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '../../../components/ui/skeleton';
import { useSidebarHeader } from '../../../contexts/sidebar-header-context';
import { RecordView } from './record-view';

const RecordPage = () => {
  const params = useParams<{ recordId: string }>();
  const recordId = params.recordId;

  const record = useRecordStore((state) => state.getRecord(recordId));
  const isLoadingRecord = useRecordStore((state) => state.isLoadingRecord);
  const { fetchRecord } = useRecordStore();
  const { setHeader } = useSidebarHeader();
  
  useEffect(() => {
    if (!record) fetchRecord(recordId);
  }, [recordId]);

  useEffect(() => {
    if (isLoadingRecord) {
      setHeader(<Skeleton className="h-4 w-24" />);
    } else if (record) {
      setHeader(<small>{record.name}</small>);
    } else {
      setHeader(<small className="text-red-400">Failed to load record</small>);
    }
  }, [record, isLoadingRecord]);

  return record ? (
    <RecordView recordId={recordId} />
  ) : (
    <div className="p-5 text-gray-500">Loading record...</div>
  );
};

export default RecordPage;
