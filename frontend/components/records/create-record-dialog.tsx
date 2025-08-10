import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { RecordForm, RecordFormField } from './record-form';

type CreateRecordDialogProps = {
    open: boolean;
    onDialogClose: () => void;
}
export const CreateRecordDialog = (props: CreateRecordDialogProps) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const handleSave = () => {
  };

  const handleFormChange = (isFormValid: boolean, data: Partial<RecordFormField>) => {
    setIsFormValid(isFormValid);
  };

  return (
    <AlertDialog open={props.open} onOpenChange={props.onDialogClose}>
      <AlertDialogContent  className="overflow-hidden modal-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{'Create New Record'}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription />
        <div className='overflow-y-auto max-h-[43vh] px-[0.5rem]'>
          <RecordForm onFormChange={handleFormChange} />
        </div>

        <AlertDialogFooter className='absalute bottom-0'>
          <Button variant="secondary" onClick={props.onDialogClose}>Cancel</Button>
          <Button disabled={!isFormValid} onClick={handleSave} type="submit">Save</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};