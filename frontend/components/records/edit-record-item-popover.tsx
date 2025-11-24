'use client';

import { RecordItemForm } from '@/components/records/record-item-form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { useRecordStore } from '@/lib/store/recordStore';
import { RecordEntity, RecordItem } from '@/lib/types/records';
import { Loader2Icon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type EditRecordItemPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: RecordEntity;
  item: RecordItem;
  onUpdated?: () => void;
  anchorId?: string;
}

export const EditRecordItemPopover = ({ 
  open, 
  onOpenChange, 
  record,
  item,
  onUpdated,
  anchorId
}: EditRecordItemPopoverProps) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState<RecordItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [anchorPosition, setAnchorPosition] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const { updateRecordItem } = useRecordStore();
  const isMountedRef = useRef(true);

  // Track if popover is mounted/open to ignore results if closed
  useEffect(() => {
    isMountedRef.current = open;
    return () => {
      isMountedRef.current = false;
    };
  }, [open]);

  // Position the Popover based on the anchor element's position
  useEffect(() => {
    if (anchorId && open) {
      const element = document.getElementById(anchorId);
      setAnchorElement(element);
      const updatePosition = () => {
        if (element) {
          const rect = element.getBoundingClientRect();
          setAnchorPosition({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          });
        }
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    } else {
      setAnchorElement(null);
      setAnchorPosition(null);
    }
  }, [anchorId, open]);

  const handleSave = async () => {
    if (!isFormValid || !formData) return;
    setIsSaving(true);

    try {
      // Call API and update store with server response
      await updateRecordItem(record.id, item.id, formData);

      // Only update UI if popover is still open
      if (isMountedRef.current) {
        handlePopoverClose();
        onUpdated?.();
      }
    } catch (error) {
      // Only handle error if popover is still open
      if (isMountedRef.current) {
        console.error('Error updating record item', error);
        // TODO: Show toast notification when toast system is implemented
      }
    } finally {
      // Always reset loading state if popover is still open
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
  const handlePopoverClose = () => {
    setIsFormValid(false);
    setFormData(null);
    setIsSaving(false); // Reset loading state if user closes during save
    onOpenChange(false);
  };

  if (!open || !anchorElement || !anchorPosition) return null;

  return (
    <Popover open={open} onOpenChange={handlePopoverClose}>
      <PopoverAnchor asChild>
        <span
          style={{
            position: 'fixed',
            left: anchorPosition.left,
            top: anchorPosition.top,
            width: anchorPosition.width,
            height: anchorPosition.height,
            pointerEvents: 'none',
            visibility: 'hidden',
          }}
        />
      </PopoverAnchor>
      <PopoverContent side="bottom" align="end" className="min-w-[300px] max-w-full p-0">
        <div className="max-h-[40vh] overflow-y-auto scrollbar-styled p-4">
          <RecordItemForm
            record={record}
            onFormChange={handleFormChange}
            defaultItem={item}
          />
        </div>
        <div className="flex justify-end p-2 border-t bg-secondary/30">
          <Button size="sm" disabled={!isFormValid || isSaving} onClick={handleSave}>
            {isSaving ? <Loader2Icon className="animate-spin"/> : 'Save'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

