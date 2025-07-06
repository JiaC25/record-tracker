'use client';

import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { loginUser } from '@/lib/api/userApi';
import { useAuthStore } from '@/lib/store/authStore';
import { Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const isHydrated = useAuthStore((state) => state.isHydrated);
    const { setToken } = useAuthStore();

    const router = useRouter();

    const willRedirect = useAuthRedirect(); // Redirect if already logged in

    // Show loading state while checking auth status
    if (!isHydrated || (isHydrated && isLoggedIn && willRedirect)) {
        return (
            <div className="max-w-sm mx-auto mt-20 p-4">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <Skeleton className="h-6 w-20 mb-2" />
                        <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent className="space-y-4">
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
        if (!email || !password) {
            console.error('Email and password are required');
            setIsLoading(false);
            return;
        }

        try {
            const response = await loginUser(email, password);
            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            setToken(data);

            router.push('/'); // Redirect to the home page after successful login
        } catch (error) {
            console.error('Login failed:', error);
            // Todo: Handle error (e.g., show a notification or alert )
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='max-w-sm mx-auto mt-20'>
            <Card className="mx-2">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                    <CardAction>
                        <Button variant="link" onClick={() => router.push('/signup')}>
                            <span className='text-sm'>Sign Up</span>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <fieldset className='space-y-4' disabled={isLoading}>
                            <Input
                                type='email'
                                placeholder='User@example.com'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                type='password'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2Icon className="animate-spin" />
                                        Logging In
                                    </span>
                                ) : 'Login'}
                            </Button>
                        </fieldset>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginPage