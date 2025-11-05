import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Form, FormMessage } from '@/components/ui/form';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, ArrowDown, ArrowUp } from 'lucide-react';
import { CreateRecordFieldRequest, CreateRecordRequest, RecordFieldType, RecordSummary, UpdateRecordRequest } from '@/lib/types/records';

type RecordFormProps = {
  initialRecord?: RecordSummary;
  onFormChange: (isValid: boolean, data: CreateRecordRequest | UpdateRecordRequest) => void;
};

export const RecordForm = ({ initialRecord, onFormChange }: RecordFormProps) => {
  const MAX_NAME_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 200;
  const MAX_FIELD_NAME_LENGTH = 50;
  const MAX_FIELDS_PER_RECORD = 5;

  // ReactHookForm only handles name and description fields, RecordFields is dynamic and managed separately (FieldRow)
  type RecordFormValues = Pick<CreateRecordRequest, 'name' | 'description'>;

  const form = useForm<RecordFormValues>({ 
    mode: 'onChange',
    defaultValues: initialRecord ? {
      name: initialRecord.name,
      description: initialRecord.description || ''
    } : {}
  });
  const { register, reset, watch, formState: { errors } } = form;
  const values = watch();

  // Local UI row - uses field ID for edit mode, or generated UUID for create mode
  type FieldRow = {
    id: string; // Field ID for edit mode, UUID for create mode
    name: string;
    fieldType: RecordFieldType;
    isRequired: boolean
  };
  
  // FieldRow validations
  const getFieldRowsIssues = (rows: FieldRow[]) => {
    const issues: string[] = [];

    // empty names
    if (rows.some(r => r.name.trim().length === 0))
      issues.push('All fields must have a name.');
    // length
    if (rows.some(r => r.name.trim().length > MAX_FIELD_NAME_LENGTH))
      issues.push(`Field names cannot exceed ${MAX_FIELD_NAME_LENGTH} characters.`);

    // Check for duplicates fields (case-insensitive and trimmed)
    const normalized = rows
      .map(r => r.name.trim().toLocaleLowerCase())
      .filter(Boolean);
    const uniqueCount = new Set(normalized).size;
    if (uniqueCount !== normalized.length)
      issues.push('Field names must be unique.');

    return issues;
  }

  // Initialize fieldRows from initialRecord if provided
  const initializeFieldRows = useMemo((): FieldRow[] => {
    if (!initialRecord) return [];
    return initialRecord.recordFields
      .sort((a, b) => a.order - b.order)
      .map(field => ({
        id: field.id, // Use actual field ID for edit mode
        name: field.name,
        fieldType: field.fieldType,
        isRequired: field.isRequired
      }));
  }, [initialRecord]);

  const [fieldRows, setFieldRows] = useState<FieldRow[]>(initializeFieldRows);

  const createEmptyRow = (): FieldRow => ({
    id: crypto.randomUUID(),
    name: '',
    fieldType: 'Text',
    isRequired: false,
  });

  const addRow = () => {
    setFieldRows(prev => {
      if (prev.length >= MAX_FIELDS_PER_RECORD) return prev;
      return [...prev, createEmptyRow()]
    });
  }

  const removeRow = (id: string) =>
    setFieldRows(prev => prev.filter(r => r.id !== id));

  const updateRow = (id: string, patch: Partial<Omit<FieldRow, 'id'>>) =>
    setFieldRows(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));

  const moveRow = (id: string, direction: 'up' | 'down') => {
    setFieldRows(prev => {
      const index = prev.findIndex(r => r.id === id);
      if (index === -1) return prev;
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const clone = [...prev];
      const [item] = clone.splice(index, 1);
      clone.splice(newIndex, 0, item);
      return clone;
    });
  };

  // Map UI FieldRows to Request payload
  const recordFieldsForSubmit = useMemo(() => {
    if (initialRecord) {
      // Edit mode: return UpdateRecordFieldInput[]
      return fieldRows.map((r, idx) => ({
        id: initialRecord.recordFields.some(f => f.id === r.id) ? r.id : undefined, // Only include ID if it's an existing field
        name: r.name.trim(),
        order: idx,
        fieldType: r.fieldType,
        isRequired: r.isRequired,
      }));
    } else {
      // Create mode: return CreateRecordFieldRequest[]
      return fieldRows.map((r, idx) => ({
        name: r.name.trim(),
        fieldType: r.fieldType,
        isRequired: r.isRequired,
        order: idx,
      }));
    }
  }, [fieldRows, initialRecord]);

  // Cache last emitted validity/payload to avoid redundant onFormChange calls
  const lastEmittedRef = useRef<{ valid: boolean; payloadJson: string } | null>(null);

  useEffect(() => {
    const isFormValid = (values: RecordFormValues): boolean => {
      const hasErrors = Object.keys(errors).length > 0;
      const nameHasValue = values?.name && values.name.trim().length > 0;
      const fieldIssues = getFieldRowsIssues(fieldRows);
      return !!nameHasValue && !hasErrors && fieldIssues.length === 0;
    };

    const isValid = isFormValid(values);

    const payload = initialRecord 
      ? {
          recordId: initialRecord.id,
          name: values.name?.trim() ?? '',
          description: values.description?.trim() ?? '',
          recordFields: recordFieldsForSubmit,
        } as UpdateRecordRequest
      : {
          name: values.name?.trim() ?? '',
          description: values.description?.trim() ?? '',
          recordFields: recordFieldsForSubmit,
        } as CreateRecordRequest;
    
    const payloadJson = JSON.stringify(payload);

    // Call onFormChange only if the form actually changed
    const last = lastEmittedRef.current;
    const changed = !last || last.valid !== isValid || last.payloadJson !== payloadJson;
    if (changed) {
      onFormChange(isValid, payload);
      lastEmittedRef.current = { valid: isValid, payloadJson };
    }
  }, [values, errors, fieldRows, recordFieldsForSubmit, onFormChange, initialRecord]);

  // Reset form when initialRecord changes (for edit mode)
  useEffect(() => {
    if (initialRecord) {
      reset({
        name: initialRecord.name,
        description: initialRecord.description || ''
      });
      setFieldRows(initializeFieldRows);
    } else {
      reset();
      setFieldRows([]);
    }
  }, [initialRecord, reset, initializeFieldRows]);

  const renderNameInput = () => {
    return (
      <div className="grid gap-3">
        <Label htmlFor="record-name">Name</Label>
        <Input {...register('name', {
          required: 'Name is required.',
          maxLength: { value: MAX_NAME_LENGTH, message: `Name cannot exceed ${MAX_NAME_LENGTH} characters.` }
        }
        )}
          data-testid="record-name" placeholder="Enter a name for your record"
          aria-invalid={!!errors.name}
          autoFocus />
        <FormMessage>{errors?.name?.message ?? ''}</FormMessage>
      </div>
    );
  };

  const renderDescriptionInput = () => {
    return <div className="grid gap-3">
      <Label htmlFor="description">Description</Label>
      <Input {...register('description', {
        maxLength: { value: MAX_DESCRIPTION_LENGTH, message: `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.` }
      })}
        data-testid="record-description" placeholder="Enter a description for your record" />
      <FormMessage>{errors?.description?.message ?? ''}</FormMessage>
    </div>;
  };

  const renderFieldRow = (row: FieldRow, index: number) => {
    const canMoveUp = index > 0;
    const canMoveDown = index < fieldRows.length - 1;

    return (
      <div key={row.id} className="grid grid-cols-12 gap-2 items-center bg-accent p-2 border-l-4 rounded-sm">
        {/* Name */}
        <div className="col-span-12 md:col-span-6">
          <Label className="sr-only" htmlFor={`field-name-${row.id}`}>Field name</Label>
          <Input
            id={`field-name-${row.id}`}
            value={row.name}
            onChange={(e) => updateRow(row.id, { name: e.target.value })}
            placeholder="Field name (e.g. Date, Amount)"
            className="bg-background"
          />
        </div>
        {/* Type */}
        <div className="col-span-3 md:col-span-2">
          <Label className="sr-only" htmlFor={`field-type-${row.id}`}>Type</Label>
          <Select
            value={row.fieldType}
            onValueChange={(v: RecordFieldType) => updateRow(row.id, { fieldType: v })}
            disabled={!!initialRecord && initialRecord.recordFields.some(f => f.id === row.id)} // Disable for existing fields
          >
            <SelectTrigger id={`field-type-${row.id}`} className="bg-background">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Text">Text</SelectItem>
              <SelectItem value="Number">Number</SelectItem>
              <SelectItem value="Date">Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Required */}
        <div className="col-span-5 justify-start flex items-center gap-2 shrink-0 md:col-span-2">
          <Label className="text-sm" htmlFor={`field-required-${row.id}`}>Required</Label>
          <Switch
            id={`field-required-${row.id}`}
            checked={row.isRequired}
            onCheckedChange={(checked) => updateRow(row.id, { isRequired: !!checked })}
            disabled={!!initialRecord && initialRecord.recordFields.some(f => f.id === row.id)} // Disable for existing fields
          />
        </div>
        {/* Row actions */}
        <div className="col-span-4 md:col-span-2 flex items-center justify-end whitespace-nowrap shrink-0">
          <Button type="button" variant="ghost" size="icon" disabled={!canMoveUp} onClick={() => moveRow(row.id, 'up')}>
            <ArrowUp className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" disabled={!canMoveDown}onClick={() => moveRow(row.id, 'down')}>
            <ArrowDown className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(row.id)}>
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </div>
    );
  };
  const renderFieldsBuilder = () => {
    const fieldIssues = getFieldRowsIssues(fieldRows);
    return (
      <div className="grid gap-3">
        <Separator />
        <div className="flex items-center justify-between">
          <Label>
            Fields
          </Label>
          <div className="flex items-center gap-3">
            {fieldRows.length >= MAX_FIELDS_PER_RECORD && (
              <span className="text-sm text-muted-foreground pl-4">
                You’ve reached the maximum of {MAX_FIELDS_PER_RECORD} fields per record
              </span>
            )}
            <Button type="button" variant="secondary" size="sm" onClick={addRow} disabled={fieldRows.length >= MAX_FIELDS_PER_RECORD}>
              <Plus className="size-4" /> Add field
            </Button>
          </div>
        </div>

        {fieldRows.length === 0 ?
          <p className="text-sm text-muted-foreground">No fields yet. Add your first field.</p>
          : <div className="grid gap-2 max-h-80 overflow-auto pr-2">{fieldRows.map((r, i) => renderFieldRow(r, i))}</div>
        }
        
        {/* Field errors message */}
        {fieldIssues.length > 0 && (
          <div className="text-sm text-destructive space-y-1">
            {fieldIssues.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
          </div>
        )}

        <Separator />
      </div>
    );
  };

  return (
    <Form {...form}>
      <form>
        <fieldset className='grid gap-4'>
          {renderNameInput()}
          {renderDescriptionInput()}
          {renderFieldsBuilder()}
        </fieldset>
      </form>
    </Form>
  );
};