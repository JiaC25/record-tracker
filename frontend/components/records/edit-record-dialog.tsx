'use client';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';
import { RecordForm } from './record-form';
import { recordApi } from '@/lib/api/recordApi';
import { useRecordStore } from '@/lib/store/recordStore';
import { CreateRecordRequest, RecordSummary, UpdateRecordRequest } from '@/lib/types/records';
import { Loader2Icon } from 'lucide-react';

type EditRecordDialogProps = {
  open: boolean;
  onDialogClose: () => void;
  record: RecordSummary;
  onUpdated?: () => void;
}

export const EditRecordDialog = ({ 
  open, 
  onDialogClose, 
  record,
  onUpdated 
}: EditRecordDialogProps) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState<UpdateRecordRequest | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { loadRecordSummaries } = useRecordStore();

  const handleSave = async () => {
    if (!isFormValid || !formData) return;
    setIsSaving(true);

    try {
      await recordApi.updateRecord(record.id, formData);
      
      // Refresh list after successful update
      await loadRecordSummaries();
      
      // Update successful
      handleDialogClose();
      onUpdated?.();
    } catch (error) {
      console.error('Error updating record', error);
      // TODO: Show toast notification when toast system is implemented
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormChange = useCallback((isValid: boolean, data: CreateRecordRequest | UpdateRecordRequest) => {
    // In edit mode, data will always be UpdateRecordRequest
    if ('recordId' in data) {
      setIsFormValid(isValid);
      setFormData(data);
    }
  }, []);

  // Reset form state when dialog closes
  const handleDialogClose = () => {
    setIsFormValid(false);
    setFormData(null);
    onDialogClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Record</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="max-h-[65vh] overflow-auto p-2 scrollbar-styled">
          <RecordForm
            initialRecord={record}
            onFormChange={handleFormChange}
          />
        </div>
        <DialogFooter className="mx-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleDialogClose}>Cancel</Button>
          </DialogClose>
          <Button
            disabled={!isFormValid || isSaving}
            onClick={handleSave}
          >
            {isSaving ? <Loader2Icon className="animate-spin"/> : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

