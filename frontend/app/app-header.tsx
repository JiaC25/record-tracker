'use client';

import ThemeToggleInline from '@/components/app-theme/theme-toggle-inline';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/lib/routes.config';
import { useAuthStore } from '@/lib/store/authStore';
import { NotebookPen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import UserStatus from './user-status';

const AppHeader = () => {
  const router = useRouter();
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const authIsHydrated = useAuthStore(state => state.isHydrated);
  const { checkAuth } = useAuthStore();

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
    
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
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-10 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>
    );
  }

  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b border-secondary-foreground/20 px-4">
      <div className="flex w-full h-[var(--header-height)] items-center justify-between z-50">
        <div className="flex items-center gap-2">
          {/* Logo and App name */}
          <Link href={isLoggedIn ? ROUTES.RECORDS : ROUTES.LOGIN} className='flex items-center md:ml-2'>
            <NotebookPen className="text-primary w-5 h-5" />
            <div className='font-semibold text-lg md:text-xl'>
              <span className="text-primary">Gen</span>
              <span>Tracker</span>
            </div>
          </Link>
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