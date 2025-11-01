'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { RecordEntity, RecordItem } from '@/lib/types/records';
import { useEffect, useRef } from 'react';
import { RegisterOptions, useForm } from 'react-hook-form';

type RecordItemFormProps = {
  record: RecordEntity;
  formId: string;
  onFormChange?: (isValid: boolean, data: RecordItem) => void;
  onFormSubmit?: (data: RecordItem) => void;
};

export const RecordItemForm = ({
  record,
  formId,
  onFormChange,
  onFormSubmit
}: RecordItemFormProps) => {
  const form = useForm<RecordItem>({
    mode: 'onChange',
    defaultValues: {},
  });
  const { formState, watch } = form;
  const values = watch();

  // Cache last emitted validity/payload to avoid redundant onFormChange calls
  const lastEmittedRef = useRef<{ valid: boolean; payloadJson: string } | null>(null);

  useEffect(() => {
    const formData: RecordItem = { ...values } as RecordItem;
    const payloadJson = JSON.stringify(formData);

    // Call onFormChange only if the form actually changed
    const last = lastEmittedRef.current;
    const changed = !last || last.valid !== formState.isValid || last.payloadJson !== payloadJson;
    if (changed) {
      onFormChange?.(formState.isValid, formData);
      lastEmittedRef.current = { valid: formState.isValid, payloadJson };
    }
  }, [formState.isValid, values, onFormChange]);

  const handleSubmit = (data: RecordItem) => {
    onFormSubmit?.(data);
  };

  // Validation rules
  const getValidationRules = (field: RecordEntity['recordFields'][number]) => {
    const rules: RegisterOptions = {};

    if (field.isRequired) {
      rules.required = `${field.name} is required`;
    }

    if (field.fieldType === 'Number') {
      rules.validate = {
        isNumber: (value: string) =>
          !isNaN(Number(value)) || `${field.name} must be a number.`
      };
    }

    if (field.fieldType === 'Date') {
      rules.validate = {
        isValidDate: (value: string) => {
          if (!value) return field.isRequired ? `${field.name} is required` : true;
          const date = new Date(value);
          return !isNaN(date.getTime()) || `${field.name} must be a valid date.`;
        }
      };
    }

    return rules;
  };

  return (
    <Form {...form}>
      <form
        id={formId}
        className="grid gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {record.recordFields.map((field) => (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            rules={getValidationRules(field)}
            render={({ field: fieldProps }) => (
              <FormItem>
                <FormLabel>{field.name}{field.isRequired && <span className="text-red-400">*</span>}</FormLabel>
                <FormControl>
                  {field.fieldType === 'Date' ? (
                    <DatePicker
                      value={fieldProps.value ? new Date(fieldProps.value) : undefined}
                      onChange={(date) => {
                        // Convert Date to ISO string format for form storage
                        fieldProps.onChange(date ? date.toISOString() : '');
                      }}
                      placeholder={`Select ${field.name.toLowerCase()}`}
                      className="w-full justify-between font-normal"
                      id={`${field.id}-datepicker`}
                    />
                  ) : (
                    <Input
                      {...fieldProps}
                      value={fieldProps.value || ''}
                      placeholder={`Enter ${field.name.toLowerCase()}`}
                    />
                  )}
                </FormControl>
                <FormMessage className="text-xs -mt-1"/>
              </FormItem>
            )}
          />
        ))}
      </form>
    </Form>
  );
};