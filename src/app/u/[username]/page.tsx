'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field';
import { useToast } from '@/components/ui/use-toast';
import { messageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';

const initialSuggestions = [
    "What's a piece of advice that truly changed your perspective on life?",
    "If you could master any skill overnight, what would you choose?",
    "What's something you're working on right now that you're proud of?",
];

export default function SendMessagePage() {
    const params = useParams<{ username: string }>();
    const username = params?.username || 'user';
    const { toast } = useToast();

    const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions);
    const [isSuggestLoading, setIsSuggestLoading] = useState(false);

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: '',
        },
    });

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, reset } = form;

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        try {
            const response = await fetch('/api/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    content: data.content,
                }),
            });

            const result: ApiResponse = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to send message.');
            }

            toast({
                title: 'Message Sent!',
                description: result.message || 'Your feedback has been delivered anonymously.',
            });

            reset();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Could not send message right now.';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
        }
    };

    const handleFetchSuggestions = async () => {
        setIsSuggestLoading(true);
        try {
            const response = await fetch('/api/suggest-messages', { method: 'POST' });
            if (!response.ok) throw new Error('Failed to fetch suggestions.');

            const reader = response.body?.getReader();
            if (!reader) return;

            const decoder = new TextDecoder();
            let result = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                result += decoder.decode(value, { stream: true });
            }

            if (result.includes('||')) {
                const parsed = result.split('||').map((s) => s.trim()).filter(Boolean);
                if (parsed.length > 0) setSuggestions(parsed);
            }
        } catch {
            toast({
                title: 'Note',
                description: 'Using standard suggested questions.',
            });
        } finally {
            setIsSuggestLoading(false);
        }
    };

    const handleSelectSuggestion = (suggestion: string) => {
        setValue('content', suggestion, { shouldValidate: true });
    };

    return (
        <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#f5f3ef] px-4 py-4 text-stone-900 transition-colors sm:px-6 sm:py-6 lg:px-8 dark:bg-stone-950 dark:text-stone-100">
            <div className="absolute top-4 right-4 z-20 sm:top-6 sm:right-6">
                <ThemeToggle />
            </div>

            <div className="mx-auto my-auto grid w-full max-w-5xl overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-[0_20px_60px_rgba(28,25,23,0.06)] transition-colors dark:border-stone-800 dark:bg-stone-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)] lg:grid-cols-[1.05fr_0.95fr]">
                {/* Left Side Info Panel */}
                <div className="relative hidden overflow-hidden bg-[#171513] p-6 pb-8 text-white lg:flex lg:flex-col lg:justify-between lg:p-8 lg:pb-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_28%)]" />
                    <div className="relative z-10">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.18em] text-stone-200 uppercase">
                            True Feedback
                        </div>
                        <h2 className="max-w-sm text-3xl font-semibold tracking-[-0.06em] text-white">
                            Send honest, anonymous feedback to @{username}.
                        </h2>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                            <p className="text-xs text-stone-300">100% Anonymous</p>
                            <p className="mt-2 text-base font-semibold tracking-[-0.04em] text-white">Safe &amp; Thoughtful</p>
                            <p className="text-[11px] uppercase tracking-[0.14em] text-stone-300">No identity logged</p>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-stone-200">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                            Your message will appear directly on @{username}&apos;s dashboard.
                        </div>
                    </div>
                </div>

                {/* Right Side Form Panel */}
                <div className="flex flex-col bg-[#f9f7f4] p-5 pb-6 transition-colors sm:p-6 sm:pb-7 lg:p-7 lg:pb-8 dark:bg-stone-900">
                    <div className="mb-3.5 sm:mb-4">
                        <div className="mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-xs font-semibold text-white shadow-sm dark:bg-stone-100 dark:text-stone-900">
                            TF
                        </div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">Public feedback</p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.06em] text-stone-900 sm:text-3xl dark:text-stone-100">
                            Send a message
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
                        <Field>
                            <FieldLabel htmlFor="content" className="text-xs font-medium text-stone-700 dark:text-stone-300">
                                Feedback for @{username}
                            </FieldLabel>
                            <FieldContent>
                                <textarea
                                    id="content"
                                    rows={3}
                                    placeholder="Write your anonymous feedback here..."
                                    {...register('content')}
                                    aria-invalid={Boolean(errors.content)}
                                    className={`w-full rounded-xl border p-3 text-xs outline-none transition-colors ${errors.content
                                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                                            : 'border-stone-200 bg-white text-stone-900 focus:border-stone-400 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-500'
                                        }`}
                                />
                                {errors.content?.message && (
                                    <FieldError className="mt-1 text-xs text-red-600">
                                        {errors.content.message}
                                    </FieldError>
                                )}
                            </FieldContent>
                        </Field>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-9.5 w-full rounded-xl bg-stone-900 text-xs font-medium text-white shadow-[0_10px_25px_rgba(24,24,27,0.25)] transition-all hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-3.5 w-3.5" />
                                    Send message anonymously
                                </>
                            )}
                        </Button>
                    </form>

                    {/* AI Suggestions section */}
                    <div className="mt-3.5 border-t border-stone-200 pt-3 dark:border-stone-800">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                                Suggested questions
                            </p>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleFetchSuggestions}
                                disabled={isSuggestLoading}
                                className="h-7 px-2 text-[11px] text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                            >
                                {isSuggestLoading ? (
                                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                ) : (
                                    <Sparkles className="mr-1 h-3 w-3 text-amber-500" />
                                )}
                                Refresh
                            </Button>
                        </div>
                        <div className="space-y-1.5">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleSelectSuggestion(suggestion)}
                                    className="w-full rounded-xl border border-stone-200 bg-white p-2.5 text-left text-xs text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-300 dark:hover:border-stone-700 dark:hover:bg-stone-900/50"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-3 border-t border-stone-200 pt-3 text-center text-xs text-stone-600 dark:border-stone-800 dark:text-stone-400">
                        <p>
                            Want your own feedback link?{' '}
                            <Link href="/sign-up" className="font-semibold text-stone-900 transition-colors hover:text-stone-700 dark:text-stone-100 dark:hover:text-stone-300">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
