import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Form, FormMessage } from '@/components/ui/form';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, ArrowDown, ArrowUp, GripVertical } from 'lucide-react';
import { CreateRecordRequest, RecordFieldType, RecordSummary, UpdateRecordRequest } from '@/lib/types/records';
import { closestCorners, DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';

type RecordFormProps = {
  initialRecord?: RecordSummary;
  onFormChange: (isValid: boolean, data: CreateRecordRequest | UpdateRecordRequest) => void;
};

// Local UI row - uses field ID for edit mode, or generated UUID for create mode
type FieldRow = {
  id: string; // Field ID for edit mode, UUID for create mode
  name: string;
  fieldType: RecordFieldType;
  isRequired: boolean
};

export const RecordForm = ({ initialRecord, onFormChange }: RecordFormProps) => {
  const MAX_NAME_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 200;
  const MAX_FIELD_NAME_LENGTH = 50;
  const MAX_FIELDS_PER_RECORD = 5;

  const [isDraggingFields, setIsDraggingFields] = useState(false);

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
  const nameValue = watch('name');
  const descriptionValue = watch('description');

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
    id: uuidv4(),
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

  const removeRow = useCallback((id: string) =>
    setFieldRows(prev => prev.filter(r => r.id !== id)), [setFieldRows]);

  const updateRow = useCallback((id: string, patch: Partial<Omit<FieldRow, 'id'>>) =>
    setFieldRows(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r))), [setFieldRows]);

  const existingFieldIds = useMemo(() => {
    if (!initialRecord) return new Set<string>();
    return new Set(initialRecord.recordFields.map(f => f.id));
  }, [initialRecord]);

  const sortableIds = useMemo(() => fieldRows.map(r => r.id), [fieldRows]);

  const fieldIssues = useMemo(() => getFieldRowsIssues(fieldRows), [fieldRows]);

  const rowsKey = useMemo(
    () => fieldRows.map(r => `${r.id}|${r.name}|${r.fieldType}|${r.isRequired}`).join('~'),
    [fieldRows]
  );

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
  const lastEmittedRef = useRef<{ valid: boolean; name: string; desc: string; rowsKey: string } | null>(null);

  // Emit form validations and changes
  useEffect(() => {
    const trimmedName = nameValue?.trim() ?? '';
    const trimmedDescription = descriptionValue?.trim() ?? '';
    const hasErrors = Object.keys(errors).length > 0;
    const isValid = trimmedName.length > 0 && !hasErrors && fieldIssues.length === 0;

    const payload = initialRecord
      ? {
        recordId: initialRecord.id,
        name: trimmedName,
        description: trimmedDescription,
        recordFields: recordFieldsForSubmit,
      } as UpdateRecordRequest
      : {
        name: trimmedName,
        description: trimmedDescription,
        recordFields: recordFieldsForSubmit,
      } as CreateRecordRequest;

    const snapshot = { valid: isValid, name: trimmedName, desc: trimmedDescription, rowsKey };
    const last = lastEmittedRef.current;
    const changed = !last
      || last.valid !== snapshot.valid
      || last.name !== snapshot.name
      || last.desc !== snapshot.desc
      || last.rowsKey !== snapshot.rowsKey;
    if (changed) {
      onFormChange(isValid, payload);
      lastEmittedRef.current = snapshot;
    }
  }, [nameValue, descriptionValue, errors, fieldIssues, recordFieldsForSubmit, onFormChange, initialRecord, rowsKey]);

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

  const handleDragEnd = (event: any) => {
    const { active, over } = event; // active is the dragged item, over is the item being hovered
    if (active.id === over.id) return;

    const oldIndex = fieldRows.findIndex(r => r.id === active.id);
    const newIndex = fieldRows.findIndex(r => r.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    setFieldRows((prev) => {
      const newRows = [...prev];
      const [movedItem] = newRows.splice(oldIndex, 1);
      newRows.splice(newIndex, 0, movedItem);
      return newRows;
    });
  }

  useEffect(() => {
    if (isDraggingFields) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isDraggingFields]);

  const renderFieldsBuilder = () => {
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
                You’ve reached the maximum of {MAX_FIELDS_PER_RECORD} fields
              </span>
            )}
            <Button type="button" variant="secondary" size="sm" onClick={addRow} disabled={fieldRows.length >= MAX_FIELDS_PER_RECORD}>
              <Plus className="size-4" /> Add field
            </Button>
          </div>
        </div>
        {/* Render Field Rows */}
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} onDragStart={() => setIsDraggingFields(true)} onDragCancel={() => setIsDraggingFields(false)}>
          {fieldRows.length === 0 ?
            <p className="text-sm text-muted-foreground">No fields yet. Add your first field.</p>
            : (
              <div className="grid gap-2 pr-2 overflow-x-hidden">
                <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                  {fieldRows.map((r) => (
                    <SortableFieldRow
                      key={r.id}
                      row={r}
                      isExisting={existingFieldIds.has(r.id)}
                      updateRow={updateRow}
                      removeRow={removeRow}
                    />
                  ))}
                </SortableContext>
              </div>
            )
          }
        </DndContext>
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

