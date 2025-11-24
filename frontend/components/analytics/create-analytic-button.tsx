'use client';

import { Button } from '@/components/ui/button';
import { RecordField } from '@/lib/types/records';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { CreateAnalyticDialog } from './create-analytic-dialog';

type CreateAnalyticButtonProps = {
    recordId: string
    recordFields: RecordField[]
    onAnalyticCreated?: () => void
}

export const CreateAnalyticButton = ({ 
  recordId, 
  recordFields, 
  onAnalyticCreated 
}: CreateAnalyticButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button 
        variant="default" 
        size="sm"
        onClick={() => setShowDialog(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
                Create Analytic
      </Button>
      {showDialog && (
        <CreateAnalyticDialog
          open={showDialog}
          recordId={recordId}
          recordFields={recordFields}
          onClose={() => setShowDialog(false)}
          onCreated={() => {
            setShowDialog(false);
            onAnalyticCreated?.();
          }}
        />
      )}
    </>
  );
};

