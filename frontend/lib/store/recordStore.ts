import { groupRecordSummariesByLetter } from '@/lib/helpers/recordHelpers';
import { GroupedRecordSummaries, Record, RecordSummary } from '@/lib/types/records';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { recordApi } from '../api/recordApi';

type RecordStore = {
    // State
    recordSummaries: RecordSummary[]
    groupedRecordSummaries: GroupedRecordSummaries
    selectedRecordId: string | null
    isLoadingRecordSummaries: boolean
    isHydrated: boolean
    selectedRecord: Record | null
    isLoadingItems: boolean
    
    // Getters
    getSelectedRecordSummary: () => RecordSummary | null

    // Actions
    loadRecordSummaries: () => Promise<void>
    setSelectedRecordId: (recordId: string) => void
    clearSelectedRecordId: () => void
    clearAll: () => void
    setHydrated: () => void
}

export const useRecordStore = create<RecordStore>()(
  persist(
    (set, get) => ({
      // States
      recordSummaries: [],
      groupedRecordSummaries: {},
      selectedRecordId: null,
      isLoadingRecordSummaries: false,
      isHydrated: false,
      selectedRecord: null,
      isLoadingItems: false,

      // Getters
      getSelectedRecordSummary: () => {
        const { recordSummaries, selectedRecordId } = get();
        if (!selectedRecordId) return null;
        return recordSummaries.find((record) => record.id === selectedRecordId) || null;
      },

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

          // Clear selectedRecordId if it no longer exist in the new fetched list
          const { selectedRecordId, recordSummaries } = get();
          if (selectedRecordId) {
            const selectedRecord = recordSummaries.find((record) => record.id === selectedRecordId) || null;
            if (!selectedRecord) {
              set({ selectedRecordId: null });
            }
          }

        } catch (error) {
          console.error('Failed to load record list', error);
        } finally {
          set({ isLoadingRecordSummaries: false });
        }
      },

      setSelectedRecordId: (recordId: string) => {
        set({
          selectedRecord: null,
          selectedRecordId: recordId,
          isLoadingItems: true,
        });

        recordApi.getRecord(recordId)
          .then(res => {
            set({
              selectedRecord: res,
              isLoadingItems: false,
            });
          }).catch(error => {
            console.error('Failed to load record items', error);
            set({
              selectedRecord: null,
              isLoadingItems: false,
            });
          });
      },
      clearSelectedRecordId: () => {
        set({
          selectedRecordId: null,
        });
      },

      clearAll: () => {
        set({
          recordSummaries: [],
          groupedRecordSummaries: {},
          selectedRecordId: null,
          isLoadingRecordSummaries: false,
          selectedRecord: null,
        });
      },

      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'record-type-store',
      partialize: (state) => ({
        selectedRecordId: state.selectedRecordId,
        selectedRecord: state.selectedRecord,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);