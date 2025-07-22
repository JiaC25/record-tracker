import { useAuthStore } from '../store/authStore';
import { ApiError } from './apiError';


export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Handles HTTP errors and session expiry
const handleHttpErrors = async (response: Response): Promise<void> => {
    if (response.ok) return;

    // Session expired handling
    if (response.status === 401) {
        console.warn('Session expired, clearing session');
        const { clearSession } = useAuthStore.getState();
        clearSession();
        throw new ApiError('Session expired', 401);
    }

    // Try to parse server error response
    let errorMessage = `API Error: ${response.status}`;
    try {
        const errorData = await response.json();
        if (errorData?.message) errorMessage = errorData.message;
    } catch {}

    throw new ApiError(errorMessage, response.status);
}

// Handles JSON parsing, 204 & empty responses
const parseJsonResponse = async <T>(response: Response): Promise<T> => {
    if (response.status === 204) return null as T;

    // If the response is empty, return null
    const text = await response.text();
    if (!text) return null as T;

    try {
        return JSON.parse(text) as T;
    } catch (error) {
        console.warn('Failed to parse JSON response', text, error);
        throw new ApiError('Invalid JSON response from server', response.status);
    }
}

// Low-level API fetch helper function
const apiFetch = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
    const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

    // Fetch with credentials and custom headers
    const response = await fetch(url, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    await handleHttpErrors(response);
    return parseJsonResponse<T>(response);
}

// Public API client interface
export const apiClient = {
    get: <T>(url: string) =>
        apiFetch<T>(url, {
            method: 'GET',
        }),

    post: <T>(url: string, body?: unknown) =>
        apiFetch<T>(url, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        }),

    put: <T>(url: string, body?: unknown) =>
        apiFetch<T>(url, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        }),
    
    delete: <T>(url: string) =>
        apiFetch<T>(url, {
            method: 'DELETE',
        }),
};