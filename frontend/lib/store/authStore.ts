import { ROUTES } from '@/lib/routes.config';
import { useRecordStore } from '@/lib/store/recordStore';
import { UserInfo } from '@/lib/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/authApi';

type AuthStore = {
    userId: string | null;
    userEmail: string | null;
    isLoggedIn: boolean;
    isHydrated: boolean;

    setHydrated: () => void;
    setUserInfo: (userInfo: UserInfo | null) => void;
    loginUser: (email: string, password: string) => Promise<void>;
    clearSession: () => void;
    logoutUser: () => Promise<void>;
    checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      /** States */
      userId: null,
      userEmail: null,
      isLoggedIn: false,
      isHydrated: false,

      /** Actions */
      setHydrated: () => {
        set({ isHydrated: true });
      },
      setUserInfo: (userInfo) => {
        set(() => {
          if (userInfo) {
            return {
              userId: userInfo.userId,
              userEmail: userInfo.email,
              isLoggedIn: true,
            };
          } else {
            return {
              userId: null,
              userEmail: null,
              isLoggedIn: false,
            };
          }
        });
      },
      loginUser: async (email: string, password: string) => {
        const { setUserInfo } = get();

        try {
          const userInfo = await authApi.loginUser(email, password);
          setUserInfo(userInfo);
        } catch (error) {
          throw error;
        }
      },
      clearSession: () => {
        const { setUserInfo } = get();
        setUserInfo(null); // Clear user info
                
        // Clear any other persisted stores
        useRecordStore.getState().clearAll();
      },
      logoutUser: async () => {
        // Try to call backend logout API with retries
        // The auth cookie is HttpOnly, so it can only be cleared by the backend
        let backendLogoutSucceeded = false;
        const maxRetries = 2;
        const retryDelay = 300; // 300ms between retries
        
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            await authApi.logoutUser();
            backendLogoutSucceeded = true;
            break; // Success, exit retry loop
          } catch (error) {
            if (attempt < maxRetries) {
              // Wait before retrying (exponential backoff)
              await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
              continue;
            }
            // Final attempt failed - log warning but continue with local logout
            console.warn(
              `Logout API call failed after ${maxRetries + 1} attempts. ` +
              'Proceeding with local logout. The auth cookie may still be valid on the backend.',
              error
            );
          }
        }
        
        // Clear local session state regardless of backend logout result
        // This ensures users aren't stuck if the backend is down
        const { clearSession } = get();
        clearSession();
        
        // Use setTimeout to allow React to finish current render cycle before redirect
        // This prevents STATUS_ACCESS_VIOLATION errors from components trying to access cleared state
        setTimeout(() => {
          window.location.replace(ROUTES.LOGIN); // Use replace instead of href to avoid adding to history
        }, 0);
      },

      /** Check user authentication & update store */
      checkAuth: async () => {
        const { setUserInfo } = get();
        try {
          const userInfo = await authApi.checkAuth();
          setUserInfo(userInfo);
        } catch {
          setUserInfo(null);
        } finally {
          set({ isHydrated: true });
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        userId: state.userId,
        userEmail: state.userEmail,
        isLoggedIn: state.isLoggedIn,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      }
    }
  )
);