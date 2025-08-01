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
  const { fetchRecord } = useRecordStore();
  const { setHeader } = useSidebarHeader();
  
  useEffect(() => {
    if (!record) fetchRecord(recordId);
  }, [record]);

  useEffect(() => {
    if (record) {
      setHeader(<h6>{record.name}</h6>);
    } else {
      setHeader(<Skeleton className="h-4 w-24"/>);
    }
  }, [record]);

  return record ? (
    <RecordView record={record} />
  ) : (
    <div className="p-5 text-gray-500">Loading record...</div>
  );
};

export default RecordPage;
