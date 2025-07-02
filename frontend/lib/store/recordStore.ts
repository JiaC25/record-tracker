import { getRecordSummaries } from '@/lib/api/recordApi'
import { groupRecordSummariesByLetter } from '@/lib/helpers/recordHelpers'
import { GroupedRecordSummaries, RecordSummary } from '@/lib/types/records'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type RecordStore = {
    // State
    recordSummaries: RecordSummary[]
    groupedRecordSummaries: GroupedRecordSummaries
    selectedRecordId: string | null
    isLoadingRecordSummaries: boolean
    isHydrated: boolean
    
    // Getters
    getSelectedRecordSummary: () => RecordSummary | null

    // Actions
    loadRecordSummaries: () => Promise<void>
    setSelectedRecordId: (recordId: string) => void
    clearSelectedRecordId: () => void
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

            // Getters
            getSelectedRecordSummary: () => {
                const { recordSummaries, selectedRecordId } = get();
                if (!selectedRecordId) return null;
                return recordSummaries.find((record) => record.id === selectedRecordId) || null
            },

            // Actions
            loadRecordSummaries: async () => {
                set({ isLoadingRecordSummaries: true });

                try {
                    const data = await getRecordSummaries();
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
                    selectedRecordId: recordId,
                })
            },
            clearSelectedRecordId: () => {
                set({
                    selectedRecordId: null,
                })
            },

            setHydrated: () => {
                set({ isHydrated: true })
            },
        }),
        {
            name: 'record-type-store',
            partialize: (state) => ({
                selectedRecordId: state.selectedRecordId,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHydrated()
            },
        }
    )
)