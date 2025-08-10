import { Trash2Icon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RecordField } from '@/lib/types/records';
import {Guid} from 'guid-ts';

type RecordFieldWithNullableFieldType = RecordField & {
  fieldType: RecordField['fieldType'] | null;
}

type FieldRowProps = {
  field: RecordField | undefined;
  onUpdate: (id: string, updatedField: RecordField) => void;
  onDelete: (id: string) => void;
  disabledDelete?: boolean;
  index: number;
}
export const FieldRow: React.FC<FieldRowProps> = ({ field, onUpdate, onDelete, disabledDelete, index = 0 }) => {

  const newField = field as RecordFieldWithNullableFieldType || {
    id: Guid.newGuid().toString(),
    name: '',
    fieldType: null,
    isRequired: false,
    order: index,
  };
  const { id, name, fieldType, isRequired } = newField;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(id, { ...newField, name: e.target.value });
  };

  const handleTypeChange = (value: RecordField['fieldType']) => {
    onUpdate(id, { ...newField, fieldType: value ?? null});
  };

  // Handler for toggling the isRequired status
  const handleRequiredChange = (checked: boolean) => {
    onUpdate(id, { ...newField, isRequired: checked });
  };

  return (
    <Card id={field?.id} 
      className="sm:block sm:m-0 gap-0 md:flex md:flex-row md:items-center md:justify-between md:gap-4 md:p-4 transition-all border-none shadow-none hover-bg">
      <div className="flex flex-row md:flex-2 items-center gap-2 mb-3 sm:mb-0">
        {/* Is Required Checkbox */}
        <Checkbox
          data-testid={'is-required'}
          checked={isRequired}
          onCheckedChange={handleRequiredChange}
          className="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
        />
        <Label htmlFor={'is-required'} className="text-sm sm:text-base cursor-pointer text-red-400">
          *
        </Label>
        {/* Field Name Input */}
        <Label htmlFor={'field-name'} className="sr-only">Field Name</Label>
        <Input
          data-testid={'field-name'}
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Field Name"
          className="w-full"
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
        disabled={disabledDelete}
        variant="destructive"
        onClick={() => onDelete(id)}
        className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2"
        data-testid={`delete-field-${id}-button`}
        aria-label="Delete field">
        <Trash2Icon className="w-4 h-4" /> 
      </Button>
    </Card>
  );
};