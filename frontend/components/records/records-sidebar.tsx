'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/lib/store/authStore'
import { useRecordStore } from '@/lib/store/recordStore'
import { LayoutDashboard, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '../ui/button'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '../ui/sidebar'

const RecordsSidebar = () => {
    const router = useRouter();

    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const authIsHydrated = useAuthStore((state) => state.isHydrated);

    const groupedRecordSummaries = useRecordStore((state) => state.groupedRecordSummaries);
    const selectedRecordId = useRecordStore((state) => state.selectedRecordId);
    const isLoading = useRecordStore((state) => state.isLoadingRecordSummaries);
    const isHydrated = useRecordStore((state) => state.isHydrated);

    const { loadRecordSummaries, setSelectedRecordId } = useRecordStore();

    useEffect(() => {
        if (!authIsHydrated || !isHydrated || !isLoggedIn ) return;
        loadRecordSummaries();
    }, [isLoggedIn, authIsHydrated, isHydrated, loadRecordSummaries, router])

    const handleAddRecord = () => {
        // Todo
    }
    const handleSelectRecord = (recordId: string) => {
        setSelectedRecordId(recordId);
    }

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
        )
    }

    const sortedLetters = Object.keys(groupedRecordSummaries).sort();
    return (
        <Sidebar className="top-[var(--header-height)]" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center justify-between">
                            Records
                            <Button variant="secondary" size="icon" className="size-6 cursor-pointer" onClick={handleAddRecord}>
                                <Plus className='size-4' />
                            </Button>
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
                                            isActive={selectedRecordId === record.id}
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
    )
}

export default RecordsSidebar