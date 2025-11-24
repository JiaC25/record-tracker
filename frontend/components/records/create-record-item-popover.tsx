'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useRecordStore } from '@/lib/store/recordStore';
import { RecordEntity, RecordItem } from '@/lib/types/records';
import { Loader2Icon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { RecordItemForm } from './record-item-form';

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
  const { createRecordItems } = useRecordStore();
  const isMountedRef = useRef(true);

  // Track if popover is mounted/open to ignore results if closed
  useEffect(() => {
    isMountedRef.current = open;
    return () => {
      isMountedRef.current = false;
    };
  }, [open]);

  const handleSave = async () => {
    if (!isFormValid || !formData) return;
    setIsSaving(true);

    try {
      // Call API and update store with server response
      const createdItems = await createRecordItems(record.id, [formData]);

      // Only update UI if popover is still open
      if (isMountedRef.current) {
        setIsFormValid(false);
        setFormData(null);
        setOpen(false);
        onCreated?.(createdItems[0] || null);
      }
    } catch (error) {
      // Only handle error if popover is still open
      if (isMountedRef.current) {
        console.error('Error submitting form', error);
        // TODO: Show toast notification when toast system is implemented
      }
    } finally {
      // Always reset loading state
      if (isMountedRef.current) {
        setIsSaving(false);
      }
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
      // Reset all state when closing
      setIsFormValid(false);
      setFormData(null);
      setIsSaving(false); // Reset loading state if user closes during save
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="min-w-[300px] max-w-full p-0">
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
};