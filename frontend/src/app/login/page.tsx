'use client';

import { useEffect, useRef } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Target, Sparkles, Star } from 'lucide-react';
import { gsap } from 'gsap';

/**
 * Login page component - Luxury animated login
 */
export default function LoginPage() {
  const orbitRef1 = useRef<HTMLDivElement>(null);
  const orbitRef2 = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Floating animation for logo
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        y: 15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // Rotating orbits
    if (orbitRef1.current) {
      gsap.to(orbitRef1.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      });
    }

    if (orbitRef2.current) {
      gsap.to(orbitRef2.current, {
        rotation: -360,
        duration: 15,
        repeat: -1,
        ease: "none",
      });
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center luxury-bg px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Luxury Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-amber-200 to-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* App Branding with Luxury Theme */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
            {/* Decorative Orbits */}
            <div ref={orbitRef1} className="absolute inset-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 luxury-gradient rounded-full shadow-lg"></div>
            </div>
            <div ref={orbitRef2} className="absolute inset-0">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full shadow-lg"></div>
            </div>

            {/* Main Logo */}
            <div
              ref={logoRef}
              className="w-20 h-20 luxury-gradient rounded-2xl flex items-center justify-center shadow-2xl transform rotate-12 hover:rotate-0 transition-all duration-500 z-10"
            >
              <Target className="h-10 w-10 text-white" aria-hidden="true" />
            </div>
          </div>

          <h1 className="mt-8 text-5xl font-bold luxury-heading">
            Welcome Back
          </h1>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Star className="w-5 h-5 text-amber-600" />
            <p className="text-gray-700 text-lg">
              Sign in to continue your journey
            </p>
            <Star className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        {/* Login Form Card with Luxury Style */}
        <div className="rounded-3xl bg-white/90 backdrop-blur-lg px-8 py-10 shadow-2xl sm:px-12 border-2 border-amber-200/50 animate-fade-in-up hover:shadow-3xl transition-all duration-500">
          <LoginForm />
        </div>

        {/* Luxury Footer */}
        <div className="mt-8 text-center animate-fade-in-delay">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold luxury-text tracking-wider uppercase">
              Premium Productivity Suite
            </span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-sm text-gray-600">
            © 2024 TaskFlow - Achieve Excellence Daily
          </p>
        </div>
      </div>
    </div>
  );
}
