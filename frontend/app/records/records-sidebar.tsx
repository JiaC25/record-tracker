'use client';

import { CreateRecordButton } from '@/components/records/create-record-button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/lib/store/authStore';
import { useRecordStore } from '@/lib/store/recordStore';
import { LayoutDashboard } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { ROUTES } from '../../lib/routes.config';

const RecordsSidebar = () => {
  const params = useParams<{ recordId: string }>();
  const activeRecordId = params.recordId;
  const router = useRouter();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const authIsHydrated = useAuthStore((state) => state.isHydrated);

  const groupedRecordSummaries = useRecordStore((state) => state.groupedRecordSummaries);
  const isLoading = useRecordStore((state) => state.isLoadingRecordSummaries);
  const isHydrated = useRecordStore((state) => state.isHydrated);

  const { loadRecordSummaries } = useRecordStore();

  useEffect(() => {
    if (!authIsHydrated || !isHydrated || !isLoggedIn ) return;
    loadRecordSummaries();
  }, [isLoggedIn, authIsHydrated, isHydrated, loadRecordSummaries, router]);

  const handleSelectRecord = (recordId: string) => {
    router.push(ROUTES.RECORD_VIEW(recordId));
  };

  // Show loading skeleton
  if (!authIsHydrated || !isHydrated || isLoading) {
    return (
      <Sidebar className="top-[var(--header-height)]" variant="inset">
        <SidebarHeader>
          <div className="flex items-center justify-between p-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-6 w-6 rounded" />
          </div>
        </SidebarHeader>
        <SidebarContent className="pb-16">
          {/* Simulate 3 groups */}
          {Array.from({ length: 3 }).map((_, groupIndex) => (
            <SidebarGroup key={groupIndex}>
              <SidebarGroupLabel>
                <Skeleton className="h-4 w-4" />
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Simulate 2-4 items per group */}
                  {Array.from({ length: 2 }).map((_, itemIndex) => (
                    <SidebarMenuItem key={itemIndex}>
                      <div className="flex items-center gap-2 p-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  const sortedLetters = Object.keys(groupedRecordSummaries).sort();
  return (
    <Sidebar className="top-[var(--header-height)]" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <div className="px-1 my-3 md:mt-0">
            <CreateRecordButton />
          </div>
          <SidebarMenuItem>
            <div className="flex items-center justify-between">
              Records
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pb-16">
        {sortedLetters.map((letter) => (
          <SidebarGroup key={letter}>
            <SidebarGroupLabel>{letter}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {groupedRecordSummaries[letter].map((record) => (
                  <SidebarMenuItem key={record.id}>
                    <SidebarMenuButton 
                      asChild
                      isActive={record.id === activeRecordId}
                      onClick={() => handleSelectRecord(record.id)}
                    >
                      <div className="cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" />
                        <span title={record.name}>{record.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default RecordsSidebar;