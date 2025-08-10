import '@testing-library/jest-dom';
import { areAllRecordFieldsValid, getRecordFieldErrorMessage, groupRecordSummariesByLetter } from './recordHelpers';
import { RecordField, RecordSummary } from '@/lib/types/records';

describe('RecordHelper', () => {
  describe('groupRecordSummariesByLetter', () => {
    it('should group records by the first letter of their name', () => {
      const records = [
        { name: 'grocery', id: '1'},
        { name: 'Crypto', id: '3' },
        { name: 'stock', id: '2' },
        { name: 'credit card', id: '4' },
      ] as RecordSummary[];

      const grouped = groupRecordSummariesByLetter(records);

      expect(Object.keys(grouped)).toStrictEqual(['C', 'G', 'S']);
      expect(grouped['C']).toHaveLength(2);
      expect(grouped['G'][0].name).toEqual('grocery');
      expect(grouped['S'][0].name).toEqual('stock');
    });

    it('should handle empty input', () => {
      const grouped = groupRecordSummariesByLetter([]);
      expect(grouped).toEqual({});
    });

    it('should group records case-insensitively', () => {
      const records = [
        { name: 'alice', id: '1' },
        { name: 'ALbert', id: '2' },
        { name: 'bob', id: '3' },
        { name: 'BOB', id: '4' },
      ] as RecordSummary[];

      const grouped = groupRecordSummariesByLetter(records);

      expect(grouped['A']).toHaveLength(2);
      expect(grouped['B']).toHaveLength(2);
    });

    it('should handle symbolic name', () => {
      const records = [
        { name: 'Alice', id: 2 },
        { name: '$$$', id: 3 },
      ];

      const grouped = groupRecordSummariesByLetter(records as any);
      
      expect(Object.keys(grouped)).toStrictEqual(['$', 'A']);
      expect(grouped['A']).toEqual([{ name: 'Alice', id: 2 }]);
      expect(grouped['$']).toEqual([{ name: '$$$', id: 3 }]);
    });
  });

  describe('getRecordFieldErrorMessage', () => {
    it('returns error when name is empty string', () => {
      expect(getRecordFieldErrorMessage('name', '')).toBe('Field name is required.');
    });

    it('returns error when name is only spaces', () => {
      expect(getRecordFieldErrorMessage('name', '   ')).toBe('Field name is required.');
    });

    it('returns empty string when name is valid', () => {
      expect(getRecordFieldErrorMessage('name', 'Valid Name')).toBe('');
    });

    it('returns empty string for non-name keys', () => {
      expect(getRecordFieldErrorMessage('other', '')).toBe('');
      expect(getRecordFieldErrorMessage('id', null)).toBe('');
    });
  });

  describe('areAllRecordFieldsValid', () => {
    it('returns true for all valid fields', () => {
      const fields = [
        { name: 'First' },
        { name: 'Second' }
      ] as RecordField[];
      expect(areAllRecordFieldsValid(fields)).toBe(true);
    });

    it('returns false when at least one field has empty name', () => {
      const fields = [
        { name: 'Valid ' },
        { name: '' }
      ] as RecordField[];
      expect(areAllRecordFieldsValid(fields)).toBe(false);
    });

    it('returns false when at least one field has name of only spaces', () => {
      const fields = [
        { name: ' Valid' },
        { name: '   ' }
      ]  as RecordField[];;
      expect(areAllRecordFieldsValid(fields)).toBe(false);
    });

    it('returns true when fields are empty', () => {
      const fields = [] as RecordField[];
      expect(areAllRecordFieldsValid(fields)).toBe(true);
    });
  });
});