import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { CreateRecordDialog } from './create-record-dialog';

export const CreateNewRecordButton = () => {

  const [showNewRecordForm, setShowNewRecordForm] = useState(false);
  return <>
    <Button data-testid="create-new-record-button" variant="default" className="w-full" size="sm" onClick={() => setShowNewRecordForm(true)}>
      <Plus className="size-4" /> New record
    </Button>
    <CreateRecordDialog open={showNewRecordForm} onDialogClose={() => setShowNewRecordForm(false)} />
  </>;
};