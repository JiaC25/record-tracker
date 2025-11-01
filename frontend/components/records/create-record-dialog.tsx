import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';
import { RecordForm } from './record-form';
import { recordApi } from '@/lib/api/recordApi';
import { useRecordStore } from '@/lib/store/recordStore';
import { CreateRecordRequest } from '@/lib/types/records';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes.config';

type CreateRecordDialogProps = {
  open: boolean;
  onDialogClose: () => void;
}

export const CreateRecordDialog = ({ open, onDialogClose }: CreateRecordDialogProps) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState<CreateRecordRequest | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!isFormValid || !formData) return;
    setIsSaving(true);

    try {
      const createdRecord = await recordApi.createRecord(formData);
      // Refresh list after successful create
      await useRecordStore.getState().loadRecordSummaries();
      onDialogClose();
      // Navigate to the newly created record's page
      router.push(ROUTES.RECORD_VIEW(createdRecord.id));
    } catch (error) {
      console.error('Create record failed', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormChange = useCallback((isFormValid: boolean, data: CreateRecordRequest) => {
    setIsFormValid(isFormValid);
    setFormData(data);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onDialogClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Record</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <RecordForm onFormChange={handleFormChange} />

        <DialogFooter>
          <Button variant="secondary" onClick={onDialogClose}>
            Cancel
          </Button>
          <Button
            disabled={!isFormValid || isSaving}
            onClick={handleSave}
            type="submit"
          >
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};