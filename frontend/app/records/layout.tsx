import RecordsSidebar from '@/app/records/records-sidebar';
import { SidebarLayout } from '@/components/app-layout/sidebar-layout';

const RecordsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarLayout
      sidebar={<RecordsSidebar />}
      header={<span className="text-sm">Record name</span>}
    >
      {children}
    </SidebarLayout>
  );
};

export default RecordsLayout;