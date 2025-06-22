import { SidebarLayout } from '@/components/app-layout/sidebar-layout'
import RecordsSidebar from '@/components/records/records-sidebar'

const RecordsPage = () => {
  return (
    <SidebarLayout sidebar={<RecordsSidebar />}>
        <div className="p-5">
            <p className="text-sm">
                This is the records page where you can view and manage your records.
            </p>
        </div>
    </SidebarLayout>
  )
}

export default RecordsPage