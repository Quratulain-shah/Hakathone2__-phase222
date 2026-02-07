'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { MobileNav } from './MobileNav';
import { LogOut, Target, Menu, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

/**
 * Luxury Header component with premium animations
 * Features floating logo, luxury gradients, and smooth transitions
 */
export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    // Floating logo animation
    gsap.to('.logo-icon', {
      y: -5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Sparkle animation
    gsap.to('.header-sparkle', {
      scale: 1.2,
      opacity: 0.7,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);

  if (!user) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b-2 border-amber-200/30 shadow-xl">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger Menu (Mobile only) */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="rounded-xl p-2 text-gray-700 transition-all hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 focus:outline-none focus:ring-2 focus:ring-amber-500 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Luxury Logo and Title */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/tasks')}>
              <div className="relative">
                <div className="absolute inset-0 luxury-gradient opacity-20 rounded-2xl blur-lg"></div>
                <div className="relative w-12 h-12 luxury-gradient rounded-2xl flex items-center justify-center shadow-xl logo-icon">
                  <Target className="h-7 w-7 text-white" aria-hidden="true" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold luxury-heading flex items-center gap-2">
                  TaskFlow
                  <Sparkles className="w-5 h-5 text-amber-600 header-sparkle" />
                </h1>
                <p className="text-xs text-gray-600 luxury-text-small">Premium Todoapp</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-3">
            <a
              href="/tasks"
              className="text-sm font-semibold text-gray-700 transition-all hover:text-amber-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-xl px-4 py-2 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50"
            >
              My Tasks
            </a>
          </nav>

          {/* Desktop: User Info and Logout */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {/* User Avatar and Email */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl luxury-gradient text-sm font-bold text-white shadow-lg">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-semibold text-gray-800">
                {user.email}
              </span>
            </div>

            {/* Luxury Logout Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="luxury-gradient text-white hover:shadow-xl hover:scale-105 transition-all duration-300 border-0"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile: User Avatar Only */}
          <div className="flex md:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl luxury-gradient text-sm font-bold text-white shadow-lg">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
}
