import { groupRecordSummariesByLetter } from '@/lib/helpers/recordHelpers';
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

    isHydrated: boolean
    
    // Getters
    getRecordSummary: (id: string) => RecordSummary | undefined
    getRecord: (id: string) => RecordEntity | undefined

    // Actions
    loadRecordSummaries: () => Promise<void>
    fetchRecord: (recordId: string) => Promise<RecordEntity | undefined>
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

      records: {},
      
      isHydrated: false,

      // Getters
      getRecordSummary: (id: string) => get().recordSummaries.find(r => r.id === id),
      getRecord: (id: string) => get().records[id],

      // Actions
      loadRecordSummaries: async () => {
        if (get().isLoadingRecordSummaries) {
          return;
        }
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
        try {
          const record = await recordApi.getRecord(recordId);
          set((state) => ({
            records: { ...state.records, [recordId]: record },
          }));
          return record;
        } catch (error) {
          console.error('Failed to fetch record', error);
          return undefined;
        }
      },

      clearAll: () => {
        set({
          records: {},
          recordSummaries: [],
          groupedRecordSummaries: {},
          isLoadingRecordSummaries: false,
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