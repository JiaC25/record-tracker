'use client';

import { Button } from '@/components/ui/button';
import { CreateRecordItemDialog } from '@/components/records/create-record-item-dialog';
import { RecordEntity, RecordItem } from '@/lib/types/records';
import { Plus } from 'lucide-react';
import { useState } from 'react';

type CreateRecordItemButtonProps = {
  record: RecordEntity;
  onCreated?: (item: RecordItem | null) => void;
};

export const CreateRecordItemButton = ({ record, onCreated }: CreateRecordItemButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" className="w-12">
        <Plus className="" />
      </Button>
      <CreateRecordItemDialog 
        open={open} 
        onDialogClose={() => setOpen(false)}
        record={record}
        onCreated={onCreated}
      />
    </>
  );
};
