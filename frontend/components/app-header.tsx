import { NotebookPen } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from './app-theme/theme-toggle'
import { Button } from './ui/button'
import UserStatus from './user-status'

const AppHeader = () => {
    return (
        <header className="flex h-[--header-height] shrink-0 items-center gap-2 border-b px-4">
            <div className="flex w-full h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className='flex items-center gap-1'>
                        <NotebookPen className="mx-1 text-primary" />
                        <div className='font-semibold text-2xl'>
                            <span className="text-primary">Gen</span>
                            <span>Tracker</span>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/records">Records</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/">Analytic</Link>
                        </Button>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <UserStatus />
                </div>
            </div>
        </header>
    )
}

export default AppHeader