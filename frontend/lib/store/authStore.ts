import { parseJwt } from '@/lib/helpers/authHelpers';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
    token: string | null;
    userId: string | null;
    userEmail: string | null;
    isLoggedIn: boolean;
    isHydrated: boolean;
    
    setToken: (token: string) => void;
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
            setToken: (token) => {
                set(() => {
                    const payload = parseJwt(token);
                    if (token && payload) {
                        return {
                            token,
                            userId: payload.userId,
                            userEmail: payload.email,
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