/** SORTABLE FIELD ROW COMPONENT */
type SortableFieldRowProps = {
  row: FieldRow,
  isExisting: boolean,
  updateRow: (id: string, patch: Partial<Omit<FieldRow, 'id'>>) => void,
  removeRow: (id: string) => void,
};
export const SortableFieldRow = memo(({ row, isExisting, updateRow, removeRow }: SortableFieldRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const containerClasses = [
    'flex items-center border rounded-sm py-3 bg-accent/70 shadow-sm',
    isExisting ? '' : 'border-l-3 border-l-emerald-300 dark:border-l-emerald-600/70'
  ].join(' ');

  return (
    <div
      key={row.id} ref={setNodeRef} {...attributes} style={style}
      className={containerClasses}
    >
      {/* Drag handle */}
      <div className="px-1 py-3 touch-none" {...listeners}>
        <GripVertical className="size-5 text-muted-foreground cursor-grab" />
      </div>
      <div className="grid grid-cols-12 gap-2 items-center flex-1">
        {/* Name */}
        <div className="col-span-12 md:col-span-5">
          <Label className="sr-only" htmlFor={`field-name-${row.id}`}>Field name</Label>
          <Input
            id={`field-name-${row.id}`}
            value={row.name}
            onChange={(e) => updateRow(row.id, { name: e.target.value })}
            placeholder="Field name (e.g. Date, Amount)"
            className="bg-background w-full"
          />
        </div>
        {/* Type */}
        <div className="col-span-7 md:col-span-4">
          <Label className="sr-only" htmlFor={`field-type-${row.id}`}>Type</Label>
          <Select
            value={row.fieldType}
            onValueChange={(v: RecordFieldType) => updateRow(row.id, { fieldType: v })}
            disabled={isExisting} // Disable for existing fields
          >
            <SelectTrigger id={`field-type-${row.id}`} className="bg-background w-full">
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
        <div className="col-span-5 md:col-span-3 flex items-center gap-2 p-2 md:px-3 bg-background/50 w-fit
          border cursor-pointer hover:bg-accent/30 rounded-sm"
        >
          <Switch
            id={`field-required-${row.id}`}
            checked={row.isRequired}
            onCheckedChange={(checked) => updateRow(row.id, { isRequired: !!checked })}
            disabled={isExisting} // Disable for existing fields
          />
          <Label className="text-sm cursor-pointer" htmlFor={`field-required-${row.id}`}>Required</Label>
        </div>
      </div>
      {/* Delete button */}
      <div className="min-w-fit">
        <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(row.id)}>
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
});

SortableFieldRow.displayName = 'SortableFieldRow';
