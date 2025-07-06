import { fetchPost } from './fetchConfig';

export type UserInfo = {email: string, userId: string, token: string};
export const loginUser = async (email: string, password: string)  => fetchPost<UserInfo>('auth/login', {
    body: JSON.stringify({ email, password }),
});

export const signupUser = async (email: string, password: string) => fetchPost('auth/signup', {
    body: JSON.stringify({ email, password }),
});