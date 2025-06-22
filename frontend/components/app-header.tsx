import { NotebookPen } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from './app-theme/theme-toggle'
import UserStatus from './user-status'

const AppHeader = () => {
    return (
        <div className="flex items-center justify-between px-4 py-3 border-b">
            <h1 className="text-2xl font-semibold">
                <Link href="/" className='flex items-center'>
                    <NotebookPen className="mx-1 text-primary" />
                    <span className="text-primary">Gen</span>
                    <span>Tracker</span>
                </Link>
            </h1>
            <div className="flex items-center space-x-4 mr-5">
                <ThemeToggle />
                <UserStatus />
            </div>
        </div>
    )
}

export default AppHeader