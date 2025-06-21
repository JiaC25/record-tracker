import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
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
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex items-center justify-between bg-secondary text-secondary-foreground">
            <h1 className="text-2xl font-bold py-3 pl-5">GenTracker</h1>
            <div className="mr-10"><ThemeToggle /></div>
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
