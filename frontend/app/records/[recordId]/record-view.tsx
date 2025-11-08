'use client';

import { Card } from '@/components/ui/card';
import { useRecordStore } from '@/lib/store/recordStore';
import { RecordDataTable } from './record-data-table';

type RecordViewProps = {
  recordId: string;
}

export const RecordView = ({recordId} : RecordViewProps) => {
  const record = useRecordStore((state) => state.getRecord(recordId));

  const handleItemCreated = () => {
    // Store updates automatically after server response, no need to refetch
    // This callback can be used for other side effects if needed
  };

  return (record &&
    <div className="flex flex-wrap pb-1 lg:p-3 lg:gap-2">
      {/* Data Table */}
      <div className="w-full min-w-[49%] max-w-screen max-h-full p-1 lg:flex-1">
        <RecordDataTable
          record={record}
          onItemCreated={handleItemCreated}
        />
      </div>
      {/* Analytics */}
      <div className="w-full min-w-[49%] max-w-screen max-h-full p-1 lg:flex-1">
        <div className="p-3 border-2 rounded-sm">
          <h3 className="mb-2">Analytics Placeholder</h3>
          <div className="grid grid-cols-2 gap-2">
            <Card className="p-4 rounded-sm">
              <div className="flex flex-col gap-1">
                <div className="text-sm text-gray-500">Average spending per entry</div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-semibold">$55.20</span>
                </div>
              </div>
            </Card>
            <Card className="p-4 rounded-sm">
              <div className="flex flex-col gap-1">
                <div className="text-sm text-gray-500">Average spending per month</div>
                <div className="flex justify-between items-center flex-wrap gap-1">
                  <span className="text-2xl font-semibold">$1,230.00</span>
                  <span className="text-xs font-semibold border-2 border-foreground rounded-md bg-accent px-2 py-0">+ 12.5%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
