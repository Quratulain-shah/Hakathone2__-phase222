'use client';

import { useEffect } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { X, LogOut, CheckSquare } from 'lucide-react';

/**
 * MobileNav component props
 */
interface MobileNavProps {
  /** Whether mobile nav is open */
  isOpen: boolean;

  /** Callback when nav should close */
  onClose: () => void;
}

/**
 * MobileNav component
 * Client Component for mobile hamburger menu with slide-out drawer
 * Shows navigation links and user profile section
 */
export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle logout
  const handleLogout = () => {
    logout();
    onClose();
    router.push('/login');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="text-xl font-bold text-gray-900">Todo App</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 p-4">
          <a
            href="/tasks"
            className="rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={onClose}
          >
            My Tasks
          </a>
        </nav>

        {/* User Profile Section */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 border-t bg-gray-50 p-4">
            {/* User Info */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base font-medium text-white">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {user.email}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
