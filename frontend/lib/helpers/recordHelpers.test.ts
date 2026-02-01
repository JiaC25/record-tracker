import { RecordSummary } from '../types/records';
import { groupRecordSummariesByLetter } from './recordHelpers';

describe('recordHelpers', () => {
    describe('groupRecordSummariesByLetter', () => {
        it('should return empty object for empty input', () => {
            const result = groupRecordSummariesByLetter([]);
            expect(result).toEqual({});
        });

        it('should group records by first letter of name', () => {
            const records: RecordSummary[] = [
                { id: '1', createdAt: '', name: 'Grocery', description: '', recordFields: [] },
                { id: '2', createdAt: '', name: 'Books', description: '', recordFields: [] },
                { id: '3', createdAt: '', name: 'Investment Record', description: '', recordFields: [] },
                { id: '4', createdAt: '', name: 'vehicle record', description: '', recordFields: [] },
                { id: '5', createdAt: '', name: 'important dates', description: '', recordFields: [] },
            ];

            const grouped = groupRecordSummariesByLetter(records);

            expect(Object.keys(grouped).sort()).toEqual(['B', 'G', 'I', 'V']);
            expect(grouped['B']).toHaveLength(1);
            expect(grouped['G']).toHaveLength(1);
            expect(grouped['I']).toHaveLength(2);
            expect(grouped['V']).toHaveLength(1);
            expect(grouped['#']).toBeUndefined();
            expect(grouped['B'][0].name).toEqual('Books');
            expect(grouped['G'][0].name).toEqual('Grocery');
        });

        it('should puts non-alphabetic records under # group', () => {
            const records: RecordSummary[] = [
                { id: '1', createdAt: '', name: '1', description: '', recordFields: [] },
                { id: '2', createdAt: '', name: '2', description: '', recordFields: [] },
                { id: '2', createdAt: '', name: 'a', description: '', recordFields: [] },
                { id: '3', createdAt: '', name: '#', description: '', recordFields: [] },
                { id: '4', createdAt: '', name: '!', description: '', recordFields: [] },
                { id: '5', createdAt: '', name: '', description: '', recordFields: [] },
            ];

            const grouped = groupRecordSummariesByLetter(records);

            expect(grouped['#']).toHaveLength(5);
            expect(grouped['#'].map(r => r.name)).toContain('1');
            expect(grouped['#'].map(r => r.name)).toContain('#');
            expect(grouped['#'].map(r => r.name)).toContain('!');
            expect(grouped['#'].map(r => r.name)).toContain('');
        });

        it('should sort alphabetically and case insensitively within group', () => {
            const records: RecordSummary[] = [
                { id: '1', createdAt: '', name: 'Ac', description: '', recordFields: [] },
                { id: '1', createdAt: '', name: 'Ab', description: '', recordFields: [] },
                { id: '1', createdAt: '', name: 'Aab', description: '', recordFields: [] },
                { id: '1', createdAt: '', name: 'aaa', description: '', recordFields: [] },
            ];

            const grouped = groupRecordSummariesByLetter(records);

            expect(grouped['A']).toHaveLength(4);
            expect(grouped['A'].map(r => r.name)).toEqual(['aaa', 'Aab', 'Ab', 'Ac']);
        });

    });
});