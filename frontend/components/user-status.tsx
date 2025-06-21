'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

const UserStatus = () => {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        setUserEmail(null); // Clear the user email state
    }

    useEffect(() => {
        // Check if the user is logged in by checking for a token in localStorage
        const updateStatus = () => {
            const token = localStorage.getItem('token');
            const payload = token ? parseJwt(token) : null;
            if (payload && payload.email) {
                setUserEmail(payload.email);
            }
        }

        updateStatus();
        // Listen for changes in authentication state (Todo: update this to use a more robust state management solution)
        window.addEventListener('authChanged', updateStatus);
        return () => {
            window.removeEventListener('authChanged', updateStatus);
        }
    }, []);

    return userEmail ? (
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span>{userEmail}</span>
            <Button onClick={handleLogout} variant="destructive" size="sm">
                Logout
            </Button>
        </div>
    ) : (
        <Button onClick={() => router.push('/login')} size="sm">
            Login
        </Button>
    )
}

export default UserStatus