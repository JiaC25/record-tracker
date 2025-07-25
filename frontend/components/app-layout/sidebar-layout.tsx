// This component provides sidebar layout for specific pages
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import type React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

type SidebarLayoutProps = {
    children: React.ReactNode
    sidebar: React.ReactNode
    title?: string
    isLoading?: boolean
}

export function SidebarLayout({ children, sidebar, title, isLoading }: SidebarLayoutProps) {
  return (
    <SidebarProvider>
      {sidebar}
      <SidebarInset className="h-full peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4)-var(--header-height)]">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4"/>
          {
            isLoading ?
              <Skeleton className="h-4 w-40" /> :
              <span className='text-sm'>{title || 'Content'}</span>
          }
        </header>
        <ScrollArea className="h-[calc(100svh-theme(spacing.4)-(var(--header-height)*2))]">
          {children}
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
