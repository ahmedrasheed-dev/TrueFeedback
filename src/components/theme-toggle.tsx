'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const themeStorageKey = 'truefeedback-theme';

type Theme = 'light' | 'dark';

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>('light');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const savedTheme = window.localStorage.getItem(themeStorageKey) as Theme | null;
        const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const nextTheme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : preferredTheme;

        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
        setTheme(nextTheme);
        setIsMounted(true);
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';

        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
        window.localStorage.setItem(themeStorageKey, nextTheme);
        setTheme(nextTheme);
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            disabled={!isMounted}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-700 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-stone-950 disabled:cursor-default disabled:opacity-0 dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
        >
            {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
        </button>
    );
}
