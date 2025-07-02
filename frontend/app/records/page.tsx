'use client'

import { SidebarLayout } from '@/components/app-layout/sidebar-layout';
import RecordsSidebar from '@/components/records/records-sidebar';
import { useRecordStore } from '@/lib/store/recordStore';

const RecordsPage = () => {
  const selectedRecord = useRecordStore((state) => state.getSelectedRecordSummary());

  return (
    <SidebarLayout sidebar={<RecordsSidebar />} title={selectedRecord?.name || 'Select a Record'}>

      {/* Content area for selected record (edit/add/view all record items etc) */}
      <div className="p-5 text-sm">
        <p>{selectedRecord?.description}</p>
        <br/>
        <pre className="text-xs">{ JSON.stringify(selectedRecord, null, 2) }</pre>
        {/* <RecordTypeForm/> for adding or editing record */}
        {/* <RecordItemForm/> for adding record item */}
        {/* <RecordView/> for rendering info of a record including record items */}
      </div>
    </SidebarLayout>
  )
}

export default RecordsPage