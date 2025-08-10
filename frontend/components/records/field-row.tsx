import { Trash2Icon } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RecordField } from '@/lib/types/records';
import {Guid} from 'guid-ts';
import { ReactElement, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { FormMessage } from '@/components/ui/form';
import { getRecordFieldErrorMessage, RecordFieldValidation } from '@/lib/helpers/recordHelpers';

type RecordFieldWithNullableFieldType = RecordField & {
  fieldType: RecordField['fieldType'] | null;
}
type FieldRowProps = {
  field: RecordField | undefined;
  onUpdate: (id: string, updatedField: RecordField) => void;
  onDelete: (id: string) => void;
  disabledDelete?: boolean;
  index: number;
  className?: string;
}
export const FieldRow: React.FC<FieldRowProps> = (props) => {

  const [formValidation, setFormValidation] = useState<RecordFieldValidation>({
    errors: {name: ''}
  });

  const newField = props.field as RecordFieldWithNullableFieldType || {
    id: Guid.newGuid().toString(),
    name: '',
    fieldType: null,
    isRequired: false,
    order: props.index,
  };
  const { id, name, fieldType, isRequired } = newField;

  const validateForm = (input: keyof RecordFieldValidation['errors'], errorMessage: string): void => {
    setFormValidation((existing) => ({
      errors: {
        ...existing.errors,
        [input]: errorMessage,
      }
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onUpdate(id, { ...newField, name: e.target.value });
    const input = 'name';
    validateForm(input, getRecordFieldErrorMessage(input, e.target.value));
  };

  const handleTypeChange = (value: RecordField['fieldType']) => {
    props.onUpdate(id, { ...newField, fieldType: value ?? null});
  };

  const handleRequiredChange = (checked: boolean) => {
    props.onUpdate(id, { ...newField, isRequired: checked });
  };

  const renderWithTooltip = (children: ReactElement) => {
    return <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>
        <p>Check this to make this field required.</p>
      </TooltipContent>
    </Tooltip>;
  };

  const renderErrorMessage = () => {
    return <FormMessage>{formValidation.errors.name}</FormMessage>;
  };

  return (<div className={props.className ?? ''}>
    <div id={props.field?.id} className={'list-item'} >
      <div className="flex flex-row md:flex-2 items-center gap-2 mb-3 sm:mb-0">
        {/* Is Required Checkbox */}
        {renderWithTooltip(
          <div className="flex gap-1.5 align-baseline">
            <Checkbox
              data-testid={'is-required'}
              checked={isRequired}
              onCheckedChange={handleRequiredChange}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
            />
            <Label htmlFor={'is-required'} className="text-sm sm:text-base cursor-pointer text-red-400">
              *
            </Label>
          </div>
        )}
        
        {/* Field Name Input */}
        <Label htmlFor={'field-name'} className="sr-only">Field Name</Label>
        <Input
          data-testid={'field-name'}
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Field Name"
          className="w-full"
          aria-invalid={!!formValidation.errors.name}
        />
      </div>
      
      {/* Field Type Dropdown */}
      <div className="mb-3 sm:mb-0 flex flex-shrink sm:flex-1 md:flex-1 justify-end min-w-[120px]">
        <Label htmlFor={'field-type'} className="sr-only">Field Type</Label>
        <Select value={fieldType ?? undefined} onValueChange={handleTypeChange}>
          <SelectTrigger  className="w-full" data-testid="field-type">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Text">Text</SelectItem>
            <SelectItem value="Number">Number</SelectItem>
            <SelectItem value="Date">Date</SelectItem>
            <SelectItem value="TextArea">TextArea</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        disabled={props.disabledDelete}
        variant="destructive"
        onClick={() => props.onDelete(id)}
        className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2"
        data-testid={`delete-field-${id}-button`}
        aria-label="Delete field">
        <Trash2Icon className="w-4 h-4" /> 
      </Button>
    </div>
    {renderErrorMessage()}
  </div>
  );
};