import { GroupedRecordSummaries, RecordField, RecordSummary } from '@/lib/types/records';

export type RecordFieldValidation = {
  errors: {
    name : string,
  }
}

export const groupRecordSummariesByLetter = (recordTypes: RecordSummary[]) : GroupedRecordSummaries => {
  // Sort alphabetically by name
  const sorted = [...recordTypes].sort((a, b) => a.name.localeCompare(b.name));

  // Group by first letter
  const grouped = sorted.reduce((acc, recordType) => {
    const firstLetter = recordType.name.charAt(0).toUpperCase();

    if (!acc[firstLetter]) acc[firstLetter] = [];

    acc[firstLetter].push(recordType);
    return acc;
  }, {} as GroupedRecordSummaries);

  return grouped;
};

export const getRecordFieldErrorMessage = (input: string, value: any): string => {
  let errorMessage = '';
  switch(input) {
  case 'name': {
    if (value.trim().length === 0) {
      errorMessage = 'Field name is required.';
    }
  }
    break;
  default:
    errorMessage = ''; 
    break;
  }
  return errorMessage;
};

export const areAllRecordFieldsValid = (fields: RecordField[]): boolean => {
  return fields.every((field) => {
    const keys = Object.keys(field) as string[];
    return keys.every((key) => !getRecordFieldErrorMessage(key, (field as any)[key]));
  });
};