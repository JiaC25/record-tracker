'use client';

import { useRecordStore } from '@/lib/store/recordStore';
import { RecordDataTable } from './record-data-table';
import { AnalyticsPanel } from '@/components/analytics/analytics-panel';

type RecordViewProps = {
  recordId: string;
}

export const RecordView = ({ recordId }: RecordViewProps) => {
  const record = useRecordStore((state) => state.getRecord(recordId));

  const handleItemCreated = () => {
    // Store updates automatically after server response, no need to refetch
    // This callback can be used for other side effects if needed
  };

  return (record &&
    <div className="grid grid-cols-1 lg:grid-cols-2 p-2 gap-4 md:gap-2">
      {/* Data Table */}
      <div className="lg:sticky lg:top-2 lg:self-start">
        <RecordDataTable record={record} onItemCreated={handleItemCreated} />
      </div>
      {/* Analytics */}
      <div className="lg:max-h-full lg:overflow-y-auto scrollbar-styled">
        <AnalyticsPanel
          recordId={recordId}
          recordFields={record.recordFields}
          recordItems={record.recordItems}
        />
      </div>
    </div>
  );
};
