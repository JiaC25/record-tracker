import { BACKEND_API, fetchPost } from './fetchConfig';

export const loginUser = async (email: string, password: string) => fetchPost(`${BACKEND_API}/api/auth/login`, {
    body: JSON.stringify({ email, password }),
});

export const signupUser = async (email: string, password: string) => fetchPost(`${BACKEND_API}/api/auth/signup`, {
    body: JSON.stringify({ email, password }),
});