import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
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
          <div className="flex items-center justify-between bg-accent text-accent-foreground">
            <h1 className="text-3xl font-bold py-3 pl-5">GenTracker</h1>
            <div className="mr-10"><ThemeToggle /></div>
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
