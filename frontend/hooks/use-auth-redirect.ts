'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Redirects authenticated users away from auth pages
 * @param redirectTo Optional path to redirect the user to (default: '/')
 * @returns boolean indicating if redirect will happen
 */
export const useAuthRedirect = (redirectTo: string = '/') => {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const [willRedirect, setWillRedirect] = useState(false);

  useEffect(() => {
    // Only redirect after hydration is complete to avoid false redirects
    if (isHydrated && isLoggedIn) {
      setWillRedirect(true);
      // Small delay to allow loading state to show and avoid page flashing
      const timer = setTimeout(() => {
        router.replace(redirectTo);
      }, 100);

      return () => clearTimeout(timer);
    } else if (isHydrated) {
      setWillRedirect(false);
    }
  }, [isLoggedIn, isHydrated, redirectTo, router]);

  return willRedirect;
};