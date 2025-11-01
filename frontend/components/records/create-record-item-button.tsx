'use client';

import { RecordItemForm } from '@/components/records/record-item-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { recordApi } from '@/lib/api/recordApi';
import { toCreateRecordItemsRequest } from '@/lib/helpers/recordHelpers';
import { RecordEntity, RecordItem } from '@/lib/types/records';
import { Loader2Icon, Plus } from 'lucide-react';
import { useId, useState } from 'react';

type CreateRecordItemButtonProps = {
  record: RecordEntity;
  onCreated?: (item: RecordItem | null) => void;
};

export const CreateRecordItemButton = ({ record, onCreated }: CreateRecordItemButtonProps) => {
  const [open, setOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formId = useId(); // Unique id to use in the form

  const handleFormChange = (isValid: boolean) => {
    setIsFormValid(isValid);
  };

  const handleFormSubmit = async (data: RecordItem) => {
    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      // Convert form data to API request format and submit
      const requestBody = toCreateRecordItemsRequest(data, record.recordFields);
      await recordApi.createRecordItems(record.id, requestBody);

      // Create successful
      setOpen(false);
      onCreated?.(null); // Maybe return created item?
    } catch (error) {
      console.error('Error submitting form', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" className="w-12">
        <Plus className="" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="md:min-w-[20%]">
          <DialogHeader>
            <DialogTitle>Create Record Item</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[65vh]">
            <div className="m-2">
              <RecordItemForm
                record={record}
                formId={formId}
                onFormChange={handleFormChange}
                onFormSubmit={handleFormSubmit}
              />
            </div>
          </ScrollArea>
          <DialogFooter className="mx-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              form={formId}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2Icon className="animate-spin"/> : 'Create' }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};