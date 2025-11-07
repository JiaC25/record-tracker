'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RecordEntity, RecordItem, RecordItemInput } from '@/lib/types/records';
import { Button } from '../ui/button';
import { Loader2Icon } from 'lucide-react';
import { RecordItemForm } from './record-item-form';
import { useCallback, useState } from 'react';
import { toRecordItemInput } from '@/lib/helpers/recordHelpers';
import { recordApi } from '@/lib/api/recordApi';
import { ScrollArea } from '@/components/ui/scroll-area';

type CreateRecordItemPopoverProps = {
  record: RecordEntity;
  children: React.ReactNode;
  onCreated?: (item: RecordItem | null) => void;
}

export const CreateRecordItemPopover = ({
  record,
  children,
  onCreated
}: CreateRecordItemPopoverProps) => {
  const [open, setOpen] = useState(false);
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
      setIsFormValid(false);
      setFormData(null);
      setOpen(false);
      onCreated?.(null); // Maybe return created item?
    } catch (error) {
      console.error('Error submitting form', error);
      // TODO: Show toast notification when toast system is implemented
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormChange = useCallback((isValid: boolean, data: RecordItem) => {
    setIsFormValid(isValid);
    setFormData(data);
  }, []);

  // Reset form state when popover closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setIsFormValid(false);
      setFormData(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-[50vh] md:w-[45vh] p-0">
        <div className="max-h-[40vh] overflow-y-auto scrollbar-styled p-4">
            <RecordItemForm
              record={record}
              onFormChange={handleFormChange}
            />
        </div>
        <div className="flex justify-end p-2 border-t bg-secondary/30">
          <Button size="sm" disabled={!isFormValid || isSaving} onClick={handleSave}>
            {isSaving ? <Loader2Icon className="animate-spin" /> : 'Add'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}