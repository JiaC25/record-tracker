'use client';

import { CreateNewRecordButton } from '@/components/records/create-record-button';
import { DeleteRecordDialog } from '@/components/records/delete-record-dialog';
import { EditRecordDialog } from '@/components/records/edit-record-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/lib/store/authStore';
import { useRecordStore } from '@/lib/store/recordStore';
import { LayoutDashboard, MoreVertical } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar } from '../../components/ui/sidebar';
import { ROUTES } from '../../lib/routes.config';

const RecordsSidebar = () => {
  const params = useParams<{ recordId: string }>();
  const currentRecordId = params.recordId;
  const router = useRouter();

  const { isMobile, setOpenMobile } = useSidebar();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const authIsHydrated = useAuthStore((state) => state.isHydrated);

  const groupedRecordSummaries = useRecordStore((state) => state.groupedRecordSummaries);
  const isLoading = useRecordStore((state) => state.isLoadingRecordSummaries);
  const isHydrated = useRecordStore((state) => state.isHydrated);

  const { loadRecordSummaries, deleteRecord, fetchRecord } = useRecordStore();
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [deleteRecordName, setDeleteRecordName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [editRecordId, setEditRecordId] = useState<string | null>(null);

  useEffect(() => {
    if (!authIsHydrated || !isHydrated || !isLoggedIn ) return;
    loadRecordSummaries();
  }, [isLoggedIn, authIsHydrated, isHydrated, loadRecordSummaries, router]);

  const handleSelectRecord = (recordId: string) => {
    router.push(ROUTES.RECORD_VIEW(recordId));
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleDeleteClick = (recordId: string, recordName: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to the record
    setDeleteRecordId(recordId);
    setDeleteRecordName(recordName);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRecordId) return;
    
    setIsDeleting(true);
    try {
      await deleteRecord(deleteRecordId);
      setDeleteRecordId(null);
      setDeleteRecordName('');
      router.push(ROUTES.RECORDS);
    } catch (error) {
      console.error('Failed to delete record', error);
      // Dialog will stay open on error so user can retry or cancel
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (recordId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to the record
    setEditRecordId(recordId);
  };

  const handleEditDialogClose = () => {
    setEditRecordId(null);
  };

  const handleEditUpdated = () => {
    // Refresh the record summaries list
    loadRecordSummaries();
    // If the user is currently viewing the edited record, refresh full record
    if (editRecordId && currentRecordId === editRecordId) {
      fetchRecord(editRecordId);
    }
  };

  // Find the record being edited from all groups
  const recordToEdit = useMemo(() => {
    if (!editRecordId) return null;
    return Object.values(groupedRecordSummaries)
      .flat()
      .find(r => r.id === editRecordId) || null;
  }, [editRecordId, groupedRecordSummaries]);

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

  const sortedLetters = Object.keys(groupedRecordSummaries).sort((a, b) => {
    // Put '#' at the end, otherwise sort alphabetically
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b);
  });
  return (
    <Sidebar className="top-[var(--header-height)]" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold">Records</span>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem className="mx-3 mt-1">
            <CreateNewRecordButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pb-16">
        {sortedLetters.map((letter) => (
          <SidebarGroup key={letter} className="py-0 px-1">
            <SidebarGroupLabel>{letter}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {groupedRecordSummaries[letter].map((record) => (
                  <SidebarMenuItem key={record.id}>
                    <div className="flex items-center w-full group/record">
                      <SidebarMenuButton 
                        isActive={record.id === currentRecordId}
                        onClick={() => handleSelectRecord(record.id)}
                        className="flex-1 min-w-0 justify-start"
                      >
                        <LayoutDashboard className="h-4 w-4 shrink-0" />
                        <span className="truncate" title={record.name}>{record.name}</span>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 shrink-0 opacity-100 md:opacity-0 md:group-hover/record:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => handleEditClick(record.id, e)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            variant="destructive"
                            onClick={(e) => handleDeleteClick(record.id, record.name, e)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
      <DeleteRecordDialog
        open={deleteRecordId !== null}
        recordName={deleteRecordName}
        onClose={() => {
          setDeleteRecordId(null);
          setDeleteRecordName('');
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
      {recordToEdit && (
        <EditRecordDialog
          open={editRecordId !== null}
          record={recordToEdit}
          onDialogClose={handleEditDialogClose}
          onUpdated={handleEditUpdated}
        />
      )}
    </Sidebar>
  );
};

export default RecordsSidebar;