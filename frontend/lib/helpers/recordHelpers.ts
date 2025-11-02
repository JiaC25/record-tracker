import { GroupedRecordSummaries, RecordField, RecordItem, RecordItemInput, RecordSummary, RecordValueInput } from '@/lib/types/records';

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

// Helper to convert RecordItem(s) to RecordItemInput(s)
export const toRecordItemInput = (
  items: RecordItem | RecordItem[],
  fields: RecordField[]
) : RecordItemInput | RecordItemInput[] => {
  const itemsArray = Array.isArray(items) ? items : [items];

  const result = itemsArray.map(item => {
    const values: RecordValueInput[] = fields
      .filter(field => item[field.id])
      .map(field => ({
        recordFieldId: field.id,
        value: item[field.id] || ''
      }));

    return { values };
  });

  // Return single item if input was single, array if input was array
  return Array.isArray(items) ? result : result[0];
};