'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/lib/routes.config';
import { useAuthStore } from '@/lib/store/authStore';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authApi } from '../../lib/api/authApi';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isAuthHydrated = useAuthStore((state) => state.isHydrated);
  const router = useRouter();

  // Show loading state while checking auth status
  if (!isAuthHydrated) {
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
    );
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
      await authApi.signupUser(email, password);
      console.log('Signup successful'); // Todo: show alert or notification on UI
      router.push(ROUTES.LOGIN);
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20">
      <Card className='mx-2'>
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
              <Button type="button" variant="link" className="w-full" onClick={() => router.push(ROUTES.LOGIN)}>
                <span className='text-sm'>Already signed up? Log In</span>
              </Button>
            </fieldset>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;