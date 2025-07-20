import { useAuthStore } from '@/lib/store/authStore';

export interface ApiResponse<T> extends Response {
  data?: T;
};

export const BASE_URL = 'http://localhost:5000';

export const buildUrl = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}/api${cleanPath}`;
};

export const buildHeaders = () => {
    const headers: Record<string, string> = { 
        'Content-Type' : 'application/json' 
    };
    return headers;
};

export const handleHttpError = async (response: Response): Promise<Response> => {
    if (!response.ok) {
        if (response.status === 401) {
            console.warn('Session expired, clearing session');
            const { clearSession } = useAuthStore.getState();
            clearSession();
            window.location.href = '/login'; // Redirect to login page
            return Promise.reject(new Error('Session expired'));
        }
        console.error('Api Error', response);
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