import { useAuthStore } from '@/lib/store/authStore';

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

export const fetchGet = (path: string, config?: RequestInit) =>
    fetch(buildUrl(path), {
        method: 'GET',
        headers: buildHeaders(true),
        ...config,
    });

export const fetchPost = (path: string, config?: RequestInit) =>
    fetch(buildUrl(path), {
        method: 'POST',
        headers: buildHeaders(true),
        ...config,
    });