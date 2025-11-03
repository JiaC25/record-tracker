'use client';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCallback, useState } from 'react';
import { RecordItemForm } from '@/components/records/record-item-form';
import { recordApi } from '@/lib/api/recordApi';
import { toRecordItemInput } from '@/lib/helpers/recordHelpers';
import { RecordEntity, RecordItem, RecordItemInput } from '@/lib/types/records';
import { Loader2Icon } from 'lucide-react';

type CreateRecordItemDialogProps = {
  open: boolean;
  onDialogClose: () => void;
  record: RecordEntity;
  onCreated?: (item: RecordItem | null) => void;
}

export const CreateRecordItemDialog = ({ 
  open, 
  onDialogClose, 
  record,
  onCreated 
}: CreateRecordItemDialogProps) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState<RecordItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!isFormValid || !formData) return;
    setIsSaving(true);

    try {
      // Convert form data to API request format and submit
      const items = toRecordItemInput([formData], record.recordFields) as RecordItemInput[];
      await recordApi.createRecordItems(record.id, items);

      // Create successful
      handleDialogClose();
      onCreated?.(null); // Maybe return created item?
    } catch (error) {
      console.error('Error submitting form', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormChange = useCallback((isValid: boolean, data: RecordItem) => {
    setIsFormValid(isValid);
    setFormData(data);
  }, []);

  // Reset form state when dialog closes
  const handleDialogClose = () => {
    setIsFormValid(false);
    setFormData(null);
    onDialogClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="md:min-w-[20%]">
        <DialogHeader>
          <DialogTitle>Create Record Item</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh]">
          <div className="m-2">
            <RecordItemForm
              record={record}
              onFormChange={handleFormChange}
            />
          </div>
        </ScrollArea>
        <DialogFooter className="mx-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleDialogClose}>Cancel</Button>
          </DialogClose>
          <Button
            disabled={!isFormValid || isSaving}
            onClick={handleSave}
          >
            {isSaving ? <Loader2Icon className="animate-spin"/> : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

