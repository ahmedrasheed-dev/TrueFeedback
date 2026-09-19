'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { getSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { signInSchema } from '@/schemas/signInSchema';

export default function SignInForm() {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        if (result?.error) {
            if (result.error === 'CredentialsSignin') {
                toast({
                    title: 'Login failed',
                    description: 'Incorrect username or password.',
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Error',
                    description: result.error,
                    variant: 'destructive',
                });
            }
            return;
        }

        if (result?.ok) {
            const session = await getSession();

            if (session?.user) {
                router.replace('/dashboard');
                router.refresh();
                return;
            }

            window.location.href = '/dashboard';
        }
    };

    const isSubmitting = form.formState.isSubmitting;
    const continueWithGoogle = () => {
        void signIn('google', { callbackUrl: '/dashboard' });
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
                            Honest conversations, without the noise.
                        </h2>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                            <p className="text-xs text-stone-300">Private thoughts, thoughtfully shared.</p>
                            <p className="mt-2 text-base font-semibold tracking-[-0.04em] text-white">Built for honest feedback</p>
                            <p className="text-[11px] uppercase tracking-[0.14em] text-stone-300">Private by default</p>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-stone-200">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                            Secure, anonymous, and built for real people.
                        </div>
                    </div>
                </div>

                <div className="flex flex-col bg-[#f9f7f4] p-5 pb-7 transition-colors sm:p-6 sm:pb-8 lg:p-8 lg:pb-9 dark:bg-stone-900">
                    <div className="mb-4 sm:mb-5">
                        <div className="mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-xs font-semibold text-white shadow-sm dark:bg-stone-100 dark:text-stone-900">
                            TF
                        </div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">Welcome back</p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.06em] text-stone-900 sm:text-3xl dark:text-stone-100">
                            Sign in
                        </h1>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4" noValidate aria-invalid={Boolean(form.formState.errors.identifier)}>
                        <Field>
                            <FieldLabel htmlFor="identifier" className="text-xs font-medium text-stone-700 dark:text-stone-300">
                                Email or username
                            </FieldLabel>
                            <FieldContent>
                                <Input
                                    id="identifier"
                                    type="text"
                                    autoComplete="username"
                                    placeholder="you@example.com or username"
                                    {...form.register('identifier')}
                                    aria-invalid={Boolean(form.formState.errors.identifier)}
                                    data-invalid={Boolean(form.formState.errors.identifier)}
                                    className={`h-9.5 ${form.formState.errors.identifier ? 'border-red-500 focus-visible:ring-red-500/30' : 'border-stone-200 bg-white text-stone-900 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100'}`}
                                />
                                {form.formState.errors.identifier?.message && (
                                    <FieldError className="mt-1 text-xs text-red-600">
                                        {form.formState.errors.identifier.message}
                                    </FieldError>
                                )}
                            </FieldContent>
                        </Field>

                        <Field>
                            <div className="flex items-center justify-between">
                                <FieldLabel htmlFor="password" className="text-xs font-medium text-stone-700 dark:text-stone-300">
                                    Password
                                </FieldLabel>
                                <Link href="/forgot-password" className="text-xs font-medium text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100">
                                    Forgot password?
                                </Link>
                            </div>
                            <FieldContent>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    {...form.register('password')}
                                    aria-invalid={Boolean(form.formState.errors.password)}
                                    data-invalid={Boolean(form.formState.errors.password)}
                                    className={`h-9.5 ${form.formState.errors.password ? 'border-red-500 focus-visible:ring-red-500/30' : 'border-stone-200 bg-white text-stone-900 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100'}`}
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
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>

                    <div className="my-3 flex items-center gap-3 text-[11px] text-stone-400 dark:text-stone-500">
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

                    <div className="mt-4 border-t border-stone-200 pt-3 text-center text-xs text-stone-600 dark:border-stone-800 dark:text-stone-400">
                        <p>
                            New here?{' '}
                            <Link href="/sign-up" className="font-semibold text-stone-900 transition-colors hover:text-stone-700 dark:text-stone-100 dark:hover:text-stone-300">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
    