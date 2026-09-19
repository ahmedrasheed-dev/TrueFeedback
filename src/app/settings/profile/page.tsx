'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { usernameValidation } from '@/schemas/signUpSchema';

export default function ProfileSettingsPage() {
    const router = useRouter();
    const { data: session, status, update } = useSession();
    const { toast } = useToast();
    const [username, setUsername] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (session?.user?.username) {
            setUsername(session.user.username);
        }
    }, [session?.user?.username]);

    const saveUsername = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const parsed = usernameValidation.safeParse(username.trim());

        if (!parsed.success) {
            toast({ title: 'Invalid username', description: parsed.error.issues[0].message, variant: 'destructive' });
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('/api/profile/username', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: parsed.data }),
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Could not update username.');
            }

            await update({ username: parsed.data });
            toast({ title: 'Profile updated', description: 'Your username has been updated.' });
            router.refresh();
        } catch (error) {
            toast({
                title: 'Update failed',
                description: error instanceof Error ? error.message : 'Could not update username.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (status === 'loading') {
        return <div className="min-h-screen bg-[#f5f3ef]" />;
    }

    if (status === 'unauthenticated') {
        router.replace('/sign-in');
        return null;
    }

    return (
        <main className="min-h-screen bg-[#f5f3ef] px-4 py-6 text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
                <div className="mb-10 flex items-center justify-between">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-100">
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        Back to dashboard
                    </Link>
                    <ThemeToggle />
                </div>

                <section className="rounded-[28px] border border-stone-200 bg-[#f9f7f4] p-6 shadow-[0_30px_80px_rgba(28,25,23,0.08)] dark:border-stone-800 dark:bg-stone-900 dark:shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:p-10">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">Profile settings</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-[-0.06em]">Make your profile yours.</h1>
                    <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">Your Google-generated username can be changed at any time.</p>

                    <form onSubmit={saveUsername} className="mt-10 space-y-4">
                        <label htmlFor="username" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                            Username
                        </label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            autoComplete="username"
                            className="border-stone-200 bg-white text-stone-900 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                        />
                        <p className="text-xs text-stone-500 dark:text-stone-400">Use 2-20 letters, numbers, or underscores.</p>
                        <Button type="submit" disabled={isSaving} className="mt-3 rounded-xl bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200">
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                            Save username
                        </Button>
                    </form>
                </section>
            </div>
        </main>
    );
}
