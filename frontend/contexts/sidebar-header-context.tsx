'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { Skeleton } from '../components/ui/skeleton';

interface SidebarHeaderContextType {
    header: ReactNode
    setHeader: (header: ReactNode) => void;
}

const SidebarHeaderContext = createContext<SidebarHeaderContextType | undefined>(undefined);

export const SidebarHeaderProvider = ({ children }: { children: ReactNode }) => {
  const [header, setHeader] = useState<ReactNode>(<Skeleton className="h-4 w-24"/>);

  return (
    <SidebarHeaderContext.Provider value={{ header, setHeader }}>
      {children}
    </SidebarHeaderContext.Provider>
  );
};

export const useSidebarHeader = () => {
  const context = useContext(SidebarHeaderContext);
  if (!context) {
    throw new Error('useSidebarHeader must be used within a SidebarHeaderProvider');
  }
  return context;
};