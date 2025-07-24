import { GroupedRecordSummaries, RecordSummary } from '@/lib/types/records';

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