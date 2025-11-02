'use client';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCallback, useState, useId } from 'react';
import { RecordItemForm } from '@/components/records/record-item-form';
import { useRecordStore } from '@/lib/store/recordStore';
import { RecordEntity, RecordItem } from '@/lib/types/records';
import { Loader2Icon } from 'lucide-react';

type EditRecordItemDialogProps = {
  open: boolean;
  onDialogClose: () => void;
  record: RecordEntity;
  item: RecordItem;
  onUpdated?: () => void;
}

export const EditRecordItemDialog = ({ 
  open, 
  onDialogClose, 
  record,
  item,
  onUpdated
}: EditRecordItemDialogProps) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState<RecordItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const formId = useId(); // Unique id to use in the form
  const { updateRecordItem } = useRecordStore();

  const handleSave = async () => {
    if (!isFormValid || !formData) return;
    setIsSaving(true);

    try {
      // The store method will handle API call and state update
      await updateRecordItem(record.id, item.id, formData);

      // Update successful
      handleDialogClose();
      onUpdated?.();
    } catch (error) {
      console.error('Error updating record item', error);
      // TODO: Show toast notification when toast system is implemented
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
          <DialogTitle>Edit Record Item</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh]">
          <div className="m-2">
            <RecordItemForm
              record={record}
              formId={formId}
              onFormChange={handleFormChange}
              defaultItem={item}
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
            {isSaving ? <Loader2Icon className="animate-spin"/> : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

