import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Analytic } from '@/lib/types/analytics';
import { useAnalyticsStore } from '@/lib/store/analyticsStore';
import { useState } from 'react';

type DeleteAnalyticDialogProps = {
    open: boolean
    analytic: Analytic
    onClose: () => void
    onDeleted: () => void
}

export const DeleteAnalyticDialog = ({ 
    open, 
    analytic, 
    onClose, 
    onDeleted 
}: DeleteAnalyticDialogProps) => {
    const { deleteAnalytic } = useAnalyticsStore();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteAnalytic(analytic.recordId, analytic.id);
            onDeleted();
        } catch (error) {
            console.error('Failed to delete analytic', error);
            // Dialog stays open on error so user can retry or cancel
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Analytic</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete &quot;{analytic.name}&quot;? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isDeleting ? 'Deleting…' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

