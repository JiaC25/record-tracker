import { AggregateFunction, GroupByPeriod } from '@/lib/types/analytics';
import { RecordField, RecordFieldType } from '@/lib/types/records';

/** Field Type Constants */
export const FIELD_TYPES = {
  TEXT: 'Text' as RecordFieldType,
  NUMBER: 'Number' as RecordFieldType,
  DATE: 'Date' as RecordFieldType,
} as const;

export const X_AXIS_FIELD_TYPES: RecordFieldType[] = [FIELD_TYPES.DATE, FIELD_TYPES.TEXT, FIELD_TYPES.NUMBER];
export const Y_AXIS_FIELD_TYPES: RecordFieldType[] = [FIELD_TYPES.NUMBER];

/** Field Filtering Utilities */
export const filterFieldsByType = (fields: RecordField[], fieldType: RecordFieldType): RecordField[] => {
  return fields.filter(f => f.fieldType === fieldType);
};

export const filterFieldsByTypes = (fields: RecordField[], fieldTypes: RecordFieldType[]): RecordField[] => {
  return fields.filter(f => fieldTypes.includes(f.fieldType));
};

export const isFieldType = (field: RecordField | undefined, fieldType: RecordFieldType): boolean => {
  return field?.fieldType === fieldType;
};

/** Aggregation Types */
export type AggregationType = AggregateFunction | 'count';

/** Aggregation Utilities */
export const calculateAggregate = (values: number[], func: AggregationType): number => {
  if (values.length === 0) return 0;
    
  switch (func) {
  case 'count':
    return values.length;
  case 'sum':
    return values.reduce((acc, val) => acc + val, 0);
  case 'average':
    return values.reduce((acc, val) => acc + val, 0) / values.length;
  case 'max':
    return Math.max(...values);
  case 'min':
    return Math.min(...values);
  default:
    return 0;
  }
};

export const getAggregationLabel = (func: AggregationType, fieldName?: string): string => {
  const baseLabel = (() => {
    switch (func) {
    case 'count': return 'Count';
    case 'sum': return 'Sum';
    case 'average': return 'Average';
    case 'max': return 'Maximum';
    case 'min': return 'Minimum';
    default: return 'Value';
    }
  })();
    
  return fieldName ? `${baseLabel} of ${fieldName}` : baseLabel;
};

/** Date Grouping Utilities */
export const getDateGroupKey = (date: Date, period: GroupByPeriod): string => {
  switch (period) {
  case 'day':
    return date.toISOString().split('T')[0];
  case 'week': {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    return weekStart.toISOString().split('T')[0];
  }
  case 'month':
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  case 'year':
    return String(date.getFullYear());
  default:
    return date.toISOString().split('T')[0];
  }
};

export const formatDateGroupKey = (key: string, period: GroupByPeriod): string => {
  if (period === 'month' && key.match(/^\d{4}-\d{2}$/)) {
    const [year, month] = key.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } else if (period === 'year') {
    return key;
  } else if (period === 'day' || period === 'week') {
    const date = new Date(key);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }
    
  // Fallback
  const date = new Date(key);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString();
  }
  return key;
};

/** Config Parsing Utilities */
export const parseConfig = <T>(configString: string, defaultValue: T): T => {
  try {
    return JSON.parse(configString);
  } catch {
    return defaultValue;
  }
};

/** Data Validation Utilities */
export const isValidNumericValue = (value: string | undefined): boolean => {
  return value !== undefined && value.trim() !== '' && !isNaN(parseFloat(value));
};

export const parseNumericValue = (value: string | undefined): number | null => {
  if (!isValidNumericValue(value)) return null;
  return parseFloat(value!);
};

/** Sorting Utilities */
export const sortByFieldType = <T extends { _sortKey: string }>(
  data: T[],
  fieldType: RecordFieldType
): T[] => {
  return [...data].sort((a, b) => {
    if (fieldType === FIELD_TYPES.DATE) {
      return new Date(a._sortKey).getTime() - new Date(b._sortKey).getTime();
    } else if (fieldType === FIELD_TYPES.NUMBER) {
      return parseFloat(a._sortKey) - parseFloat(b._sortKey);
    } else {
      return a._sortKey.localeCompare(b._sortKey);
    }
  });
};

/** Format Utilities */
export const formatNumber = (num: number, options?: { minFractionDigits?: number; maxFractionDigits?: number }): string => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: options?.minFractionDigits ?? 2,
    maximumFractionDigits: options?.maxFractionDigits ?? 2,
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString();
  }
  return dateString;
};

