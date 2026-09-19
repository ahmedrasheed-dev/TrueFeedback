'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ArrowRight, LogOut, Settings2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

function Navbar() {
    const { data: session } = useSession();
    const username = session?.user?.username || session?.user?.email?.split('@')[0] || 'there';

    return (
        <nav className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between rounded-2xl border border-stone-200/80 bg-[#f9f7f4]/90 px-4 shadow-[0_12px_35px_rgba(28,25,23,0.06)] backdrop-blur-md transition-colors dark:border-stone-800 dark:bg-stone-900/90 dark:shadow-[0_12px_35px_rgba(0,0,0,0.2)] sm:px-5">
                <Link href="/" className="group flex items-center gap-3" aria-label="True Feedback dashboard">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-xs font-semibold text-white shadow-sm transition-transform group-hover:-rotate-3 dark:bg-stone-100 dark:text-stone-900">
                        TF
                    </span>
                    <span className="hidden text-sm font-semibold tracking-[-0.02em] text-stone-900 sm:block dark:text-stone-100">
                        True Feedback
                    </span>
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    {session ? (
                        <>
                            <Link href="/dashboard" className="hidden text-sm font-medium text-stone-600 transition-colors hover:text-stone-950 sm:block dark:text-stone-400 dark:hover:text-stone-100">
                                Dashboard
                            </Link>
                            <div className="hidden h-5 w-px bg-stone-200 sm:block dark:bg-stone-800" />
                            <Link href="/settings/profile" className="flex max-w-36 items-center gap-2 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-stone-100 dark:hover:bg-stone-800">
                                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-200 text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-200">
                                    {username.charAt(0).toUpperCase()}
                                </span>
                                <span className="hidden truncate text-sm font-medium text-stone-700 md:block dark:text-stone-200">{username}</span>
                                <Settings2 className="hidden h-3.5 w-3.5 text-stone-400 md:block" aria-hidden="true" />
                            </Link>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => void signOut({ callbackUrl: '/sign-in' })}
                                className="h-9 rounded-xl border-stone-200 bg-transparent px-3 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                            >
                                <LogOut className="h-3.5 w-3.5 sm:mr-1.5" aria-hidden="true" />
                                <span className="hidden sm:inline">Log out</span>
                            </Button>
                        </>
                    ) : (
                        <Link href="/sign-in">
                            <Button className="h-9 rounded-xl bg-stone-900 px-4 text-xs font-semibold text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200">
                                Sign in
                                <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
                            </Button>
                        </Link>
                    )}

                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}


export default Navbar;