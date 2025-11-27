import { RecordEntity, RecordField, RecordItem, UpdateRecordRequest } from '@/lib/types/records';

/**
 * JSON export format that includes full record structure:
 * - Record metadata (name, description)
 * - All RecordFields with complete details (id, name, fieldType, isRequired, order)
 * - All RecordItems
 */
export type RecordExportJson = {
  name: string;
  description: string;
  recordFields: RecordField[];
  recordItems: Omit<RecordItem, 'createdAt'>[]; // Exclude createdAt as it will be set by backend
};

/**
 * Exports record to JSON format with full field and item details
 */
export const exportRecordToJSON = (record: RecordEntity): string => {
  const exportData: RecordExportJson = {
    name: record.name,
    description: record.description,
    recordFields: record.recordFields.map(field => ({
      id: field.id,
      name: field.name,
      fieldType: field.fieldType,
      isRequired: field.isRequired,
      order: field.order,
    })),
    recordItems: record.recordItems.map(item => {
      // Create a clean item object with id and field values
      const { id, createdAt, ...fieldValues } = item;
      return {
        id,
        ...fieldValues,
      };
    }),
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Downloads JSON content as a file
 */
export const downloadJSON = (jsonContent: string, filename: string): void => {
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
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

/**
 * Parses and validates JSON import file
 */
export const parseRecordImportJSON = (jsonText: string): RecordExportJson => {
  try {
    const data = JSON.parse(jsonText) as RecordExportJson;
    
    // Validate structure
    if (!data.name || typeof data.name !== 'string') {
      throw new Error('Invalid JSON: missing or invalid "name" field');
    }
    
    if (data.description !== undefined && typeof data.description !== 'string') {
      throw new Error('Invalid JSON: "description" must be a string');
    }
    
    if (!Array.isArray(data.recordFields)) {
      throw new Error('Invalid JSON: "recordFields" must be an array');
    }
    
    if (!Array.isArray(data.recordItems)) {
      throw new Error('Invalid JSON: "recordItems" must be an array');
    }
    
    // Validate each field
    data.recordFields.forEach((field, index) => {
      if (!field.name || typeof field.name !== 'string') {
        throw new Error(`Invalid JSON: recordFields[${index}] missing or invalid "name"`);
      }
      if (!field.fieldType || !['Text', 'Number', 'Date'].includes(field.fieldType)) {
        throw new Error(`Invalid JSON: recordFields[${index}] has invalid "fieldType"`);
      }
      if (typeof field.isRequired !== 'boolean') {
        throw new Error(`Invalid JSON: recordFields[${index}] missing or invalid "isRequired"`);
      }
      if (typeof field.order !== 'number') {
        throw new Error(`Invalid JSON: recordFields[${index}] missing or invalid "order"`);
      }
    });
    
    // Validate each item has id and field values
    data.recordItems.forEach((item, index) => {
      if (!item.id || typeof item.id !== 'string') {
        throw new Error(`Invalid JSON: recordItems[${index}] missing or invalid "id"`);
      }
    });
    
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format: ' + error.message);
    }
    throw error;
  }
};

/**
 * Checks if imported fields match the current record's fields
 * Fields match if they have the same name, fieldType, isRequired, and order
 */
export const doFieldsMatch = (
  importedFields: RecordField[],
  currentFields: RecordField[]
): boolean => {
  if (importedFields.length !== currentFields.length) {
    return false;
  }
  
  // Sort both by order for comparison
  const sortedImported = [...importedFields].sort((a, b) => a.order - b.order);
  const sortedCurrent = [...currentFields].sort((a, b) => a.order - b.order);
  
  for (let i = 0; i < sortedImported.length; i++) {
    const imported = sortedImported[i];
    const current = sortedCurrent[i];
    
    if (
      imported.name !== current.name ||
      imported.fieldType !== current.fieldType ||
      imported.isRequired !== current.isRequired ||
      imported.order !== current.order
    ) {
      return false;
    }
  }
  
  return true;
};

/**
 * Creates a field ID mapping from imported fields to current/updated fields
 * Maps by name and order
 */
export const createFieldIdMap = (
  importedFields: RecordField[],
  currentFields: RecordField[]
): Map<string, string> => {
  const fieldIdMap = new Map<string, string>();
  importedFields.forEach(importField => {
    const matchingField = currentFields.find(
      f => f.name === importField.name && f.order === importField.order
    );
    if (matchingField) {
      fieldIdMap.set(importField.id, matchingField.id);
    }
  });
  return fieldIdMap;
};

/**
 * Creates a field ID mapping from imported fields to current fields by name only
 * Used when matching fields for import into existing record
 */
export const createFieldIdMapByName = (
  importedFields: RecordField[],
  currentFields: RecordField[]
): Map<string, string> => {
  const fieldIdMap = new Map<string, string>();
  importedFields.forEach(importField => {
    const matchingField = currentFields.find(
      f => f.name === importField.name
    );
    if (matchingField) {
      fieldIdMap.set(importField.id, matchingField.id);
    }
  });
  return fieldIdMap;
};

/**
 * Validates that all imported fields have matching fields in the current record
 */
export const validateFieldMatches = (
  importedFields: RecordField[],
  fieldIdMap: Map<string, string>
): void => {
  const unmatchedFields = importedFields.filter(
    f => !fieldIdMap.has(f.id)
  );
  if (unmatchedFields.length > 0) {
    throw new Error(
      `Cannot import: The following fields from JSON do not match any fields in the record: ${unmatchedFields.map(f => f.name).join(', ')}`
    );
  }
};

/**
 * Maps imported items to use current field IDs
 */
export const mapItemsToCurrentFieldIds = (
  importedItems: Omit<RecordItem, 'createdAt'>[],
  fieldIdMap: Map<string, string>
): RecordItem[] => {
  return importedItems.map(item => {
    const newItem: RecordItem = {
      id: item.id,
      createdAt: new Date().toISOString(),
    };
    
    // Map field values to current field IDs
    Object.keys(item).forEach(key => {
      if (key !== 'id' && key !== 'createdAt') {
        const currentFieldId = fieldIdMap.get(key);
        if (currentFieldId) {
          newItem[currentFieldId] = item[key];
        }
      }
    });
    
    return newItem;
  });
};

/**
 * Creates an UpdateRecordRequest from imported JSON data
 */
export const createUpdateRecordRequest = (
  recordId: string,
  recordName: string,
  recordDescription: string,
  importedFields: RecordField[]
): UpdateRecordRequest => {
  return {
    recordId,
    name: recordName,
    description: recordDescription,
    recordFields: importedFields.map(field => ({
      name: field.name,
      fieldType: field.fieldType,
      isRequired: field.isRequired,
      order: field.order,
    })),
  };
};

