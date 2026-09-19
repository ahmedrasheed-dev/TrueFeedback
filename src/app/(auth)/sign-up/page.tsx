'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebounceValue } from 'usehooks-ts';
import { Loader2 } from 'lucide-react';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field';
import { useToast } from '@/components/ui/use-toast';
import { signUpSchema } from '@/schemas/signUpSchema';
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

    useEffect(() => {
        const trimmedUsername = debouncedUsername.trim();

        if (!trimmedUsername) {
            setUsernameCheck({ tone: 'neutral', message: '' });
            return;
        }

        if (trimmedUsername.length < 2) {
            setUsernameCheck({ tone: 'neutral', message: '' });
            return;
        }

        let isMounted = true;
        const controller = new AbortController();

        const checkUsername = async () => {
            setIsCheckingUsername(true);

            try {
                const response = await fetch(
                    `/api/check-username-unique?username=${encodeURIComponent(trimmedUsername)}`,
                    {
                        method: 'GET',
                        signal: controller.signal,
                    }
                );

                const data: ApiResponse = await response.json();

                if (!isMounted) return;

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
                if (!isMounted || (error instanceof DOMException && error.name === 'AbortError')) {
                    return;
                }

                setUsernameCheck({
                    tone: 'error',
                    message: 'Could not check username availability.',
                });
            } finally {
                if (isMounted) {
                    setIsCheckingUsername(false);
                }
            }
        };

        checkUsername();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [debouncedUsername]);

    const usernameStatusClass = useMemo(() => {
        if (usernameCheck.tone === 'success') return 'text-emerald-600';
        if (usernameCheck.tone === 'error') return 'text-red-600';
        return 'text-stone-500';
    }, [usernameCheck.tone]);

    const isUsernameTaken = usernameCheck.tone === 'error' && usernameCheck.message.toLowerCase().includes('taken');
    const isUsernameInvalid = Boolean(form.formState.errors.username) || isUsernameTaken;
    const isSubmitDisabled = isCheckingUsername || isUsernameTaken || form.formState.isSubmitting;

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
        <div className="min-h-screen bg-[#f5f3ef] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_30px_80px_rgba(28,25,23,0.08)] lg:grid-cols-[1.08fr_0.92fr]">
                <div className="relative hidden overflow-hidden bg-[#171513] p-10 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),transparent_28%)]" />
                    <div className="relative z-10">
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium tracking-[0.18em] text-stone-200 uppercase">
                            True Feedback
                        </div>
                        <h2 className="max-w-sm text-4xl font-semibold tracking-[-0.06em] text-white">
                            Start honest conversations with confidence.
                        </h2>
                    </div>

                    <div className="relative z-10 space-y-5">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                            <p className="text-sm text-stone-300">Private by default.</p>
                            <p className="mt-3 text-lg font-semibold tracking-[-0.04em] text-white">Create your space</p>
                            <p className="text-xs uppercase tracking-[0.14em] text-stone-300">Safe, thoughtful, anonymous</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-stone-200">
                            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                            Built for real people and real feedback.
                        </div>
                    </div>
                </div>

                <div className="bg-[#f9f7f4] p-6 sm:p-8 lg:p-10">
                    <div className="mb-8">
                        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-sm font-semibold text-white shadow-sm">
                            TF
                        </div>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500">Join us</p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-stone-900 sm:text-4xl">
                            Create your account
                        </h1>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        <Field>
                            <FieldLabel htmlFor="username" className="text-sm font-medium text-stone-700">
                                Username
                            </FieldLabel>
                            <FieldContent>
                                <div className="relative">
                                    <Input
                                        id="username"
                                        type="text"
                                        autoComplete="username"
                                        placeholder="john123"
                                        {...form.register('username')}
                                        aria-invalid={isUsernameInvalid}
                                        data-invalid={isUsernameInvalid}
                                        className={
                                            isUsernameInvalid
                                                ? 'border-red-500 focus-visible:ring-red-500/30'
                                                : 'border-stone-200 bg-white text-stone-900'
                                        }
                                    />
                                    {isCheckingUsername && (
                                        <Loader2 className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-stone-400" aria-label="Checking username" />
                                    )}
                                </div>
                                <p
                                    className={`flex min-h-5 items-center gap-1.5 text-xs ${isCheckingUsername
                                            ? 'text-stone-500'
                                            : usernameCheck.message
                                                ? usernameStatusClass
                                                : 'text-red-600'
                                        }`}
                                    aria-live="polite"
                                >
                                    {isCheckingUsername ? (
                                        <>
                                            <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                                            Checking username
                                        </>
                                    ) : (
                                        usernameCheck.message || form.formState.errors.username?.message || '\u00a0'
                                    )}
                                </p>
                                <FieldError className="min-h-[1.25rem] text-xs text-red-600">
                                    {form.formState.errors.username?.message}
                                </FieldError>
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="email" className="text-sm font-medium text-stone-700">
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
                                    className={
                                        form.formState.errors.email
                                            ? 'border-red-500 focus-visible:ring-red-500/30'
                                            : 'border-stone-200 bg-white text-stone-900'
                                    }
                                />
                                <p className="text-xs text-stone-500">We’ll send a verification code to confirm your email.</p>
                                <FieldError className="min-h-[1.25rem] text-xs text-red-600">
                                    {form.formState.errors.email?.message}
                                </FieldError>
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password" className="text-sm font-medium text-stone-700">
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
                                    className={
                                        form.formState.errors.password
                                            ? 'border-red-500 focus-visible:ring-red-500/30'
                                            : 'border-stone-200 bg-white text-stone-900'
                                    }
                                />
                                <FieldError className="min-h-[1.25rem] text-xs text-red-600">
                                    {form.formState.errors.password?.message}
                                </FieldError>
                            </FieldContent>
                        </Field>

                        <Button
                            type="submit"
                            className="w-full rounded-xl bg-stone-900 text-sm font-medium text-white shadow-[0_10px_25px_rgba(24,24,27,0.25)] transition-all hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
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

                    <div className="mt-6 border-t border-stone-200 pt-5 text-center text-sm text-stone-600">
                        <p>
                            Already have an account?{' '}
                            <Link href="/sign-in" className="font-semibold text-stone-900 transition-colors hover:text-stone-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}