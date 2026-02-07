'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/auth/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Form validation errors
 */
interface LoginFormErrors {
  email?: string;
  password?: string;
}

/**
 * LoginForm component
 * Client Component with form validation and auth integration
 * Includes email/password fields, remember me checkbox, and link to signup
 */
export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { success, error: showError } = useToast();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate email format
   */
  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  /**
   * Validate password
   */
  const validatePassword = (value: string): string | undefined => {
    if (!value) {
      return 'Password is required';
    }
    return undefined;
  };

  /**
   * Validate all fields
   */
  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle email blur validation
   */
  const handleEmailBlur = () => {
    const error = validateEmail(email);
    setErrors((prev) => ({ ...prev, email: error }));
  };

  /**
   * Handle password blur validation
   */
  const handlePasswordBlur = () => {
    const error = validatePassword(password);
    setErrors((prev) => ({ ...prev, password: error }));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Attempt login
      await login(email.trim(), password);

      // Show success message
      success('Welcome back! Redirecting to your tasks...');

      // Redirect to tasks page
      setTimeout(() => {
        router.push('/tasks');
      }, 500);
    } catch (err) {
      // Show error message
      const errorMessage =
        err instanceof Error ? err.message : 'Invalid email or password';
      showError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div>
        <Input
          id="login-email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleEmailBlur}
          error={errors.email}
          placeholder="email@example.com"
          required
          autoComplete="email"
          autoFocus
          aria-label="Email address"
        />
      </div>

      {/* Password Input */}
      <div>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={handlePasswordBlur}
            error={errors.password}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            aria-label="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-amber-600 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-0 rounded"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center">
        <input
          id="remember-me"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-0"
          aria-label="Remember me"
        />
        <label
          htmlFor="remember-me"
          className="ml-2 block text-sm text-gray-700 font-medium"
        >
          Remember me
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        Sign In
      </Button>

      {/* Signup Link */}
      <div className="text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <Link
          href="/signup"
          className="font-semibold luxury-text hover:text-amber-700 focus:outline-none focus:underline"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}
