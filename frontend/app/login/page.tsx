'use client';

import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuthRedirect } from '@/lib/useAuthRedirect';
import { Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Todo: Currently if the user is already logged in and they try to access the login page, they will be redirected to the home page. However the LoginPage UI will be shown briefly before the redirect happens. This can be improved by checking the authentication state before rendering the page.
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    useAuthRedirect(); // Redirect if already logged in

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
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token); // Store the token in localStorage

            // Todo: set the user data in a global state or context
            window.dispatchEvent(new Event('authChanged'));

            router.push('/'); // Redirect to the home page after successful login
        } catch (error) {
            console.error('Login failed:', error);
            // Todo: Handle error (e.g., show a notification or alert )
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='max-w-sm mx-auto mt-20 space-y-4'>
            <Card className="w-full max-w-sm">
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
                            <Button type="submit" className='w-full' disabled={isLoading}>
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