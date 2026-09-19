'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, KeyRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field';
import { useToast } from '@/components/ui/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { forgotPasswordSchema } from '@/schemas/forgotPasswordSchema';
import { ApiResponse } from '@/types/ApiResponse';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result: ApiResponse = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to send reset code.');
            }

            toast({
                title: 'Reset code sent!',
                description: result.message || 'Check your email inbox for your verification code.',
            });

            router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
        }
    };

    const isSubmitting = form.formState.isSubmitting;

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#f5f3ef] px-4 py-6 text-stone-900 transition-colors sm:px-6 sm:py-8 lg:px-8 dark:bg-stone-950 dark:text-stone-100">
            <div className="absolute top-4 right-4 z-20 sm:top-6 sm:right-6">
                <ThemeToggle />
            </div>

            <div className="mx-auto my-auto grid w-full max-w-5xl overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-[0_20px_60px_rgba(28,25,23,0.06)] transition-colors dark:border-stone-800 dark:bg-stone-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)] lg:grid-cols-[1.05fr_0.95fr]">
                {/* Left Side Info Panel */}
                <div className="relative hidden overflow-hidden bg-[#171513] p-8 pb-10 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_28%)]" />
                    <div className="relative z-10">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.18em] text-stone-200 uppercase">
                            True Feedback
                        </div>
                        <h2 className="max-w-sm text-3xl font-semibold tracking-[-0.06em] text-white">
                            Account recovery made simple and secure.
                        </h2>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                            <p className="text-xs text-stone-300">Quick &amp; Safe</p>
                            <p className="mt-2 text-base font-semibold tracking-[-0.04em] text-white">6-digit Reset Code</p>
                            <p className="text-[11px] uppercase tracking-[0.14em] text-stone-300">Sent directly to your inbox</p>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-stone-200">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                            Verify code and choose a new password in seconds.
                        </div>
                    </div>
                </div>

                {/* Right Side Form Panel */}
                <div className="flex flex-col bg-[#f9f7f4] p-5 pb-7 transition-colors sm:p-6 sm:pb-8 lg:p-8 lg:pb-9 dark:bg-stone-900">
                    <div className="mb-4 sm:mb-5">
                        <div className="mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-xs font-semibold text-white shadow-sm dark:bg-stone-100 dark:text-stone-900">
                            <KeyRound className="h-4 w-4" />
                        </div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">Password recovery</p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.06em] text-stone-900 sm:text-3xl dark:text-stone-100">
                            Forgot password?
                        </h1>
                        <p className="mt-2 text-xs text-stone-600 dark:text-stone-400">
                            Enter your email address and we will send you a 6-digit verification code to reset your password.
                        </p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4" noValidate>
                        <Field>
                            <FieldLabel htmlFor="email" className="text-xs font-medium text-stone-700 dark:text-stone-300">
                                Email address
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
                                    className={`h-10 ${form.formState.errors.email ? 'border-red-500 focus-visible:ring-red-500/30' : 'border-stone-200 bg-white text-stone-900 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100'}`}
                                />
                                {form.formState.errors.email?.message && (
                                    <FieldError className="mt-1 text-xs text-red-600">
                                        {form.formState.errors.email.message}
                                    </FieldError>
                                )}
                            </FieldContent>
                        </Field>

                        <Button
                            type="submit"
                            className="mt-1 h-10 w-full rounded-xl bg-stone-900 text-xs font-medium text-white shadow-[0_10px_25px_rgba(24,24,27,0.25)] transition-all hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending code...
                                </>
                            ) : (
                                'Send reset code'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 border-t border-stone-200 pt-4 text-center text-xs text-stone-600 dark:border-stone-800 dark:text-stone-400">
                        <Link href="/sign-in" className="inline-flex items-center gap-1.5 font-semibold text-stone-900 transition-colors hover:text-stone-700 dark:text-stone-100 dark:hover:text-stone-300">
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
