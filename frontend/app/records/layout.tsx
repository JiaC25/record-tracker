import RecordsSidebar from '@/app/records/records-sidebar';
import { SidebarLayout } from '@/components/app-layout/sidebar-layout';
import { SidebarHeaderProvider } from '../../contexts/sidebar-header-context';

const RecordsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarHeaderProvider>
      <SidebarLayout sidebar={<RecordsSidebar />}>
        {children}
      </SidebarLayout>
    </SidebarHeaderProvider>
  );
};

export default RecordsLayout;