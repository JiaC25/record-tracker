'use client';

import { useSidebarHeader } from '@/contexts/sidebar-header-context';
import { useEffect } from 'react';

const RecordsPage = () => {
  const { setHeader } = useSidebarHeader();

  useEffect(() => {
    setHeader(<h6>Records</h6>);
  }, []);

  return (
    <div className="p-5 text-sm text-gray-500">
      Select a record from the sidebar
    </div>
  );
};

export default RecordsPage;