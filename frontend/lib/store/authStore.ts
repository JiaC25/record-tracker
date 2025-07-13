import { UserInfo } from '@/lib/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser, logoutUser } from '../api/userApi';

type AuthStore = {
    userId: string | null;
    userEmail: string | null;
    isLoggedIn: boolean;
    isHydrated: boolean;
    
    setUserInfo: (userInfo: UserInfo) => void;
    loginUser: (email: string, password: string) => Promise<boolean>;
    logoutUser: () => void;
    setHydrated: () => void;
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
            logoutUser: async () => {
                try {
                    await logoutUser();
                } catch (error) {
                    console.error('Logout failed', error);
                }
                set(() => ({
                    userId: null,
                    email: null,
                    isLoggedIn: false,
                }));
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