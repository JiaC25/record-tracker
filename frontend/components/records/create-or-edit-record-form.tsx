import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Form, FormMessage } from '@/components/ui/form';
import { useEffect } from 'react';

type RecordForm ={
  name: string;
  description: string;
}
type CreateOrEditRecordFormProps = {
    open: boolean;
    onClose: () => void;
    edit?: boolean;
}
export const CreateOrEditRecordForm = (props: CreateOrEditRecordFormProps) => {
  const MAX_NAME_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 200;

  const form = useForm<RecordForm>({mode: 'onChange'});
  const {register, 
    reset,
    trigger,
    getValues,
    formState: {errors}} = form;

  useEffect(() => {
    if (props.open) {
      reset();
    }
  }, [props.open, reset]);

  const onDialogClose = () => {
    props.onClose();
  };

  const handleSave = () => {
    trigger();
    console.log(getValues());
  };

  const renderNameInput = () => {
    return  <div className="grid gap-3">
      <Label htmlFor="record-name">Name</Label>
      <Input {...register('name', { 
        required: 'Name is required.', 
        maxLength: { value: MAX_NAME_LENGTH, message: `Name cannot exceed ${MAX_NAME_LENGTH} characters.` }}
      )}
      data-testid="record-name" placeholder="Enter a name for your record" 
      aria-invalid={!!errors.name}
      autoFocus />
      <FormMessage>{errors?.name?.message ?? ''}</FormMessage>
    </div>;
  };

  const renderDescriptionInput = () => {
    return  <div className="grid gap-3">
      <Label htmlFor="description">Description</Label>
      <Input {...register('description', {
        maxLength: { value: MAX_DESCRIPTION_LENGTH, message: `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.` }
      })}
      data-testid="record-description" placeholder="Enter a description for your record" />
      <FormMessage>{errors?.description?.message ?? ''}</FormMessage>
    </div>;
  };

  const renderFormContent = () => {
    return (
      <Form {...form}>
        <form>
          <fieldset className='grid gap-4'>
            {renderNameInput()}
            {renderDescriptionInput()}
          </fieldset>
        </form>
      </Form>);
  };

  const isFormValid = (): boolean => {
    const hasErrors = Object.keys(errors).length > 0;
    const nameHasValue = getValues('name')?.trim().length > 0;
    return nameHasValue && !hasErrors;
  };

  return <AlertDialog open={props.open} onOpenChange={onDialogClose}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{props.edit ? 'Edit Record' : 'Create New Record'}</AlertDialogTitle>
      </AlertDialogHeader>
      
      <AlertDialogDescription />
      {renderFormContent()}
      
      <AlertDialogFooter>
        <Button variant="secondary" onClick={onDialogClose}>Cancel</Button>
        <Button disabled={!isFormValid()} onClick={handleSave} type="submit">Save</Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
};