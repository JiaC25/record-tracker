import { UserInfo } from '@/lib/types/auth';
import { fetchPost } from './fetchConfig';

export const signupUser = async (email: string, password: string) => {
    await fetchPost('auth/signup', {
        body: JSON.stringify({ email, password }),
    });
}

export const loginUser = async (email: string, password: string) : Promise<UserInfo>  => {
    const response = await fetchPost<UserInfo>('auth/login', {
        body: JSON.stringify({ email, password }),
    });
    const data: UserInfo = await response.json();
    return data;
}

export const logoutUser = async () => {
    await fetchPost('/auth/logout');
}