export const BASE_URL = 'http://localhost';
export const BACKEND_API = `${BASE_URL}:5000`;


export const fetchPost = (url: string, config?: RequestInit) => fetch(url,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        ...config,
    });