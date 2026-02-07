'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

export type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'title-asc'
  | 'title-desc';

/**
 * TaskSort component
 * Client Component for sorting tasks by date or title
 * Updates URL search params for state persistence
 */
export function TaskSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current sort from URL (default: 'date-desc')
  const currentSort =
    (searchParams.get('sort') as SortOption) || 'date-desc';

  /**
   * Handle sort change
   * Updates URL search params while preserving other params (e.g., status)
   */
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = event.target.value as SortOption;
    const params = new URLSearchParams(searchParams.toString());

    if (sort === 'date-desc') {
      params.delete('sort'); // Default value, remove from URL
    } else {
      params.set('sort', sort);
    }

    // Preserve status param if exists
    const statusParam = searchParams.get('status');
    if (statusParam) {
      params.set('status', statusParam);
    }

    // Update URL without page reload
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <label
        htmlFor="task-sort"
        className="flex items-center gap-2 text-sm font-medium text-gray-700"
      >
        <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
        Sort by:
      </label>
      <select
        id="task-sort"
        value={currentSort}
        onChange={handleSortChange}
        className="
          w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
          text-sm text-gray-900 shadow-sm transition-colors
          hover:border-gray-400
          focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
          sm:w-auto
        "
        aria-label="Sort tasks"
      >
        <option value="date-desc">Date (Newest First)</option>
        <option value="date-asc">Date (Oldest First)</option>
        <option value="title-asc">Title (A-Z)</option>
        <option value="title-desc">Title (Z-A)</option>
      </select>
    </div>
  );
}
