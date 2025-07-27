import { CirclePlus } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { CreateOrEditRecordForm } from './create-or-edit-record-form';

export const CreateNewRecordButton = () => {

  const [showNewRecordForm, setShowNewRecordForm] = useState(false);
  return <>
    <Button data-testid="create-new-record-button" variant="default" className="width-full" onClick={() => setShowNewRecordForm(true)}>
      <CirclePlus className='size-4' /> New record
    </Button>
    <CreateOrEditRecordForm open={showNewRecordForm} onClose={() => setShowNewRecordForm(false)} />
  </>;
};