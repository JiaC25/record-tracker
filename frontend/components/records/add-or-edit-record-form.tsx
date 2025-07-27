import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog';

type AddOrEditRecordFormProps = {
    open: boolean;
    onClose: () => void;
    edit?: boolean;
}
export const AddOrEditRecordForm = (props: AddOrEditRecordFormProps) => {
  return <AlertDialog open={props.open} onOpenChange={props.onClose}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{props.edit ? 'Edit Record' : 'Add New Record'}</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>Add or edit a record</AlertDialogDescription>
      
      <AlertDialogFooter>
        <Button variant="secondary" onClick={props.onClose}>Cancel</Button>
        <Button onClick={props.onClose}>Save</Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
};