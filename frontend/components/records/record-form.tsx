import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Form, FormMessage } from '@/components/ui/form';
import { useEffect, useState } from 'react';
import { FieldSection } from './field-section';
import { RecordField } from '@/lib/types/records';

export type RecordFormField ={
  name: string;
  description: string;
}

type RecordFormProps = {
  onFormChange: (isFormValid: boolean, data: Partial<RecordFormField>) => void;
}
export const RecordForm = ({ onFormChange }: RecordFormProps) => {
  const MAX_NAME_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 200;

  const form = useForm<RecordFormField>({mode: 'onChange'});
  const {register, reset, watch,
    formState: {errors}} = form;

  const [primaryFields, setPrimaryFields] = useState<RecordField[]>([
  ]);
  
  const [secondaryFields, setSecondaryFields] = useState<RecordField[]>([
  ]);

  const values = watch();

  useEffect(() => {
    const isFormValid = (values: Partial<RecordFormField>): boolean => {
      const hasErrors = Object.keys(errors).length > 0;
      const nameHasValue = values?.name && values.name.trim().length > 0;
      const hasAtLeastOnePrimaryField = primaryFields.length > 0;
      return !!nameHasValue && !!hasAtLeastOnePrimaryField && !hasErrors;
    };
  
    const isValid = isFormValid(values);
    onFormChange(isValid, values);
  }, [values, errors, onFormChange, primaryFields]);

  useEffect(() => {
    reset();
  }, [reset]);

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

  return <Form {...form}>
    <form>
      <fieldset className='grid gap-4'>
        {renderNameInput()}
        {renderDescriptionInput()}
        <FieldSection primaryFields={primaryFields} setPrimaryFields={setPrimaryFields}
          secondaryFields={secondaryFields} setSecondaryFields={setSecondaryFields} />
      </fieldset>
    </form>
  </Form>;
};