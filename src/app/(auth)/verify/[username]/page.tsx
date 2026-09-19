'use client';

import { type ClipboardEvent, type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';

const codeLength = 6;

export default function VerifyPage() {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { data: session, status } = useSession();
    const { toast } = useToast();
    const [code, setCode] = useState<string[]>(Array(codeLength).fill(''));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        if (status === 'authenticated' && session.user.isVerified) {
            router.replace('/dashboard');
        }
    }, [router, session?.user.isVerified, status]);

    const username = decodeURIComponent(params.username);

    const updateDigit = (index: number, value: string) => {
        const digit = value.replace(/\D/g, '').slice(-1);
        const nextCode = [...code];
        nextCode[index] = digit;
        setCode(nextCode);

        if (digit && index < codeLength - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pastedCode = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, codeLength);
        if (!pastedCode) return;

        const nextCode = Array(codeLength).fill('');
        pastedCode.split('').forEach((digit, index) => {
            nextCode[index] = digit;
        });
        setCode(nextCode);
        inputRefs.current[Math.min(pastedCode.length, codeLength) - 1]?.focus();
    };

    const submitCode = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const verificationCode = code.join('');
        const parsedCode = verifySchema.safeParse({ code: verificationCode });

        if (!parsedCode.success) {
            toast({ title: 'Invalid code', description: parsedCode.error.issues[0].message, variant: 'destructive' });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: params.username, code: parsedCode.data.code }),
            });
            const result: ApiResponse = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Verification failed.');
            }

            toast({ title: 'Email verified', description: 'Your account is ready. Sign in to continue.' });
            router.replace('/sign-in');
        } catch (error) {
            toast({
                title: 'Verification failed',
                description: error instanceof Error ? error.message : 'Could not verify your account.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f5f3ef] px-4 py-10 text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100 sm:px-6 lg:px-8">
            <div className="mx-auto grid min-h-180 max-w-5xl overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_30px_80px_rgba(28,25,23,0.08)] dark:border-stone-800 dark:bg-stone-900 dark:shadow-[0_30px_80px_rgba(0,0,0,0.3)] lg:grid-cols-[1.08fr_0.92fr]">
                <div className="relative hidden overflow-hidden bg-[#171513] p-10 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_28%)]" />
                    <div className="relative z-10">
                        <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium tracking-[0.18em] text-stone-200 uppercase">
                            True Feedback
                        </div>
                        <h1 className="max-w-sm text-4xl font-semibold tracking-[-0.06em]">One small step toward honest conversations.</h1>
                    </div>
                    <p className="relative z-10 text-sm text-stone-300">Your verification code keeps your account secure.</p>
                </div>

                <div className="flex flex-col bg-[#f9f7f4] p-6 dark:bg-stone-900 sm:p-8 lg:p-10">
                    <div className="mb-10">
                        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-sm font-semibold text-white dark:bg-stone-100 dark:text-stone-900">TF</div>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">Verify your email</p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-stone-900 dark:text-stone-100 sm:text-4xl">Enter your code</h2>
                        <p className="mt-4 max-w-sm text-sm leading-6 text-stone-600 dark:text-stone-400">
                            We sent a six-digit code to the email address connected to <span className="font-semibold text-stone-900 dark:text-stone-200">@{username}</span>.
                        </p>
                    </div>

                    <form onSubmit={submitCode} className="flex flex-1 flex-col" noValidate>
                        <div className="flex justify-between gap-2 sm:gap-3" aria-label="Six digit verification code">
                            {code.map((digit, index) => (
                                <Input
                                    key={index}
                                    ref={(element) => { inputRefs.current[index] = element; }}
                                    value={digit}
                                    inputMode="numeric"
                                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                                    maxLength={1}
                                    aria-label={`Verification digit ${index + 1}`}
                                    onChange={(event) => updateDigit(index, event.target.value)}
                                    onKeyDown={(event) => handleKeyDown(index, event)}
                                    onPaste={handlePaste}
                                    className="h-14 w-full rounded-xl border-stone-200 bg-white text-center text-xl font-semibold text-stone-900 shadow-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                />
                            ))}
                        </div>

                        <Button type="submit" disabled={isSubmitting || code.some((digit) => !digit)} className="mt-8 h-11 w-full rounded-xl bg-stone-900 text-sm font-medium text-white shadow-[0_10px_25px_rgba(24,24,27,0.25)] hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                            {isSubmitting ? 'Verifying...' : 'Verify email'}
                        </Button>

                        <div className="mt-auto border-t border-stone-200 pt-5 dark:border-stone-800">
                            <Link href="/sign-up" className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-100">
                                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                                Back to sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
