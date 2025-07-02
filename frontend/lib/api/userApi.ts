import { fetchPost } from './fetchConfig';

export const loginUser = async (email: string, password: string) => fetchPost('auth/login', {
    body: JSON.stringify({ email, password }),
});

export const signupUser = async (email: string, password: string) => fetchPost('auth/signup', {
    body: JSON.stringify({ email, password }),
});