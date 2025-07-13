'use client';

import Alert from '@/components/general/alert-banner';
import DialogInfo, { DialogInfoPayload } from '@/components/general/dialog-info';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { useAuthStore } from '@/lib/store/authStore';
import { Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';


type LoginFormInput = {
    email: string;
    password: string;
};
const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const isHydrated = useAuthStore((state) => state.isHydrated);
    const { loginUser } = useAuthStore();

    const router = useRouter();

    const willRedirect = useAuthRedirect(); // Redirect if already logged in

    const form = useForm<LoginFormInput>();
    const {register, 
        handleSubmit,
        setError,
        formState: {errors}} = form;

    const [showErrorDialog, setShowErrorDialog] = useState<DialogInfoPayload>({
        open: false,
        title: 'Opps!',
        message: 'An unexpected error occurred. Please try again later.',
    });

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

    const onSubmit: SubmitHandler<LoginFormInput> = async ({email, password}) => {
        setIsLoading(true);
        try {
            const isLoggedIn = await loginUser(email, password);
            console.log(isLoggedIn);
            if (isLoggedIn) {
                router.push('/'); // Redirect to the home page after successful login
            }
        } catch (error) {
            handleLoginResponseError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleLoginResponseError = (response: Response | any) => {
        switch (response.status) {
            case 404:
            case 401:
                setError('root', { type: 'http', message: 'Invalid email or password.' });
                break;
            default:
                setShowErrorDialog({...showErrorDialog, open: true});
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
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                        <fieldset className='space-y-4' disabled={isLoading}>
                            <Input
                                {...register('email', { required: 'Email is required.' })}
                                type='email' autoFocus
                                placeholder='User@example.com'

                            />
                            <FormMessage>{errors?.email?.message ?? ''}</FormMessage>
    
                            <Input
                                {...register('password', { required: 'Password is required.' })}
                                type='password'
                                placeholder='Password'
                            />
                            <FormMessage>{errors?.password?.message ?? ''}</FormMessage>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                Login {isLoading && (
                                    <span className="flex items-center gap-2">
                                        <Loader2Icon className="animate-spin" />
                                    </span>
                                )}
                            </Button>
                            {/* General error message */}
                            <Alert variant="destructive" title={errors.root?.message} />
                        </fieldset>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <DialogInfo {...showErrorDialog} open={showErrorDialog.open} onClose={() => setShowErrorDialog({...showErrorDialog, open: false})}/>
        </div>
    )
}

export default LoginPage