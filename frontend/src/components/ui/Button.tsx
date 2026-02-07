'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Button variant types
 */
type ButtonVariant = 'primary' | 'secondary' | 'danger';

/**
 * Button size types
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button component props
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant (default: primary) */
  variant?: ButtonVariant;

  /** Button size (default: md) */
  size?: ButtonSize;

  /** Loading state (shows spinner, disables button) */
  loading?: boolean;

  /** Full width button */
  fullWidth?: boolean;

  /** Icon element to show before text */
  leftIcon?: React.ReactNode;

  /** Icon element to show after text */
  rightIcon?: React.ReactNode;

  /** Children content */
  children: React.ReactNode;
}

/**
 * Base button styles
 */
const baseStyles =
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * Variant styles
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'luxury-gradient text-white hover:shadow-xl hover:scale-105 active:scale-100 focus:ring-amber-500 border-0',
  secondary:
    'bg-white/80 backdrop-blur-sm text-gray-900 hover:bg-white hover:shadow-lg border-2 border-amber-200 focus:ring-amber-500',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500',
};

/**
 * Size styles
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * Loading spinner component
 */
function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Button component
 * Reusable button with multiple variants, sizes, and loading state
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="mr-2">
          <LoadingSpinner />
        </span>
      )}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}
