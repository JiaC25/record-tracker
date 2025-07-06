import { useAuthStore } from '@/lib/store/authStore';

export interface ApiResponse<T> extends Response {
  data?: T;
};

export const BASE_URL = 'http://localhost:5000';

const buildUrl = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}/api${cleanPath}`;
};

const buildHeaders = (useAuth: boolean = true) => {
    const headers: Record<string, string> = { 'Content-Type' : 'application/json' };
    if (useAuth) {
        const token = useAuthStore.getState().token;
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return headers;
};

export const handleHttpError = (response: Response): Promise<Response> => {
    if (!response.ok) {
        console.error(response);
        return Promise.reject(response);
    }
    return Promise.resolve(response);
};

export const fetchGet = <T>(path: string, config?: RequestInit): Promise<ApiResponse<T>> =>
    fetch(buildUrl(path), {
        method: 'GET',
        headers: buildHeaders(true),
        ...config,
    }).then(handleHttpError);

export const fetchPost = <T>(path: string, config?: RequestInit): Promise<ApiResponse<T>> =>
    fetch(buildUrl(path), {
        method: 'POST',
        headers: buildHeaders(true),
        ...config,
    }).then(handleHttpError);