import { RecordEntity, RecordField, RecordItem } from '@/lib/types/records';

/**
 * Exports record items to CSV format
 * Format: Id | [Field1 Name] | [Field2 Name] | ...
 * Uses FieldName in headers for user-friendliness
 */
export const exportRecordItemsToCSV = (record: RecordEntity): string => {
  const { recordItems, recordFields } = record;
  
  // Sort fields by order to maintain consistent column order
  const sortedFields = [...recordFields].sort((a, b) => a.order - b.order);
  
  // Build header row: Id, then field names
  const headers = ['Id', ...sortedFields.map(field => field.name)];
  
  // Build data rows
  const rows = recordItems.map(item => {
    const row = [item.id, ...sortedFields.map(field => {
      const value = item[field.id] || '';
      // Escape CSV values (handle quotes and commas)
      return escapeCSVValue(value);
    })];
    return row;
  });
  
  // Combine headers and rows
  const csvRows = [headers, ...rows];
  
  // Convert to CSV string
  return csvRows.map(row => row.join(',')).join('\n');
};

/**
 * Escapes a value for CSV format
 */
const escapeCSVValue = (value: string): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
};

/**
 * Parses CSV string into rows
 */
const parseCSV = (csvText: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = '';
  let insideQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote
        currentValue += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of value
      currentRow.push(currentValue);
      currentValue = '';
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      // End of row
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip \n after \r
      }
      currentRow.push(currentValue);
      if (currentRow.length > 0 && currentRow.some(cell => cell.trim() !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // Add last value and row if any
  if (currentValue || currentRow.length > 0) {
    currentRow.push(currentValue);
    if (currentRow.length > 0 && currentRow.some(cell => cell.trim() !== '')) {
      rows.push(currentRow);
    }
  }
  
  return rows;
};

/**
 * Imports record items from CSV format
 * Validates that field names match the record's fields
 * Returns parsed items or throws error if validation fails
 */
export const importRecordItemsFromCSV = (
  csvText: string,
  record: RecordEntity
): RecordItem[] => {
  const { recordFields } = record;
  
  // Parse CSV
  const rows = parseCSV(csvText.trim());
  
  if (rows.length === 0) {
    throw new Error('CSV file is empty');
  }
  
  // First row should be headers
  const headers = rows[0];
  
  if (headers.length < 2) {
    throw new Error('CSV must have at least Id column and one field column');
  }
  
  // Validate Id column
  if (headers[0].trim() !== 'Id') {
    throw new Error('CSV must start with "Id" column');
  }
  
  // Get field names from headers (skip Id column)
  const csvFieldNames = headers.slice(1).map(name => name.trim());
  
  // Sort record fields by order to match expected order
  const sortedFields = [...recordFields].sort((a, b) => a.order - b.order);
  const recordFieldNames = sortedFields.map(field => field.name);
  
  // Validate field names match
  if (csvFieldNames.length !== recordFieldNames.length) {
    throw new Error(
      `Field count mismatch. Expected ${recordFieldNames.length} fields, found ${csvFieldNames.length}`
    );
  }
  
  // Check each field name matches
  const mismatchedFields: string[] = [];
  for (let i = 0; i < csvFieldNames.length; i++) {
    if (csvFieldNames[i] !== recordFieldNames[i]) {
      mismatchedFields.push(
        `Column ${i + 2}: Expected "${recordFieldNames[i]}", found "${csvFieldNames[i]}"`
      );
    }
  }
  
  if (mismatchedFields.length > 0) {
    throw new Error(
      `Field names do not match:\n${mismatchedFields.join('\n')}`
    );
  }
  
  // Create a map of field name to field ID for quick lookup
  const fieldNameToId = new Map<string, string>();
  sortedFields.forEach(field => {
    fieldNameToId.set(field.name, field.id);
  });
  
  // Parse data rows
  const items: RecordItem[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    
    if (row.length !== headers.length) {
      throw new Error(`Row ${i + 1} has ${row.length} columns, expected ${headers.length}`);
    }
    
    const itemId = row[0].trim();
    if (!itemId) {
      throw new Error(`Row ${i + 1} has empty Id`);
    }
    
    // Build record item
    const item: RecordItem = {
      id: itemId,
      createdAt: new Date().toISOString(), // Will be set by backend, but needed for type
    };
    
    // Add field values
    for (let j = 1; j < row.length; j++) {
      const fieldName = csvFieldNames[j - 1];
      const fieldId = fieldNameToId.get(fieldName);
      
      if (!fieldId) {
        throw new Error(`Field "${fieldName}" not found in record`);
      }
      
      item[fieldId] = row[j].trim();
    }
    
    items.push(item);
  }
  
  return items;
};

/**
 * Downloads CSV content as a file
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

