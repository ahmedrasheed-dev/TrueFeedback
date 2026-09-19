'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const themeStorageKey = 'truefeedback-theme';

type Theme = 'light' | 'dark';

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>('light');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');
        setIsMounted(true);
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';

        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
        window.localStorage.setItem(themeStorageKey, nextTheme);
        setTheme(nextTheme);
    };

    if (!isMounted) {
        return (
            <div className="h-9 w-9 rounded-xl border border-stone-200/80 bg-stone-100/50 dark:border-stone-800 dark:bg-stone-900/50" />
        );
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white/80 text-stone-700 shadow-xs backdrop-blur transition-colors hover:bg-stone-100 hover:text-stone-950 dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
        >
            {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
        </button>
    );
}
