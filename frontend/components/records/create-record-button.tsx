import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { CreateRecordDialog } from './create-record-dialog';

export const CreateNewRecordButton = () => {

  const [showNewRecordForm, setShowNewRecordForm] = useState(false);
  return <>
    <Button data-testid="create-new-record-button" variant="default" className="width-full" onClick={() => setShowNewRecordForm(true)}>
      <CirclePlus className='size-4' /> New record
    </Button>
    <CreateRecordDialog open={showNewRecordForm} onDialogClose={() => setShowNewRecordForm(false)} />
  </>;
};