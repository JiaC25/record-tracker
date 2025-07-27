import { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { RecordForm, RecordFormField } from './record-form';
import { Button } from '@/components/ui/button';

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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{'Create New Record'}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription />

        <RecordForm onFormChange={handleFormChange} />
      
        <AlertDialogFooter>
          <Button variant="secondary" onClick={props.onDialogClose}>Cancel</Button>
          <Button disabled={!isFormValid} onClick={handleSave} type="submit">Save</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};