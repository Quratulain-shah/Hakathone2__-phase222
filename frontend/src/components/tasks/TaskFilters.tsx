'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTasks } from '@/contexts/TaskContext';
import { TaskStatus } from '@/types/task';

export type FilterStatus = 'all' | TaskStatus;

/**
 * TaskFilters component
 * Client Component for filtering tasks by status
 * Updates URL search params for state persistence
 */
export function TaskFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tasks, loading } = useTasks();

  // Get current filter from URL (default: 'all')
  const currentFilter = (searchParams.get('status') as FilterStatus) || 'all';

  // Calculate task counts for each filter
  const allCount = loading ? 0 : tasks.length;
  const pendingCount = loading ? 0 : tasks.filter((t) => t.status === 'pending').length;
  const completedCount = loading ? 0 : tasks.filter((t) => t.status === 'completed').length;

  /**
   * Handle filter change
   * Updates URL search params while preserving other params (e.g., sort)
   */
  const handleFilterChange = (status: FilterStatus) => {
    const params = new URLSearchParams(searchParams.toString());

    if (status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }

    // Preserve sort param if exists
    const sortParam = searchParams.get('sort');
    if (sortParam) {
      params.set('sort', sortParam);
    }

    // Update URL without page reload
    router.push(`?${params.toString()}`, { scroll: false });
  };

  /**
   * Filter button component
   */
  const FilterButton = ({
    status,
    label,
    count,
  }: {
    status: FilterStatus;
    label: string;
    count: number;
  }) => {
    const isActive = currentFilter === status;

    return (
      <button
        onClick={() => handleFilterChange(status)}
        className={`
          flex-1 rounded-lg px-4 py-2.5 font-medium transition-all duration-200
          focus:outline-none focus:ring-2  border-amber-200/50 focus:ring-offset-2
          sm:flex-none sm:px-6
          ${
            isActive
              ? " border-amber-200/50 text-black shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }
        `}
        aria-label={`Filter by ${label}`}
        aria-pressed={isActive}
      >
        <span className="text-sm sm:text-base">
          {label} <span className="text-xs opacity-90">({count})</span>
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <label className="text-sm font-medium text-gray-700">Filter by:</label>
      <div className="flex gap-2">
        <FilterButton status="all" label="All" count={allCount} />
        <FilterButton status="pending" label="Pending" count={pendingCount} />
        <FilterButton
          status="completed"
          label="Completed"
          count={completedCount}
        />
      </div>
    </div>
  );
}
