'use client';

import { useRecordStore } from '@/lib/store/recordStore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Skeleton } from '../../../components/ui/skeleton';
import { useSidebarHeader } from '../../../contexts/sidebar-header-context';
import { RecordView } from './record-view';
import { DeleteRecordDialog } from '@/components/records/delete-record-dialog';
import { Button } from '@/components/ui/button';
import { Cog, CogIcon, Settings, Settings2Icon, TableConfig, Trash2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes.config';

const RecordPage = () => {
  const params = useParams<{ recordId: string }>();
  const recordId = params.recordId;

  const record = useRecordStore((state) => state.getRecord(recordId));
  const isLoadingRecord = useRecordStore((state) => state.isLoadingRecord);
  const { fetchRecord, deleteRecord } = useRecordStore();
  const { setHeader } = useSidebarHeader();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    if (!record) fetchRecord(recordId);
  }, [recordId]);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!record) return;
    
    setIsDeleting(true);
    try {
      await deleteRecord(recordId);
      router.push(ROUTES.RECORDS);
    } catch (error) {
      console.error('Failed to delete record', error);
      // Dialog will stay open on error so user can retry or cancel
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (isLoadingRecord) {
      setHeader(<Skeleton className="h-4 w-24" />);
    } else if (record) {
      setHeader(
        <div className="flex items-center justify-between w-full pr-2 overflow-x-hidden">
          <span className="max-w-[calc(100%-3rem)] truncate">{record.name}</span>
          <div><Button variant="ghost" size="sm"><Settings2Icon />Config</Button></div>
        </div>
      );
    } else {
      setHeader(<small className="text-red-400">Failed to load record</small>);
    }
  }, [record, isLoadingRecord, setHeader, handleDeleteClick]);

  return (
    <>
      {record ? (
        <RecordView recordId={recordId} />
      ) : (
        <div className="p-5 text-gray-500">Loading record...</div>
      )}
      {record && (
        <DeleteRecordDialog
          open={showDeleteDialog}
          recordName={record.name}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
};

export default RecordPage;
