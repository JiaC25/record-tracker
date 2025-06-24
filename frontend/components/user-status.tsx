'use client'

import ThemeToggleInline from '@/components/app-theme/theme-toggle-inline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

const parseJwt = (token: string) => {
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50">
                <DropdownMenuLabel className="flex justify-center text-xs">{userEmail}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs">Profile</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Settings</DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex justify-between p-2 focus:bg-transparent text-xs">
                    Appearance <ThemeToggleInline />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex justify-center text-xs">
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <Button onClick={() => router.push('/login')} size="sm">
            Login
        </Button>
    )
}

export default UserStatus