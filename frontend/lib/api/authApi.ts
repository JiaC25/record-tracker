import { UserInfo } from '@/lib/types/auth';
import { buildUrl, fetchPost } from './fetchConfig';

export const signupUser = async (email: string, password: string) => {
    await fetchPost('auth/signup', {
        body: JSON.stringify({ email, password }),
    });
}

export const loginUser = async (email: string, password: string) : Promise<UserInfo>  => {
    const response = await fetchPost<UserInfo>('auth/login', {
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return data as UserInfo;
}

export const apiLogout = async (): Promise<void> => {
    // Using raw fetch to avoid recursive logout issues
    try {
        await fetch(buildUrl('/auth/logout'), {
            method: 'POST',
            credentials: 'include',
        });
    } catch (error) {
        console.warn('Backend Logout failed', error);
    }
}

export const apiCheckAuth = async () : Promise<UserInfo | null> => {
    const response = await fetch(buildUrl('/auth/check'), {
        method: 'GET',
        credentials: 'include',
    });

    if (response.status === 401) return null; // Not authenticated
    if (!response.ok) throw new Error('Failed to check authentication');

    const data = await response.json();

    return data?.userId ? (data as UserInfo) : null;
}