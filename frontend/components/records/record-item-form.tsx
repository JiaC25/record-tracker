'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RecordEntity, RecordItem } from '@/lib/types/records';
import { useEffect } from 'react';
import { RegisterOptions, useForm } from 'react-hook-form';

type RecordItemFormProps = {
  record: RecordEntity;
  formId: string;
  onFormChange?: (isValid: boolean) => void;
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
  const { formState } = form;

  useEffect(() => {
    onFormChange?.(formState.isValid);
  }, [formState.isValid, onFormChange]);

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
                  <Input
                    {...fieldProps}
                    value={fieldProps.value || ''}
                    placeholder={`Enter ${field.name.toLowerCase()}`}
                  />
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