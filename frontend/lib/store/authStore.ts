import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserInfo } from '../api/userApi';

type AuthStore = {
    token: string | null;
    userId: string | null;
    userEmail: string | null;
    isLoggedIn: boolean;
    isHydrated: boolean;
    
    setToken: (userInfo: UserInfo) => void;
    clearToken: () => void;
    setHydrated: () => void
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            /** States */
            token: null,
            userId: null,
            userEmail: null,
            isLoggedIn: false,
            isHydrated: false,

            /** Actions */
            setHydrated: () => {
                set({ isHydrated: true })
            },
            setToken: (userInfo) => {
                set(() => {
                    if (userInfo) {
                        return {
                            token: userInfo.token,
                            userId: userInfo.userId,
                            userEmail: userInfo.email,
                            isLoggedIn: true,
                        };
                    } else {
                        return {
                            token: null,
                            userId: null,
                            userEmail: null,
                            isLoggedIn: false,
                        };
                    }
                });
            },

            clearToken: () => {
                set(() => ({
                    token: null,
                    userId: null,
                    email: null,
                    isLoggedIn: false,
                }));
            },
        }),
        {
            name: 'auth-store',
            partialize: (state) => ({
                token: state.token,
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