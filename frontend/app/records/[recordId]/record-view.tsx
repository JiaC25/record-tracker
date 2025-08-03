'use client';

import { Card } from '@/components/ui/card';
import { RecordEntity } from '@/lib/types/records';
import { RecordDataTable } from './record-data-table';

type RecordViewProps = {
  record: RecordEntity;
}

export const RecordView = ({ record }: RecordViewProps) => {
  return (
    <div className="flex flex-wrap pb-1">
      {/* Data Table */}
      <div className="w-full min-w-[49%] max-w-screen max-h-full p-1 lg:flex-1">
        <RecordDataTable record={record}></RecordDataTable>
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
