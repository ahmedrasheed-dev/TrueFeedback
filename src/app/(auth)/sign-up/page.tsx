'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebounceValue } from 'usehooks-ts';
import { Loader2 } from 'lucide-react';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field';
import { useToast } from '@/components/ui/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { signUpSchema, usernameValidation } from '@/schemas/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';

export default function SignUpForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [usernameCheck, setUsernameCheck] = useState<{ tone: 'neutral' | 'success' | 'error'; message: string }>({
        tone: 'neutral',
        message: '',
    });
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    const usernameValue = form.watch('username');
    const [debouncedUsername] = useDebounceValue(usernameValue, 400);
    const usernameField = form.register('username');

    useEffect(() => {
        const parsedUsername = usernameValidation.safeParse(debouncedUsername);

        if (!debouncedUsername) {
            setUsernameCheck({ tone: 'neutral', message: '' });
            setIsCheckingUsername(false);
            return;
        }

        if (!parsedUsername.success) {
            setUsernameCheck({ tone: 'neutral', message: '' });
            setIsCheckingUsername(false);
            return;
        }

        const validUsername = parsedUsername.data;
        let isCurrent = true;

        const checkUsername = async () => {
            setIsCheckingUsername(true);

            try {
                const response = await fetch(
                    `/api/check-username-unique?username=${encodeURIComponent(validUsername)}`,
                    {
                        method: 'GET',
                    }
                );

                const data: ApiResponse = await response.json();

                if (!isCurrent) return;

                if (!response.ok || !data.success) {
                    setUsernameCheck({
                        tone: 'error',
                        message: data.message || 'Unable to validate username right now.',
                    });
                    return;
                }

                const isTaken = data.message.toLowerCase().includes('taken');

                setUsernameCheck({
                    tone: isTaken ? 'error' : 'success',
                    message: data.message,
                });
            } catch (error) {
                if (!isCurrent) return;

                setUsernameCheck({
                    tone: 'error',
                    message: 'Could not check username availability.',
                });
            } finally {
                if (isCurrent) {
                    setIsCheckingUsername(false);
                }
            }
        };

        checkUsername();

        return () => {
            isCurrent = false;
        };
    }, [debouncedUsername]);

    const usernameStatusClass = usernameCheck.tone === 'success'
        ? 'text-emerald-600'
        : usernameCheck.tone === 'error'
            ? 'text-red-600'
            : 'text-stone-500';

    const isUsernameTaken = usernameCheck.tone === 'error' && usernameCheck.message.toLowerCase().includes('taken');
    const isUsernameFormatInvalid = Boolean(usernameValue) && !usernameValidation.safeParse(usernameValue).success;
    const isUsernameInvalid = Boolean(form.formState.errors.username) || isUsernameTaken || isUsernameFormatInvalid;
    const isSubmitDisabled = isCheckingUsername || isUsernameTaken || form.formState.isSubmitting;
    const continueWithGoogle = () => {
        void signIn('google', { callbackUrl: '/dashboard' });
    };

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        try {
            const response = await fetch('/api/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result: ApiResponse = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Sign up failed. Please try again.');
            }

            toast({
                title: 'Account created',
                description: result.message,
            });

            router.replace(`/verify/${encodeURIComponent(data.username)}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Something went wrong while creating your account.';

            toast({
                title: 'Sign up failed',
                description: message,
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#f5f3ef] px-4 py-6 text-stone-900 transition-colors sm:px-6 sm:py-8 lg:px-8 dark:bg-stone-950 dark:text-stone-100">
            <div className="absolute top-4 right-4 z-20 sm:top-6 sm:right-6">
                <ThemeToggle />
            </div>

            <div className="mx-auto my-auto grid w-full max-w-5xl overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-[0_20px_60px_rgba(28,25,23,0.06)] transition-colors dark:border-stone-800 dark:bg-stone-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)] lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative hidden overflow-hidden bg-[#171513] p-8 pb-10 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_28%)]" />
                    <div className="relative z-10">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.18em] text-stone-200 uppercase">
                            True Feedback
                        </div>
                        <h2 className="max-w-sm text-3xl font-semibold tracking-[-0.06em] text-white">
                            Start honest conversations with confidence.
                        </h2>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                            <p className="text-xs text-stone-300">Private by default.</p>
                            <p className="mt-2 text-base font-semibold tracking-[-0.04em] text-white">Create your space</p>
                            <p className="text-[11px] uppercase tracking-[0.14em] text-stone-300">Safe, thoughtful, anonymous</p>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-stone-200">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                            Built for real people and real feedback.
                        </div>
                    </div>
                </div>

                <div className="flex flex-col bg-[#f9f7f4] p-5 pb-7 transition-colors sm:p-6 sm:pb-8 lg:p-8 lg:pb-9 dark:bg-stone-900">
                    <div className="mb-4 sm:mb-5">
                        <div className="mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-xs font-semibold text-white shadow-sm dark:bg-stone-100 dark:text-stone-900">
                            TF
                        </div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">Join us</p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.06em] text-stone-900 sm:text-3xl dark:text-stone-100">
                            Create your account
                        </h1>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5 sm:space-y-3" noValidate>
                        <Field>
                            <FieldLabel htmlFor="username" className="text-xs font-medium text-stone-700 dark:text-stone-300">
                                Username
                            </FieldLabel>
                            <FieldContent>
                                <div className="relative">
                                    <Input
                                        id="username"
                                        type="text"
                                        autoComplete="username"
                                        placeholder="john123"
                                        {...usernameField}
                                        onChange={(event) => {
                                            event.target.value = event.target.value.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20);
                                            void usernameField.onChange(event);
                                        }}
                                        aria-invalid={isUsernameInvalid}
                                        data-invalid={isUsernameInvalid}
                                        className={`h-9.5 ${isUsernameInvalid
                                            ? 'border-red-500 focus-visible:ring-red-500/30'
                                            : 'border-stone-200 bg-white text-stone-900 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100'
                                            }`}
                                    />
                                    {isCheckingUsername && (
                                        <Loader2 className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-stone-400" aria-label="Checking username" />
                                    )}
                                </div>
                                {(isCheckingUsername || usernameCheck.message) && (
                                    <p
                                        className={`mt-1 flex items-center gap-1.5 text-xs ${isCheckingUsername
                                            ? 'text-stone-500'
                                            : usernameStatusClass
                                            }`}
                                        aria-live="polite"
                                    >
                                        {isCheckingUsername ? (
                                            <>
                                                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                                                Checking username
                                            </>
                                        ) : (
                                            usernameCheck.message
                                        )}
                                    </p>
                                )}
                                {form.formState.errors.username?.message && (
                                    <FieldError className="mt-1 text-xs text-red-600">
                                        {form.formState.errors.username.message}
                                    </FieldError>
                                )}
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="email" className="text-xs font-medium text-stone-700 dark:text-stone-300">
                                Email
                            </FieldLabel>
                            <FieldContent>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    {...form.register('email')}
                                    aria-invalid={Boolean(form.formState.errors.email)}
                                    data-invalid={Boolean(form.formState.errors.email)}
                                    className={`h-9.5 ${form.formState.errors.email
                                        ? 'border-red-500 focus-visible:ring-red-500/30'
                                        : 'border-stone-200 bg-white text-stone-900 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100'
                                        }`}
                                />
                                {form.formState.errors.email?.message && (
                                    <FieldError className="mt-1 text-xs text-red-600">
                                        {form.formState.errors.email.message}
                                    </FieldError>
                                )}
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password" className="text-xs font-medium text-stone-700 dark:text-stone-300">
                                Password
                            </FieldLabel>
                            <FieldContent>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Create a secure password"
                                    {...form.register('password')}
                                    aria-invalid={Boolean(form.formState.errors.password)}
                                    data-invalid={Boolean(form.formState.errors.password)}
                                    className={`h-9.5 ${form.formState.errors.password
                                        ? 'border-red-500 focus-visible:ring-red-500/30'
                                        : 'border-stone-200 bg-white text-stone-900 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100'
                                        }`}
                                />
                                {form.formState.errors.password?.message && (
                                    <FieldError className="mt-1 text-xs text-red-600">
                                        {form.formState.errors.password.message}
                                    </FieldError>
                                )}
                            </FieldContent>
                        </Field>

                        <Button
                            type="submit"
                            className="mt-1 h-9.5 w-full rounded-xl bg-stone-900 text-xs font-medium text-white shadow-[0_10px_25px_rgba(24,24,27,0.25)] transition-all hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                            disabled={isSubmitDisabled}
                        >
                            {form.formState.isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create account'
                            )}
                        </Button>
                    </form>

                    <div className="my-2.5 flex items-center gap-3 text-[11px] text-stone-400 dark:text-stone-500">
                        <span className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
                        <span>OR CONTINUE WITH</span>
                        <span className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={continueWithGoogle}
                        className="h-9.5 w-full rounded-xl border-stone-200 bg-white text-xs font-medium text-stone-800 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:bg-stone-800"
                    >
                        <img src="/google.svg" alt="" className="mr-2 h-4 w-4" aria-hidden="true" />
                        Continue with Google
                    </Button>

                    <div className="mt-3 border-t border-stone-200 pt-3 text-center text-xs text-stone-600 dark:border-stone-800 dark:text-stone-400">
                        <p>
                            Already have an account?{' '}
                            <Link href="/sign-in" className="font-semibold text-stone-900 transition-colors hover:text-stone-700 dark:text-stone-100 dark:hover:text-stone-300">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}