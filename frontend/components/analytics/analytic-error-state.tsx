import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type AnalyticErrorStateProps = {
    message: string
    onEdit?: () => void
    onDelete?: () => void
}

export const AnalyticErrorState = ({ message, onEdit, onDelete }: AnalyticErrorStateProps) => {
  return (
    <Alert variant="destructive" className="border-destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Analytic Error</AlertTitle>
      <AlertDescription>
        {message}
        {(onEdit || onDelete) && (
          <div className="mt-2 flex gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="text-sm underline hover:no-underline"
              >
                                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="text-sm underline hover:no-underline"
              >
                                Delete
              </button>
            )}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

