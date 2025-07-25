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
    logoutUser: () => void;
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
      logoutUser: () => {
        const { clearSession } = get();
        clearSession();
                
        authApi.logoutUser();
        window.location.href = ROUTES.HOME; // Redirect to home page
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