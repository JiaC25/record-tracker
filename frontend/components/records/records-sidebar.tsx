import { LayoutDashboard, Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '../ui/sidebar'

const RecordsSidebar = () => {
    return (
        <Sidebar className="top-[var(--header-height)]" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center justify-between">
                            Records
                            <Button variant="secondary" size="icon" className="size-6">
                                <Plus className='size-4'/>
                            </Button>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="pb-16">
                <SidebarGroup>
                    <SidebarGroupLabel>A</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <div>
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>AXX Record</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <div>
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>AOverviewOverviewOverviewOverviewOverview</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <div>
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>AOverview</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <div>
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>AOverviewOverviewOverviewOverviewOverview</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <div>
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>AOverview</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>C</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <div>
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>Crypto DCA</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>G</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive>
                                    <div>
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>Grocery Spending</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <div>
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>G DORAGON</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}

export default RecordsSidebar