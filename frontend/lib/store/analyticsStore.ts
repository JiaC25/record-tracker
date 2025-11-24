import { Analytic, CreateAnalyticRequest, UpdateAnalyticRequest, UpdateAnalyticsOrderRequest } from '@/lib/types/analytics';
import { create } from 'zustand';
import { analyticsApi } from '../api/analyticsApi';

type AnalyticsStore = {
    // State: analytics by recordId
    analytics: Record<string, Analytic[]>
    isLoadingAnalytics: Record<string, boolean>
    hasAttemptedFetch: Record<string, boolean> // Track if we've attempted to fetch (to prevent infinite retries on error)

    // Getters
    getAnalytics: (recordId: string) => Analytic[]

    // Actions
    fetchAnalytics: (recordId: string) => Promise<Analytic[]>
    createAnalytic: (recordId: string, request: CreateAnalyticRequest) => Promise<Analytic>
    updateAnalytic: (recordId: string, analyticId: string, request: UpdateAnalyticRequest) => Promise<Analytic>
    deleteAnalytic: (recordId: string, analyticId: string) => Promise<void>
    updateAnalyticsOrder: (recordId: string, request: UpdateAnalyticsOrderRequest) => Promise<void>
    clearAnalytics: (recordId: string) => void
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
    // State
    analytics: {},
    isLoadingAnalytics: {},
    hasAttemptedFetch: {},

    // Getters
    getAnalytics: (recordId: string) => get().analytics[recordId] || [],

    // Actions
    fetchAnalytics: async (recordId: string) => {
        // Prevent duplicate requests
        if (get().isLoadingAnalytics[recordId]) {
            return get().analytics[recordId] || [];
        }

        set((state) => ({
            isLoadingAnalytics: { ...state.isLoadingAnalytics, [recordId]: true },
            hasAttemptedFetch: { ...state.hasAttemptedFetch, [recordId]: true },
        }));

        try {
            const data = await analyticsApi.getAnalytics(recordId);
            set((state) => ({
                analytics: { ...state.analytics, [recordId]: data },
                isLoadingAnalytics: { ...state.isLoadingAnalytics, [recordId]: false },
            }));
            return data;
        } catch (error) {
            console.error('Failed to fetch analytics', error);
            set((state) => ({
                isLoadingAnalytics: { ...state.isLoadingAnalytics, [recordId]: false },
            }));
            return [];
        }
    },

    createAnalytic: async (recordId: string, request: CreateAnalyticRequest) => {
        try {
            const analytic = await analyticsApi.createAnalytic(recordId, request);
            set((state) => {
                const existing = state.analytics[recordId] || [];
                return {
                    analytics: {
                        ...state.analytics,
                        [recordId]: [...existing, analytic].sort((a, b) => a.order - b.order),
                    },
                };
            });
            return analytic;
        } catch (error) {
            console.error('Failed to create analytic', error);
            throw error;
        }
    },

    updateAnalytic: async (recordId: string, analyticId: string, request: UpdateAnalyticRequest) => {
        try {
            const analytic = await analyticsApi.updateAnalytic(recordId, analyticId, request);
            set((state) => {
                const existing = state.analytics[recordId] || [];
                return {
                    analytics: {
                        ...state.analytics,
                        [recordId]: existing
                            .map(a => a.id === analyticId ? analytic : a)
                            .sort((a, b) => a.order - b.order),
                    },
                };
            });
            return analytic;
        } catch (error) {
            console.error('Failed to update analytic', error);
            throw error;
        }
    },

    deleteAnalytic: async (recordId: string, analyticId: string) => {
        try {
            await analyticsApi.deleteAnalytic(recordId, analyticId);
            set((state) => {
                const existing = state.analytics[recordId] || [];
                return {
                    analytics: {
                        ...state.analytics,
                        [recordId]: existing.filter(a => a.id !== analyticId),
                    },
                };
            });
        } catch (error) {
            console.error('Failed to delete analytic', error);
            throw error;
        }
    },

    updateAnalyticsOrder: async (recordId: string, request: UpdateAnalyticsOrderRequest) => {
        try {
            await analyticsApi.updateAnalyticsOrder(recordId, request);
            // Update local state with new orders
            set((state) => {
                const existing = state.analytics[recordId] || [];
                const orderMap = new Map(request.analytics.map(a => [a.analyticId, a.order]));
                return {
                    analytics: {
                        ...state.analytics,
                        [recordId]: existing
                            .map(a => {
                                const newOrder = orderMap.get(a.id);
                                return newOrder !== undefined ? { ...a, order: newOrder } : a;
                            })
                            .sort((a, b) => a.order - b.order),
                    },
                };
            });
        } catch (error) {
            console.error('Failed to update analytics order', error);
            throw error;
        }
    },

    clearAnalytics: (recordId: string) => {
        set((state) => {
            const { [recordId]: deleted, ...remaining } = state.analytics;
            return { analytics: remaining };
        });
    },
}));

