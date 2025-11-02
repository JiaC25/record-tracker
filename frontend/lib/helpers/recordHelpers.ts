import { CreateRecordItemsRequest, GroupedRecordSummaries, RecordField, RecordItem, RecordItemInput, RecordSummary, RecordValueInput } from '@/lib/types/records';

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

// Helper to convert RecordItem(s) to CreateRecordItemsRequest
export const toCreateRecordItemsRequest = (
  items: RecordItem | RecordItem[],
  fields: RecordField[]
) : CreateRecordItemsRequest => {
  const itemsArray = Array.isArray(items) ? items : [items];

  const recordItemInputs: RecordItemInput[] = itemsArray.map(item => {
    const values: RecordValueInput[] = fields
      .filter(field => item[field.id])
      .map(field => ({
        recordFieldId: field.id,
        value: item[field.id] || ''
      }));

    return { values };
  });

  return { items: recordItemInputs };
};

// Helper to convert a single RecordItem to RecordItemInput for update
export const toRecordItemInput = (
  item: RecordItem,
  fields: RecordField[]
) : RecordItemInput => {
  const values: RecordValueInput[] = fields
    .filter(field => item[field.id])
    .map(field => ({
      recordFieldId: field.id,
      value: item[field.id] || ''
    }));

  return { values };
};