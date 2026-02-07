import { TaskListSkeleton } from '@/components/ui/Skeleton';

/**
 * Loading component for tasks page
 * Displayed during initial page load or navigation
 * Shows skeleton placeholders for task cards
 */
export default function TasksLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Title Skeleton */}
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />

            {/* Filters Skeleton */}
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-20 animate-pulse rounded bg-gray-200" />
                <div className="ml-auto h-10 w-32 animate-pulse rounded bg-gray-200" />
              </div>
            </div>

            {/* Task List Skeleton */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                  </div>
                  <div className="flex items-center gap-2 border-t pt-3">
                    <div className="h-10 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="flex-1" />
                    <div className="h-10 w-10 animate-pulse rounded bg-gray-200" />
                    <div className="h-10 w-10 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
