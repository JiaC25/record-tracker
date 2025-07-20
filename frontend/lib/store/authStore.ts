import { ROUTES } from '@/lib/routes.config';
import { useRecordStore } from '@/lib/store/recordStore';
import { UserInfo } from '@/lib/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiCheckAuth, apiLogout, loginUser } from '../api/authApi';

type AuthStore = {
    userId: string | null;
    userEmail: string | null;
    isLoggedIn: boolean;
    isHydrated: boolean;

    setHydrated: () => void;
    setUserInfo: (userInfo: UserInfo | null) => void;
    loginUser: (email: string, password: string) => Promise<boolean>;
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
                set({ isHydrated: true })
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
            loginUser: async (email, password) => {
                const { isLoggedIn, setUserInfo } = get();

                try {
                    const userInfo = await loginUser(email, password);
                    setUserInfo(userInfo);
                    return isLoggedIn;
                } catch (error) {
                    console.error('Login failed', error);
                    throw error;
                }
            },
            clearSession: () => {
                const { setUserInfo } = get();
                
                // Clear user info
                setUserInfo(null);

                // Clear any other persisted stores
                useRecordStore.getState().clearAll();
            },
            logoutUser: () => {
                const { clearSession } = get();
                
                clearSession();
                apiLogout(); // Skip await to avoid blocking UI
                window.location.href = ROUTES.HOME; // Redirect to home page
            },
            checkAuth: async () => {
                const { setUserInfo } = get();
                try {
                    const userInfo = await apiCheckAuth();
                    setUserInfo(userInfo);
                } catch (error) {
                    console.error('Auth check failed', error);
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
                state?.setHydrated()
            }
        }
    )
)