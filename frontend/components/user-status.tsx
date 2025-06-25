'use client'

import ThemeToggleInline from '@/components/app-theme/theme-toggle-inline';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

const UserStatus = () => {
    const router = useRouter();
    const { clearToken } = useAuthStore();
    const userEmail = useAuthStore((state) => state.userEmail);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    const [isHydrated, setIsHydrated] = useState(false);
    
    useEffect(() => {
        setIsHydrated(true)
    }, [])

    const handleLogout = () => {
        clearToken();
        router.push('/login');
    }

    // Show skeleton loading state during hydration
    if (!isHydrated) {
        return (
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
        )
    }

    return isLoggedIn ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback>{userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50">
                <DropdownMenuLabel className="flex justify-center text-xs">{userEmail}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs">Profile</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Settings</DropdownMenuItem>
                <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="flex justify-between p-2 focus:bg-transparent text-xs"
                >
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