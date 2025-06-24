import { SidebarLayout } from '@/components/app-layout/sidebar-layout'
import RecordsSidebar from '@/components/records/records-sidebar'

const RecordsPage = () => {
  return (
    <SidebarLayout sidebar={<RecordsSidebar />}>

        {/* Content area for selected record (edit/add/view all record items etc) */}
        <div className="p-5">
            <div className="text-sm">
                <h1>Record content area.</h1>
                {/* <RecordTypeForm/> for adding or editing record */}
                {/* <RecordItemForm/> for adding record item */}
                {/* <RecordView/> for rendering info of a record including record items */}
            </div>
        </div>
    </SidebarLayout>
  )
}

export default RecordsPage