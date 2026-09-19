'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
    ArrowRight,
    CheckCircle2,
    Lock,
    MessageSquare,
    Share2,
    ShieldCheck,
    Sparkles,
    Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
    const { data: session } = useSession();

    const sampleMessages = [
        {
            content: "Loved your recent design breakdown! Really inspired by the attention to typography.",
            time: "2 hours ago",
            tag: "Feedback",
        },
        {
            content: "What's one habit that has had the biggest positive impact on your daily workflow?",
            time: "Yesterday",
            tag: "Question",
        },
        {
            content: "Keep building! The clarity and quiet focus of your work really stands out.",
            time: "3 days ago",
            tag: "Appreciation",
        },
    ];

    const features = [
        {
            icon: Lock,
            title: "Private & Anonymous",
            description:
                "Send and receive thoughts with total privacy. No IP tracking, no sender logs—just pure, honest conversation.",
        },
        {
            icon: Sparkles,
            title: "AI Suggested Prompts",
            description:
                "Need inspiration? Smart AI suggestions generate engaging, open-ended questions tailored for your audience.",
        },
        {
            icon: Share2,
            title: "Custom Shareable Link",
            description:
                "Claim your personal link (/u/username) and easily share it across your social profiles, bio, or team channels.",
        },
        {
            icon: ShieldCheck,
            title: "Total Control",
            description:
                "Toggle message acceptance on or off at any time. Delete or archive feedback directly from your dashboard.",
        },
    ];

    const steps = [
        {
            number: "01",
            title: "Create your space",
            description: "Sign up in seconds and claim your custom feedback username.",
        },
        {
            number: "02",
            title: "Share your link",
            description: "Add your unique profile URL to your bio, social posts, or portfolio.",
        },
        {
            number: "03",
            title: "Receive honest thoughts",
            description: "Read authentic, constructive feedback directly inside your quiet dashboard.",
        },
    ];

    return (
        <div className="relative min-h-screen bg-[#f5f3ef] text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100">
            {/* Header Navigation */}
            <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
                <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between rounded-2xl border border-stone-200/80 bg-[#f9f7f4]/90 px-4 shadow-[0_12px_35px_rgba(28,25,23,0.06)] backdrop-blur-md transition-colors dark:border-stone-800 dark:bg-stone-900/90 dark:shadow-[0_12px_35px_rgba(0,0,0,0.2)] sm:px-6">
                    <Link href="/" className="group flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-xs font-semibold text-white shadow-sm transition-transform group-hover:-rotate-3 dark:bg-stone-100 dark:text-stone-900">
                            TF
                        </span>
                        <span className="text-sm font-semibold tracking-[-0.02em] text-stone-900 dark:text-stone-100">
                            True Feedback
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {session ? (
                            <Link href="/dashboard">
                                <Button className="h-9 rounded-xl bg-stone-900 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200">
                                    Go to Dashboard
                                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/sign-in"
                                    className="hidden text-xs font-semibold text-stone-600 transition-colors hover:text-stone-950 sm:block dark:text-stone-400 dark:hover:text-stone-100"
                                >
                                    Sign in
                                </Link>
                                <Link href="/sign-up">
                                    <Button className="h-9 rounded-xl bg-stone-900 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200">
                                        Get Started
                                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                    </Button>
                                </Link>
                            </>
                        )}
                        <ThemeToggle />
                    </div>
                </nav>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <section className="py-12 lg:py-20">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/80 px-4 py-1.5 text-xs font-medium tracking-[0.14em] text-stone-700 uppercase shadow-sm backdrop-blur dark:border-stone-800 dark:bg-stone-900/80 dark:text-stone-300">
                            <Zap className="h-3.5 w-3.5 text-amber-500" />
                            Honest conversations, without the noise
                        </div>

                        <h1 className="text-4xl font-semibold tracking-[-0.06em] text-stone-900 sm:text-6xl sm:leading-[1.1] dark:text-stone-100">
                            Discover what people really think,{' '}
                            <span className="underline decoration-stone-300 decoration-wavy underline-offset-8 dark:decoration-stone-700">
                                quietly &amp; anonymously.
                            </span>
                        </h1>

                        <p className="mt-6 text-base leading-relaxed text-stone-600 sm:text-lg dark:text-stone-400">
                            Create your personal feedback space in seconds. Receive authentic, constructive thoughts from your community or audience without the noise of public social media.
                        </p>

                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href={session ? '/dashboard' : '/sign-up'} className="w-full sm:w-auto">
                                <Button className="h-12 w-full rounded-2xl bg-stone-900 px-8 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(28,25,23,0.2)] transition-all hover:bg-stone-800 sm:w-auto dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200">
                                    {session ? 'Open Your Dashboard' : 'Create your space free'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href={session ? '/settings/profile' : '/sign-in'} className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    className="h-12 w-full rounded-2xl border-stone-300 bg-white px-8 text-sm font-semibold text-stone-800 transition-colors hover:bg-stone-100 sm:w-auto dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
                                >
                                    {session ? 'Profile Settings' : 'Sign in to existing account'}
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-stone-500 dark:text-stone-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                100% Anonymous
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                Zero identity tracking
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                Free forever for creators
                            </div>
                        </div>
                    </div>
                </section>

                {/* Live Visual Showcase Container */}
                <section className="my-12 overflow-hidden rounded-[32px] border border-stone-200 bg-white p-6 shadow-[0_30px_90px_rgba(28,25,23,0.08)] dark:border-stone-800 dark:bg-stone-900 dark:shadow-[0_30px_90px_rgba(0,0,0,0.3)] sm:p-10">
                    <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                        <div className="lg:col-span-5">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-xl bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                                <MessageSquare className="h-3.5 w-3.5 text-stone-900 dark:text-stone-100" />
                                Dashboard Preview
                            </div>
                            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-stone-900 sm:text-3xl dark:text-stone-100">
                                A clean, quiet home for real thoughts.
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                                Designed with high contrast, calm typography, and dark mode support. Review responses without algorithm manipulation or notification clutter.
                            </p>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-start gap-3 text-xs text-stone-600 dark:text-stone-400">
                                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-900 text-[10px] font-bold text-white dark:bg-stone-100 dark:text-stone-900">
                                        ✓
                                    </span>
                                    <span>Instant real-time message collection</span>
                                </div>
                                <div className="flex items-start gap-3 text-xs text-stone-600 dark:text-stone-400">
                                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-900 text-[10px] font-bold text-white dark:bg-stone-100 dark:text-stone-900">
                                        ✓
                                    </span>
                                    <span>AI prompt generator for fresh inspiration</span>
                                </div>
                                <div className="flex items-start gap-3 text-xs text-stone-600 dark:text-stone-400">
                                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-900 text-[10px] font-bold text-white dark:bg-stone-100 dark:text-stone-900">
                                        ✓
                                    </span>
                                    <span>One-click custom link copying</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive UI Mockup Card */}
                        <div className="relative rounded-2xl border border-stone-200 bg-[#f9f7f4] p-5 shadow-inner lg:col-span-7 dark:border-stone-800 dark:bg-stone-950">
                            <div className="mb-4 flex items-center justify-between border-b border-stone-200 pb-3 dark:border-stone-800">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-red-400" />
                                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                                    <span className="ml-2 text-xs font-mono text-stone-400">truefeedback.app/u/alex</span>
                                </div>
                                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    ● Live
                                </span>
                            </div>

                            <div className="space-y-3">
                                {sampleMessages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition-all hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                                                {msg.tag}
                                            </span>
                                            <span className="text-[11px] text-stone-400">{msg.time}</span>
                                        </div>
                                        <p className="mt-2 text-xs font-medium text-stone-800 dark:text-stone-200">
                                            &ldquo;{msg.content}&rdquo;
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-12 lg:py-16">
                    <div className="mb-12 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                            Built for real connection
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                            Everything you need for authentic feedback
                        </h2>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, idx) => {
                            const IconComponent = feature.icon;
                            return (
                                <div
                                    key={idx}
                                    className="group rounded-[24px] border border-stone-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-stone-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700"
                                >
                                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm transition-transform group-hover:scale-105 dark:bg-stone-100 dark:text-stone-900">
                                        <IconComponent className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-stone-900 dark:text-stone-100">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-2 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Step-by-Step Section */}
                <section className="my-12 rounded-[32px] border border-stone-200 bg-[#f9f7f4] p-8 dark:border-stone-800 dark:bg-stone-900/50 sm:p-12">
                    <div className="mb-10 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                            Simple process
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">How True Feedback works</h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative flex flex-col items-center text-center">
                                <span className="mb-4 text-4xl font-semibold tracking-[-0.06em] text-stone-300 dark:text-stone-700">
                                    {step.number}
                                </span>
                                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                                    {step.title}
                                </h3>
                                <p className="mt-2 max-w-xs text-xs text-stone-600 dark:text-stone-400">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Call to Action Panel (Matching Sign-in Card Design) */}
                <section className="my-12 overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_30px_80px_rgba(28,25,23,0.08)] dark:border-stone-800 dark:bg-stone-900 dark:shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
                    <div className="relative overflow-hidden bg-[#171513] p-8 text-center text-white sm:p-14 lg:p-16">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_28%)]" />

                        <div className="relative z-10 mx-auto max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium tracking-[0.18em] text-stone-200 uppercase">
                                Start in seconds
                            </div>
                            <h2 className="text-3xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
                                Ready for honest, quiet conversations?
                            </h2>
                            <p className="mt-4 text-sm text-stone-300 sm:text-base">
                                Create your account now and share your personal feedback link with your network today.
                            </p>

                            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                                <Link href="/sign-up">
                                    <Button className="h-12 w-full rounded-xl bg-white px-8 text-sm font-semibold text-stone-900 transition-all hover:bg-stone-100 sm:w-auto dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200">
                                        Get Started Free
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/sign-in">
                                    <Button
                                        variant="outline"
                                        className="h-12 w-full rounded-xl border-white/20 bg-white/5 px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-stone-200 bg-[#f9f7f4] py-8 dark:border-stone-800 dark:bg-stone-950">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-stone-900 text-[10px] font-semibold text-white dark:bg-stone-100 dark:text-stone-900">
                            TF
                        </span>
                        <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                            True Feedback &copy; {new Date().getFullYear()}
                        </span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                        Anonymous conversations with privacy and intention.
                    </p>
                </div>
            </footer>
        </div>
    );
}
