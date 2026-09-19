import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function NotFound() {
    return (
        <main className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#f5f3ef] p-4 text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100 sm:p-6 lg:p-8">
            <div className="absolute top-4 right-4 z-20 sm:top-6 sm:right-6">
                <ThemeToggle />
            </div>

            <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-[0_20px_60px_rgba(28,25,23,0.06)] dark:border-stone-800 dark:bg-stone-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)] lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative hidden overflow-hidden bg-[#171513] p-8 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_28%)]" />
                    <div className="relative z-10">
                        <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.18em] text-stone-200 uppercase">
                            True Feedback
                        </div>
                        <h1 className="max-w-sm text-3xl font-semibold tracking-[-0.06em]">The page you are looking for has moved on.</h1>
                    </div>
                    <p className="relative z-10 max-w-xs text-xs leading-5 text-stone-300">Let&apos;s get you back to a place where honest conversations can continue.</p>
                </div>

                <div className="flex flex-col bg-[#f9f7f4] p-5 dark:bg-stone-900 sm:p-6 lg:p-8">
                    <div className="mb-6">
                        <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-xs font-semibold text-white shadow-sm dark:bg-stone-100 dark:text-stone-900">
                            TF
                        </div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">Page not found</p>
                    </div>

                    <div className="flex flex-1 flex-col justify-center">
                        <p className="text-6xl font-semibold tracking-[-0.08em] text-stone-900 dark:text-stone-100 sm:text-7xl">404</p>
                        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.06em] text-stone-900 dark:text-stone-100 sm:text-3xl">This page does not exist.</h2>
                        <p className="mt-2 max-w-sm text-xs leading-5 text-stone-600 dark:text-stone-400">
                            The link may be outdated, or the page may have been removed. You can return to your dashboard or continue from the homepage.
                        </p>

                        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                            <Link
                                href="/dashboard"
                                className="inline-flex h-10 items-center justify-center rounded-xl bg-stone-900 px-4 text-xs font-medium text-white shadow-[0_10px_25px_rgba(24,24,27,0.25)] transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                            >
                                <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                                Go to dashboard
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex h-10 items-center justify-center rounded-xl border border-stone-200 bg-white px-4 text-xs font-medium text-stone-800 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:bg-stone-800"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                                Return home
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-stone-200 pt-4 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
                        True Feedback keeps the important conversations in view.
                    </div>
                </div>
            </div>
        </main>
    );
}
