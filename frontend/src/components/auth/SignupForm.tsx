'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/auth/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Form validation errors
 */
interface SignupFormErrors {
  name?: string;
  email?: string;
  password?: string;
}

/**
 * SignupForm component
 * Client Component with form validation, password strength indicator, and auth integration
 * Includes name, email, password fields, and link to login
 */
export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const { success, error: showError } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate name
   */
  const validateName = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Name is required';
    }
    if (value.trim().length < 1) {
      return 'Name must be at least 1 character';
    }
    if (value.length > 100) {
      return 'Name must be less than 100 characters';
    }
    return undefined;
  };

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
   * Validate password strength
   */
  const validatePassword = (value: string): string | undefined => {
    if (!value) {
      return 'Password is required';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[a-zA-Z]/.test(value)) {
      return 'Password must contain at least one letter';
    }
    if (!/[0-9]/.test(value)) {
      return 'Password must contain at least one number';
    }
    return undefined;
  };

  /**
   * Validate all fields
   */
  const validateForm = (): boolean => {
    const newErrors: SignupFormErrors = {};
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle name blur validation
   */
  const handleNameBlur = () => {
    const error = validateName(name);
    setErrors((prev) => ({ ...prev, name: error }));
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
      // Attempt signup
      await signup(name.trim(), email.trim(), password);

      // Show success message
      success('Account created successfully! Redirecting to your tasks...');

      // Redirect to tasks page
      setTimeout(() => {
        router.push('/tasks');
      }, 500);
    } catch (err) {
      // Show error message
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create account';
      showError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Input */}
      <div>
        <Input
          id="signup-name"
          type="text"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleNameBlur}
          error={errors.name}
          placeholder="John Doe"
          required
          autoComplete="name"
          autoFocus
          aria-label="Full name"
        />
      </div>

      {/* Email Input */}
      <div>
        <Input
          id="signup-email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleEmailBlur}
          error={errors.email}
          placeholder="email@example.com"
          required
          autoComplete="email"
          aria-label="Email address"
        />
      </div>

      {/* Password Input with Strength Indicator */}
      <div>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={handlePasswordBlur}
            error={errors.password}
            placeholder="••••••••"
            required
            autoComplete="new-password"
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

        {/* Password Strength Indicator */}
        <PasswordStrengthIndicator password={password} showCriteria />
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
        Sign Up
      </Button>

      {/* Login Link */}
      <div className="text-center text-sm">
        <span className="text-gray-600">Already have an account? </span>
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
        >
          Log in
        </Link>
      </div>
    </form>
  );
}
