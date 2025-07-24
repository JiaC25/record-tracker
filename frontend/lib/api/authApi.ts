import { UserInfo } from '../types/auth';
import { API_BASE, apiClient } from './apiClient';
import { ApiError } from './apiError';

export const authApi = {
  signupUser: (email: string, password: string) =>
    apiClient.post<void>('/auth/signup', { email, password }),

  loginUser: (email: string, password: string) =>
    apiClient.post<UserInfo>('/auth/login', { email, password }),

  logoutUser: async (): Promise<void> => {
    try {
      // Using raw fetch to avoid recursive logout calls
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.warn('Backend Logout failed', error);
    }
  },

  checkAuth: async (): Promise<UserInfo | null> => {
    try {
      return await apiClient.get<UserInfo>('/auth/check');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return null; // Not Authenticated
      }
      throw error;
    }
  },
};