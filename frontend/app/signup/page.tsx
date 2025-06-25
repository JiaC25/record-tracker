'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { signupUser } from '@/lib/api/userApi';
import { useAuthStore } from '@/lib/store/authStore';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const isHydrated = useAuthStore((state) => state.isHydrated);
    const router = useRouter();

    const willRedirect = useAuthRedirect(); // Redirect if already logged in
    // Show loading state while checking auth status
    if (!isHydrated || (isHydrated && isLoggedIn && willRedirect)) {
        return (
            <div className="max-w-sm mx-auto mt-20 p-4">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <Skeleton className="h-6 w-20 mb-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-9 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Todo: Better form validation
        if (!email || !password || !confirmPassword) {
            console.error('All fields are required');
            setIsLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            console.error('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const response = await signupUser(email, password);

            if (!response.ok) {
                console.error('Signup failed:', response);
                throw new Error('Signup failed');
            }

            const data = await response.json();
            console.log('Signup successful:', data);
            router.push('/login'); // Redirect to login page after successful signup
        } catch (error) {
            console.error('Signup failed:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-20">
            <Card className='w-full max-w-sm'>
                <CardHeader>
                    <CardTitle>Signup</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <fieldset className="space-y-4" disabled={isLoading}>
                            <Input
                                type='email'
                                placeholder='User@example.com'
                                name='email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                type='password'
                                placeholder='Password'
                                name='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Input
                                type='password'
                                placeholder='Confirm Password'
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button type='submit' className='w-full' disabled={isLoading}>
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" />
                                        Signing Up
                                    </span>
                                ) : 'Sign Up'}
                            </Button>
                        </fieldset>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default SignupPage