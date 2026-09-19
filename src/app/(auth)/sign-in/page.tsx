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
                            Honest conversations, without the noise.
                        </h2>
                    </div>

                    <div className="relative z-10 space-y-5">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                            <p className="text-sm text-stone-300">Private thoughts, thoughtfully shared.</p>
                            <p className="mt-3 text-lg font-semibold tracking-[-0.04em] text-white">Built for honest feedback</p>
                            <p className="text-xs uppercase tracking-[0.14em] text-stone-300">Private by default</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-stone-200">
                            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                            Secure, anonymous, and built for real people.
                        </div>
                    </div>
                </div>

                <div className="bg-[#f9f7f4] p-6 sm:p-8 lg:p-10">
                    <div className="mb-8">
                        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-sm font-semibold text-white shadow-sm">
                            TF
                        </div>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500">Welcome back</p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-stone-900 sm:text-4xl">
                            Sign in
                        </h1>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate aria-invalid={Boolean(form.formState.errors.identifier)}>
                        <Field>
                            <FieldLabel htmlFor="identifier" className="text-sm font-medium text-stone-700">
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
                                    className={form.formState.errors.identifier ? 'border-red-500 focus-visible:ring-red-500/30' : 'border-stone-200 bg-white text-stone-900'}
                                />
                                <FieldError className="min-h-[1.25rem] text-xs text-red-600">
                                    {form.formState.errors.identifier?.message}
                                </FieldError>
                            </FieldContent>
                        </Field>

                        <Field>
                            <div className="flex items-center justify-between">
                                <FieldLabel htmlFor="password" className="text-sm font-medium text-stone-700">
                                    Password
                                </FieldLabel>
                                <Link href="/forgot-password" className="text-xs font-medium text-stone-600 transition-colors hover:text-stone-900">
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
                                    className={form.formState.errors.password ? 'border-red-500 focus-visible:ring-red-500/30' : 'border-stone-200 bg-white text-stone-900'}
                                />
                                <FieldError className="min-h-[1.25rem] text-xs text-red-600">
                                    {form.formState.errors.password?.message}
                                </FieldError>
                            </FieldContent>
                        </Field>

                        <Button
                            type="submit"
                            className="w-full rounded-xl bg-stone-900 text-sm font-medium text-white shadow-[0_10px_25px_rgba(24,24,27,0.25)] transition-all hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>

                    <div className="mt-6 border-t border-stone-200 pt-5 text-center text-sm text-stone-600">
                        <p>
                            New here?{' '}
                            <Link href="/sign-up" className="font-semibold text-stone-900 transition-colors hover:text-stone-700">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}