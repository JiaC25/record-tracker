'use client';

import ThemeToggleInline from '@/components/app-theme/theme-toggle-inline';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/lib/routes.config';
import { useAuthStore } from '@/lib/store/authStore';
import { ChartColumnBig, LucideIcon, Menu, Notebook, NotebookPen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import UserStatus from './user-status';

interface NavItem {
    href: string
    label: string
    icon: LucideIcon
}

const AppHeader = () => {
  const router = useRouter();
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const authIsHydrated = useAuthStore(state => state.isHydrated);
  const { checkAuth } = useAuthStore();

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const navItems : NavItem[] = isLoggedIn
    ? [
      {
        href: ROUTES.RECORDS,
        label: 'Records',
        icon: Notebook
      },
      {
        href: ROUTES.ANALYTICS,
        label: 'Analytics',
        icon: ChartColumnBig
      },
    ] : [
      // Any public routes for unauthenticated users
    ];
    
  // Show skeleton loading state during hydration
  if (!authIsHydrated) {
    return (
      <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b px-4 justify-between">
        <div className="flex items-center gap-5">
          {/* Logo and App name */}
          <Link href="/" className='flex items-center md:ml-2'>
            <NotebookPen className="text-primary w-5 h-5" />
            <div className='font-semibold text-lg md:text-xl'>
              <span className="text-primary">Gen</span>
              <span>Tracker</span>
            </div>
          </Link>
          <Skeleton className="h-5 w-22 rounded" />
          <Skeleton className="h-5 w-22 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-10 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>
    );
  }

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
                <SheetDescription className="sr-only">description</SheetDescription>
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
          <Link href="/" className='flex items-center md:ml-2'>
            <NotebookPen className="text-primary w-5 h-5" />
            <div className='font-semibold text-lg md:text-xl'>
              <span className="text-primary">Gen</span>
              <span>Tracker</span>
            </div>
          </Link>
          {/* Desktop nav menu */}
          <NavigationMenu className="hidden md:flex ml-3">
            <NavigationMenuList>
              {navItems.map((item, index) => (
                <NavigationMenuItem key={index} asChild className={navigationMenuTriggerStyle()}>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link href={item.href}><item.icon />{item.label}</Link>
                  </Button>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center">
          <span className="mr-3 md:mr-5"><ThemeToggleInline/></span>
          { isLoggedIn ? (
            <UserStatus />
          ) : (
            <Button onClick={() => router.push(ROUTES.LOGIN)} size="sm">
                            Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;