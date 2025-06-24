'use client'

import { cn } from '@/lib/utils'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const ThemeToggleInline = () => {
    const { theme, setTheme } = useTheme()
    const isDark = theme === 'dark'
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null;
    }

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark')
    }

    return (
        <div className="flex items-center justify-center">
            {/* Custom Toggle Switch */}
            <button onClick={toggleTheme}
                className="inline-flex bg-accent h-6 w-11 items-center rounded-full border duration-300 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-background leading-4">
                {/* Toggle Circle */}
                <span
                    className={cn(
                        'inline-block h-5 w-5 transform rounded-full transition-all duration-300 ease-in-out bg-background',
                        isDark ? 'translate-x-5 ml-0.5' : 'translate-x-0.5 ml-0',
                    )}
                >
                    {/* Icon Container */}
                    <span className="flex h-full w-full items-center justify-center">
                        {isDark ? (
                            <Moon className="!h-2.5 !w-2.5 transition-all duration-300" />
                        ) : (
                            <Sun className="!h-2.5 !w-2.5 transition-all duration-300" />
                        )}
                    </span>
                </span>
            </button>
        </div>
    )
}

export default ThemeToggleInline