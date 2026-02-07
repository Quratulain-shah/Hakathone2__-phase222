'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Password strength levels
 */
export type PasswordStrength = 'weak' | 'medium' | 'strong';

/**
 * Password strength result interface
 */
interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-4
  feedback: string;
  checks: {
    length: boolean;
    hasLetter: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

/**
 * Calculate password strength
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  const checks = {
    length: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^a-zA-Z0-9]/.test(password),
  };

  // Calculate score based on checks passed
  const score = Object.values(checks).filter(Boolean).length;

  // Determine strength level
  let strength: PasswordStrength;
  let feedback: string;

  if (score <= 1) {
    strength = 'weak';
    feedback = 'Weak - Add more variety';
  } else if (score === 2) {
    strength = 'weak';
    feedback = 'Weak - Include letters and numbers';
  } else if (score === 3) {
    strength = 'medium';
    feedback = 'Medium - Good password';
  } else {
    strength = 'strong';
    feedback = 'Strong - Excellent password!';
  }

  return { strength, score, feedback, checks };
}

/**
 * PasswordStrengthIndicator component props
 */
interface PasswordStrengthIndicatorProps {
  password: string;
  showCriteria?: boolean;
}

/**
 * PasswordStrengthIndicator component
 * Visual progress bar and text feedback for password strength
 * Shows real-time strength as user types
 */
export function PasswordStrengthIndicator({
  password,
  showCriteria = false,
}: PasswordStrengthIndicatorProps) {
  // Don't show anything if password is empty
  if (!password) {
    return null;
  }

  const result = calculatePasswordStrength(password);

  // Strength color mapping
  const strengthColors: Record<PasswordStrength, { bg: string; text: string }> = {
    weak: { bg: 'bg-red-500', text: 'text-red-700' },
    medium: { bg: 'bg-yellow-500', text: 'text-yellow-700' },
    strong: { bg: 'bg-green-500', text: 'text-green-700' },
  };

  const colors = strengthColors[result.strength];

  // Calculate progress width (0%, 50%, 100%)
  const progressWidth = result.strength === 'weak' ? '33%' : result.strength === 'medium' ? '66%' : '100%';

  return (
    <div className="mt-2 space-y-2">
      {/* Progress Bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={cn('h-full transition-all duration-300', colors.bg)}
          style={{ width: progressWidth }}
          role="progressbar"
          aria-valuenow={result.score}
          aria-valuemin={0}
          aria-valuemax={4}
          aria-label={`Password strength: ${result.strength}`}
        />
      </div>

      {/* Feedback Text */}
      <div className="flex items-center justify-between">
        <p className={cn('text-sm font-medium', colors.text)}>
          {result.feedback}
        </p>
        <span className={cn('text-xs font-medium uppercase', colors.text)}>
          {result.strength}
        </span>
      </div>

      {/* Criteria Checklist (Optional) */}
      {showCriteria && (
        <ul className="mt-2 space-y-1 text-xs text-gray-600">
          <li className="flex items-center gap-1">
            {result.checks.length ? (
              <span className="text-green-600">✓</span>
            ) : (
              <span className="text-gray-400">○</span>
            )}
            At least 8 characters
          </li>
          <li className="flex items-center gap-1">
            {result.checks.hasLetter ? (
              <span className="text-green-600">✓</span>
            ) : (
              <span className="text-gray-400">○</span>
            )}
            Contains letters
          </li>
          <li className="flex items-center gap-1">
            {result.checks.hasNumber ? (
              <span className="text-green-600">✓</span>
            ) : (
              <span className="text-gray-400">○</span>
            )}
            Contains numbers
          </li>
          <li className="flex items-center gap-1">
            {result.checks.hasSpecial ? (
              <span className="text-green-600">✓</span>
            ) : (
              <span className="text-gray-400">○</span>
            )}
            Contains special characters
          </li>
        </ul>
      )}
    </div>
  );
}
