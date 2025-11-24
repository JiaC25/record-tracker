'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useAnalyticsStore } from '@/lib/store/analyticsStore';
import { RecordField } from '@/lib/types/records';
import { useEffect } from 'react';
import { AnalyticCard } from './analytic-card';
import { CreateAnalyticButton } from './create-analytic-button';

// Register analytic types
import './types/aggregate-value';
import './types/bar-chart';
import './types/line-chart';

type AnalyticsPanelProps = {
    recordId: string
    recordFields: RecordField[]
    recordItems: Array<Record<string, string>>
}

export const AnalyticsPanel = ({ 
  recordId, 
  recordFields, 
  recordItems 
}: AnalyticsPanelProps) => {
  const { getAnalytics, fetchAnalytics } = useAnalyticsStore();
  const analytics = getAnalytics(recordId);
  const isLoading = useAnalyticsStore(state => state.isLoadingAnalytics[recordId]);
  const hasAttemptedFetch = useAnalyticsStore(state => state.hasAttemptedFetch[recordId]);

  useEffect(() => {
    // Only fetch if we haven't attempted yet and we're not currently loading
    if (!hasAttemptedFetch && !isLoading) {
      fetchAnalytics(recordId);
    }
  }, [recordId, hasAttemptedFetch, isLoading, fetchAnalytics]);

  const handleAnalyticUpdated = () => {
    fetchAnalytics(recordId);
  };

  const handleAnalyticDeleted = () => {
    fetchAnalytics(recordId);
  };

  if (isLoading) {
    return (
      <div className="p-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Analytics</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Analytics</h3>
        <CreateAnalyticButton
          recordId={recordId}
          recordFields={recordFields}
          onAnalyticCreated={handleAnalyticUpdated}
        />
      </div>
      {analytics.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border rounded-sm">
          <p>No analytics yet. Create your first analytic to visualize your data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {analytics.map((analytic) => (
            <AnalyticCard
              key={analytic.id}
              analytic={analytic}
              recordFields={recordFields}
              recordItems={recordItems}
              onAnalyticUpdated={handleAnalyticUpdated}
              onAnalyticDeleted={handleAnalyticDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

