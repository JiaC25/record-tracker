import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ChartColumnBig, LucideIcon, Menu, Notebook, NotebookPen } from 'lucide-react'
import Link from 'next/link'
import UserStatus from './user-status'

interface NavItem {
    href: string
    label: string
    icon: LucideIcon
}

const AppHeader = () => {
    const navItems : NavItem[] = [
        {
            href: '/records',
            label: 'Records',
            icon: Notebook
        },
        {
            href: '/',
            label: 'Analytics',
            icon: ChartColumnBig
        },
    ]
    return (
        <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b px-4">
            <div className="flex w-full h-[var(--header-height)] items-center justify-between z-50">
                <div className="flex items-center gap-2">
                    {/* Mobile nav menu */}
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader className="pb-0">
                                <SheetTitle>
                                    {/* App branding in mobile menu */}
                                    <Link href="/" className='flex items-center'>
                                        <NotebookPen className="text-primary w-5 h-5" />
                                        <div className='font-semibold text-lg'>
                                            <span className="text-primary">Gen</span>
                                            <span>Tracker</span>
                                        </div>
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>
                            <Separator />
                            {/* Menu items */}
                            <nav className="flex flex-col gap-3 mx-6">
                                {navItems.map((item, index) => (
                                    <SheetClose asChild key={index}>
                                        <Button variant="ghost" asChild className="justify-start">
                                            <Link href={item.href}><item.icon />{item.label}</Link>
                                        </Button>
                                    </SheetClose>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>

                    {/* Logo and App name */}
                    <Link href="/" className='flex items-center'>
                        <NotebookPen className="text-primary w-5 h-5" />
                        <div className='font-semibold text-lg'>
                            <span className="text-primary">Gen</span>
                            <span>Tracker</span>
                        </div>
                    </Link>
                    {/* Desktop nav menu */}
                    <NavigationMenu className="hidden md:flex ml-3">
                        <NavigationMenuList>
                            {navItems.map((item, index) => (
                                <NavigationMenuItem key={index} asChild className={navigationMenuTriggerStyle()}>
                                    <Link href={item.href}>{item.label}</Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <UserStatus />
            </div>
        </header>
    )
}

export default AppHeader