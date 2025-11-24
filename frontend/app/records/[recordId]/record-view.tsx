'use client';

import { useRecordStore } from '@/lib/store/recordStore';
import { RecordDataTable } from './record-data-table';
import { AnalyticsPanel } from '@/components/analytics/analytics-panel';
import { LayoutType } from '@/components/records/record-layout-config-popover';
import { cn } from '@/lib/utils';

type RecordViewProps = {
  recordId: string;
  layout: LayoutType;
}

export const RecordView = ({ recordId, layout }: RecordViewProps) => {
  const record = useRecordStore((state) => state.getRecord(recordId));

  const handleItemCreated = () => {
    // Store updates automatically after server response, no need to refetch
    // This callback can be used for other side effects if needed
  };

  const isLeftRight = layout === 'left-right';

  return (record &&
    <div
      className={cn(
        'grid p-2 gap-4 md:gap-2',
        isLeftRight
          ? 'grid-cols-1 lg:grid-cols-2'
          : 'grid-cols-1 lg:grid-rows-[auto_auto]'
      )}
    >
      {/* Data Table */}
      <div
        className={cn(
          isLeftRight
            ? 'lg:sticky lg:top-2 lg:self-start'
            : 'lg:row-start-1'
        )}
      >
        <RecordDataTable record={record} onItemCreated={handleItemCreated} />
      </div>
      {/* Analytics */}
      <div
        className={cn(
          isLeftRight
            ? 'lg:max-h-full lg:overflow-y-auto scrollbar-styled'
            : 'lg:row-start-2'
        )}
      >
        <AnalyticsPanel
          recordId={recordId}
          recordFields={record.recordFields}
          recordItems={record.recordItems}
        />
      </div>
    </div>
  );
};
