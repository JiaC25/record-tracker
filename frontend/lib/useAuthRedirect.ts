'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuthRedirect = () => {
    const router = useRouter();

    useEffect(() => {
        // Check if the user is already logged in by checking for a token in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/'); // Redirect to home page if already logged in
        }
    }, [router]);
}