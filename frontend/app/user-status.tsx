'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/lib/store/authStore';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const UserStatus = () => {
  const { logoutUser } = useAuthStore();
  const userEmail = useAuthStore((state) => state.userEmail);

  const isHydrated = useAuthStore((state) => state.isHydrated);

  // Show skeleton loading state during hydration
  if (!isHydrated) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="User" />
            <AvatarFallback>{userEmail ? userEmail.charAt(0).toUpperCase() : <User/>}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50">
        <DropdownMenuLabel className="flex justify-center text-xs">{userEmail}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs">Profile</DropdownMenuItem>
        <DropdownMenuItem className="text-xs">Settings</DropdownMenuItem>
        {/* <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="flex justify-between p-2 focus:bg-transparent text-xs"
                >
                    Appearance <ThemeToggleInline />
                </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logoutUser} className="flex justify-center text-xs">
                    Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserStatus;