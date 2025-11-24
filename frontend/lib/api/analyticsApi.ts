import { Analytic, CreateAnalyticRequest, UpdateAnalyticRequest, UpdateAnalyticsOrderRequest } from '@/lib/types/analytics';
import { apiClient } from './apiClient';

export const analyticsApi = {
  getAnalytics: (recordId: string): Promise<Analytic[]> =>
    apiClient.get<Analytic[]>(`records/${recordId}/analytics`),

  createAnalytic: (recordId: string, requestBody: CreateAnalyticRequest): Promise<Analytic> =>
    apiClient.post<Analytic>(`records/${recordId}/analytics`, requestBody),

  updateAnalytic: (recordId: string, analyticId: string, requestBody: UpdateAnalyticRequest): Promise<Analytic> =>
    apiClient.put<Analytic>(`records/${recordId}/analytics/${analyticId}`, requestBody),

  deleteAnalytic: (recordId: string, analyticId: string): Promise<void> =>
    apiClient.delete<void>(`records/${recordId}/analytics/${analyticId}`),

  updateAnalyticsOrder: (recordId: string, requestBody: UpdateAnalyticsOrderRequest): Promise<void> =>
    apiClient.put<void>(`records/${recordId}/analytics/order`, requestBody),
};

