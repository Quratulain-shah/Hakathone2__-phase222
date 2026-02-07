'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { TaskStatus } from '@/types/task';

/**
 * Badge variant types
 */
type BadgeVariant = 'pending' | 'completed' | 'default' | 'success' | 'warning';

/**
 * Badge component props
 */
interface BadgeProps {
  /** Badge text */
  children: React.ReactNode;

  /** Badge variant (default: default) */
  variant?: BadgeVariant;

  /** Custom className */
  className?: string;
}

/**
 * Badge variant styles
 */
const variantStyles: Record<BadgeVariant, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200',
};

/**
 * Badge component
 * Status badge for tasks with color-coded variants
 */
export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        'transition-colors duration-200',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * Task status badge component
 * Automatically maps task status to badge variant
 */
interface TaskStatusBadgeProps {
  /** Task status */
  status: TaskStatus;

  /** Custom className */
  className?: string;
}

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  const variant = status === 'completed' ? 'completed' : 'pending';
  const label = status === 'completed' ? 'Completed' : 'Pending';

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
