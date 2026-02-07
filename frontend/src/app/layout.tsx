import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/auth/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App - Manage Your Tasks',
  description: 'A modern task management application built with Next.js 14',
  icons: {
    icon: '/favicon.svg',
  },
};

/**
 * Root layout component
 * Server Component that wraps the entire application
 * Provides context providers for auth, tasks, and toast notifications
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <AuthProvider>
            <TaskProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </TaskProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
