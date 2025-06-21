import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import UserStatus from '@/components/user-status';
import { NotebookPen } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'GenTracker',
  description: 'Gentracker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className='min-h-screen'>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
          <main className="px-4 py-6">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
