import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog';

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
        <AlertDialogDescription />
        <div className="py-2">{message}</div>
        <AlertDialogFooter>
          <Button onClick={onClose} autoFocus>OK</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DialogInfo;
