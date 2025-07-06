import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter,  AlertDialogDescription} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export type DialogInfoPayload = {
    open: boolean;
    title?: string;
    message: string;
}

type DialogInfoProps ={
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

const DialogInfo: React.FC<DialogInfoProps> = ({ open, title = 'Info', message, onClose }) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          {message}
        </AlertDialogDescription>
        <AlertDialogFooter>
          <Button variant={'secondary'} onClick={onClose} autoFocus>OK</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DialogInfo;
