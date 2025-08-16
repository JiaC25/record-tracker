import AppHeader from '@/app/app-header';
import { ThemeProvider } from '@/components/app-theme/theme-provider';
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
      <body className="min-h-screen overflow-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Global top bar for all pages */}
          <AppHeader />
          {/* Main page content */}
          <div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
