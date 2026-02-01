'use client';

import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeToggleInline = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = (resolvedTheme ?? 'light') === 'dark';
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center justify-center">
      {/* Custom Toggle Switch */}
      <button onClick={toggleTheme}
        className="inline-flex bg-accent h-5 w-9 items-center rounded-full border hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-background leading-4">
        {/* Toggle Circle */}
        <span
          className={cn(
            'inline-block bg-background h-4 w-4 rounded-full !transition-transform duration-300',
            isDark ? 'translate-x-4 ml-[1px]' : 'translate-x-0.5 -ml-[1px]',
          )}
        >
          {/* Icon Container */}
          <span className="flex h-full w-full items-center justify-center">
            {isDark ? (
              <Moon className="!h-2.5 !w-2.5" />
            ) : (
              <Sun className="!h-2.5 !w-2.5" />
            )}
          </span>
        </span>
      </button>
    </div>
  );
};

export default ThemeToggleInline;