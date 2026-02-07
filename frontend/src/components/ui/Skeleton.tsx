'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Skeleton component props
 */
interface SkeletonProps {
  /** Custom className */
  className?: string;

  /** Variant (default: default) */
  variant?: 'default' | 'text' | 'circular';

  /** Width (default: w-full) */
  width?: string;

  /** Height (default: h-4) */
  height?: string;
}

/**
 * Skeleton component
 * Loading placeholder with shimmer animation
 */
export function Skeleton({
  className,
  variant = 'default',
  width = 'w-full',
  height = 'h-4',
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variant === 'circular' && 'rounded-full',
        variant !== 'circular' && 'rounded',
        width,
        height,
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

/**
 * Task card skeleton
 * Specialized skeleton for task cards
 */
export function TaskCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Title skeleton */}
          <Skeleton height="h-5" width="w-3/4" />

          {/* Description skeleton */}
          <Skeleton height="h-4" width="w-full" />
          <Skeleton height="h-4" width="w-5/6" />

          {/* Badge skeleton */}
          <Skeleton height="h-6" width="w-20" className="rounded-full" />
        </div>

        {/* Action buttons skeleton */}
        <div className="flex gap-2">
          <Skeleton variant="circular" width="w-8" height="h-8" />
          <Skeleton variant="circular" width="w-8" height="h-8" />
        </div>
      </div>

      {/* Date skeleton */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <Skeleton height="h-3" width="w-32" />
      </div>
    </div>
  );
}

/**
 * Task list skeleton
 * Multiple task card skeletons
 */
export function TaskListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <TaskCardSkeleton key={index} />
      ))}
    </div>
  );
}
