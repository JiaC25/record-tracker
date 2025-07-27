'use client';

import { CirclePlus } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { AddOrEditRecordForm } from './add-or-edit-record-form';

export const AddNewRecordButton = () => {

  const [showNewRecordForm, setShowNewRecordForm] = useState(false);
  return <>
    <Button data-testid="add-new-record-button" variant="default" className="width-full" onClick={() => setShowNewRecordForm(true)}>
      <CirclePlus className='size-4' /> New record
    </Button>
    <AddOrEditRecordForm open={showNewRecordForm} onClose={() => setShowNewRecordForm(false)} />
  </>;
};