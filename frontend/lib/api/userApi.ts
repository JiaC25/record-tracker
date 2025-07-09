import { UserInfo } from '@/lib/types/auth';
import { fetchPost } from './fetchConfig';

export const signupUser = async (email: string, password: string) => {
    await fetchPost('auth/signup', {
        body: JSON.stringify({ email, password }),
    });
}

export const loginUser = async (email: string, password: string) : Promise<UserInfo>  => {
    return await fetchPost<UserInfo>('auth/login', {
        body: JSON.stringify({ email, password }),
    }).then(res => res.json());
}

export const logoutUser = async () => {
    await fetchPost('/auth/logout');
}