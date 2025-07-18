import { useAuthStore } from '@/lib/store/authStore';

export interface ApiResponse<T> extends Response {
  data?: T;
};

export const BASE_URL = 'http://localhost:5000';

const buildUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}/api${cleanPath}`;
};

const buildHeaders = () => {
  const headers: Record<string, string> = { 
    'Content-Type' : 'application/json' 
  };
  return headers;
};

export const handleHttpError = async (response: Response): Promise<Response> => {
  if (!response.ok) {
    if (response.status === 401) {
      // JWT Token or the Cookie likely expired
      console.warn('Session expired, logging out...');
      await useAuthStore.getState().logoutUser?.();
    }
    console.error('Error', response);
    return Promise.reject(response);
  }
  return Promise.resolve(response);
};

export const fetchGet = <T>(path: string, config?: RequestInit): Promise<ApiResponse<T>> =>
  fetch(buildUrl(path), {
    method: 'GET',
    headers: buildHeaders(),
    credentials: 'include',
    ...config,
  }).then(handleHttpError);

export const fetchPost = <T>(path: string, config?: RequestInit): Promise<ApiResponse<T>> =>
  fetch(buildUrl(path), {
    method: 'POST',
    headers: buildHeaders(),
    credentials: 'include',
    ...config,
  }).then(handleHttpError);