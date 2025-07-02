'use client'

import { SidebarLayout } from '@/components/app-layout/sidebar-layout';
import RecordsSidebar from '@/components/records/records-sidebar';
import { useRecordStore } from '@/lib/store/recordStore';

const RecordsPage = () => {
  const selectedRecord = useRecordStore((state) => state.getSelectedRecordSummary());
  const isLoadingRecordSummaries = useRecordStore((state) => state.isLoadingRecordSummaries);
  const isHydrated = useRecordStore((state) => state.isHydrated);

  const getPageTitle = () => {
    if (selectedRecord) {
      return selectedRecord.name;
    }
    return 'Records';
  };

  return (
    <SidebarLayout sidebar={<RecordsSidebar />} title={getPageTitle()} isLoading={(!isHydrated || isLoadingRecordSummaries)}>
      {/* Content area for selected record (edit/add/view all record items etc) */}
      <div className="p-5 text-sm">
        <div>{selectedRecord?.description || '' }</div>
        <br/>
        {
          selectedRecord &&
          <pre className="text-xs">{ JSON.stringify(selectedRecord, null, 2) }</pre>
        }
        {/* <RecordTypeForm/> for adding or editing record */}
        {/* <RecordItemForm/> for adding record item */}
        {/* <RecordView/> for rendering info of a record including record items */}
      </div>
    </SidebarLayout>
  )
}

export default RecordsPage