import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import UserStatus from '@/components/user-status';
import type { Metadata } from 'next';
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
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h1 className="text-xl font-semibold">
              <span className="text-primary">Gen</span>
              <span>Tracker</span>
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
