import '@testing-library/jest-dom';
import { groupRecordSummariesByLetter } from './recordHelpers';
import { RecordSummary } from '@/lib/types/records';

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

    it('should group non-alphabetic names under #', () => {
      const records = [
        { name: 'Alice', id: '1' },
        { name: '$$$', id: '2' },
        { name: '123 Records', id: '3' },
        { name: '@test', id: '4' },
      ] as RecordSummary[];

      const grouped = groupRecordSummariesByLetter(records);
      
      expect(Object.keys(grouped)).toStrictEqual(['#', 'A']);
      expect(grouped['A']).toEqual([{ name: 'Alice', id: '1' }]);
      expect(grouped['#']).toHaveLength(3);
      expect(grouped['#'][0].name).toEqual('$$$');
      expect(grouped['#'][1].name).toEqual('123 Records');
      expect(grouped['#'][2].name).toEqual('@test');
    });
  });
});