'use client';

import { Heart, Sparkles, Github, Twitter, Linkedin } from 'lucide-react';

/**
 * Luxury Footer Component
 * Premium footer with golden theme and social links
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t-2 border-amber-200/30 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 luxury-gradient rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold luxury-heading">TaskFlow</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Your premium productivity companion. Organize life with elegance and achieve excellence daily.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold luxury-heading mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/tasks" className="text-gray-700 hover:text-amber-700 transition-colors text-sm">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/tasks" className="text-gray-700 hover:text-amber-700 transition-colors text-sm">
                  My Tasks
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-700 hover:text-amber-700 transition-colors text-sm">
                  Home
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold luxury-heading mb-4">Connect</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-gray-700 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 hover:text-amber-700 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-gray-700 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 hover:text-amber-700 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-gray-700 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 hover:text-amber-700 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-amber-200/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              © {currentYear} TaskFlow. Built with
              <Heart className="w-4 h-4 text-red-500 inline animate-pulse" />
              and Next.js 14
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 font-semibold luxury-text">
                Premium Edition
              </span>
              <span>v2.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
