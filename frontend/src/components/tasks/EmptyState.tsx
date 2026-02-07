'use client';

import { Button } from '@/components/ui/Button';
import { CheckSquare, Plus } from 'lucide-react';

/**
 * EmptyState props interface
 */
interface EmptyStateProps {
  onAddTask: () => void;
}

/**
 * EmptyState component
 * Client Component displayed when no tasks exist
 * Shows friendly message and call-to-action button
 */
export function EmptyState({ onAddTask }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white py-12 px-6 text-center"
      role="status"
      aria-label="No tasks found"
    >
      {/* Icon */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <CheckSquare className="h-8 w-8 text-gray-400" aria-hidden="true" />
      </div>

      {/* Heading */}
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        No tasks yet!
      </h3>

      {/* Description */}
      <p className="mb-6 max-w-sm text-sm text-gray-600">
        You haven&apos;t created any tasks yet. Get started by creating your first
        task and start organizing your day.
      </p>

      {/* Call to Action */}
      <Button onClick={onAddTask} size="lg">
        <Plus className="mr-2 h-5 w-5" />
        Create Your First Task
      </Button>
    </div>
  );
}
