'use client';

import { ROUTES } from '@/lib/routes.config';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Home = () => {
  const router = useRouter();
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const authIsHydrated = useAuthStore(state => state.isHydrated);

  useEffect(() => {
    if (authIsHydrated) {
      // Redirect based on auth status (middleware should handle this, but this is a fallback)
      if (isLoggedIn) {
        router.replace(ROUTES.RECORDS);
      } else {
        router.replace(ROUTES.LOGIN);
      }
    }
  }, [isLoggedIn, authIsHydrated, router]);

  // Show nothing while redirecting (middleware should handle redirect before this renders)
  return null;
};

export default Home;