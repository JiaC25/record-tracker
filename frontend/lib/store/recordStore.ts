import { groupRecordSummariesByLetter, toRecordItemInput } from '@/lib/helpers/recordHelpers';
import { GroupedRecordSummaries, RecordEntity, RecordSummary } from '@/lib/types/records';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { recordApi } from '../api/recordApi';

type RecordStore = {
    // State
    recordSummaries: RecordSummary[]
    groupedRecordSummaries: GroupedRecordSummaries
    isLoadingRecordSummaries: boolean

    records: Record<string, RecordEntity>
    isLoadingRecord: boolean

    isHydrated: boolean
    
    // Getters
    getRecordSummary: (id: string) => RecordSummary | undefined
    getRecord: (id: string) => RecordEntity | undefined

    // Actions
    loadRecordSummaries: () => Promise<void>
    fetchRecord: (recordId: string) => Promise<RecordEntity | undefined>
    deleteRecord: (recordId: string) => Promise<void>
    deleteRecordItem: (recordId: string, itemId: string) => Promise<void>
    updateRecordItem: (recordId: string, itemId: string, updatedItem: RecordEntity['recordItems'][number]) => Promise<void>
    clearAll: () => void
    setHydrated: () => void
}

export const useRecordStore = create<RecordStore>()(
  persist(
    (set, get) => ({
      // States
      recordSummaries: [],
      groupedRecordSummaries: {},
      isLoadingRecordSummaries: false,
      isLoadingRecord: false,

      records: {},
      
      isHydrated: false,

      // Getters
      getRecordSummary: (id: string) => get().recordSummaries.find(r => r.id === id),
      getRecord: (id: string) => get().records[id],

      // Actions
      loadRecordSummaries: async () => {
        set({ isLoadingRecordSummaries: true });

        try {
          const data = await recordApi.getRecordSummaries();
          const grouped = groupRecordSummariesByLetter(data);

          set({
            recordSummaries: data,
            groupedRecordSummaries: grouped,
          });
        } catch (error) {
          console.error('Failed to load record list', error);
        } finally {
          set({ isLoadingRecordSummaries: false });
        }
      },

      fetchRecord: async (recordId: string) => {
        if (get().isLoadingRecord) {
          return;
        }

        set({ isLoadingRecord: true });
        try {
          const record = await recordApi.getRecord(recordId);
          set((state) => ({
            records: { ...state.records, [recordId]: record },
          }));
          return record;
        } catch (error) {
          console.error('Failed to fetch record', error);
          return undefined;
        } finally {
          set({ isLoadingRecord: false });
        }
      },

      deleteRecord: async (recordId: string) => {
        try {
          await recordApi.deleteRecord(recordId);
          // Remove record from local state
          set((state) => {
            const { [recordId]: deleted, ...remainingRecords } = state.records;
            const updatedSummaries = state.recordSummaries.filter(r => r.id !== recordId);
            const updatedGrouped = groupRecordSummariesByLetter(updatedSummaries);
            return {
              records: remainingRecords,
              recordSummaries: updatedSummaries,
              groupedRecordSummaries: updatedGrouped,
            };
          });
        } catch (error) {
          console.error('Failed to delete record', error);
          throw error;
        }
      },

      deleteRecordItem: async (recordId: string, itemId: string) => {
        try {
          await recordApi.deleteRecordItem(recordId, itemId);
          // Remove item from the record's recordItems array
          set((state) => {
            const record = state.records[recordId];
            if (!record) return state;

            const updatedRecord = {
              ...record,
              recordItems: record.recordItems.filter(item => item.id !== itemId),
            };

            return {
              records: {
                ...state.records,
                [recordId]: updatedRecord,
              },
            };
          });
        } catch (error) {
          console.error('Failed to delete record item', error);
          throw error;
        }
      },

      updateRecordItem: async (recordId: string, itemId: string, updatedItem: RecordEntity['recordItems'][number]) => {
        try {
          const record = get().records[recordId];
          if (!record) throw new Error('Record not found');

          // Convert to API format
          const requestBody = toRecordItemInput(updatedItem, record.recordFields);

          await recordApi.updateRecordItem(recordId, itemId, requestBody);

          // Update item in the record's recordItems array
          set((state) => {
            const recordState = state.records[recordId];
            if (!recordState) return state;

            const updatedRecord = {
              ...recordState,
              recordItems: recordState.recordItems.map(item => 
                item.id === itemId ? updatedItem : item
              ),
            };

            return {
              records: {
                ...state.records,
                [recordId]: updatedRecord,
              },
            };
          });
        } catch (error) {
          console.error('Failed to update record item', error);
          throw error;
        }
      },

      clearAll: () => {
        set({
          records: {},
          recordSummaries: [],
          groupedRecordSummaries: {},
          isLoadingRecordSummaries: false,
          isLoadingRecord: false,
        });
      },

      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'record-store',
      partialize: (state) => ({
        recordSummaries: state.recordSummaries,
        groupedRecordSummaries: state.groupedRecordSummaries,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);