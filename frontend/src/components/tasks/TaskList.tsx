'use client';

import { useState, useOptimistic, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTasks } from '@/contexts/TaskContext';
import { useToast } from '@/contexts/ToastContext';
import { Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { TaskFormLuxury } from './TaskFormLuxury';
import { DeleteConfirm } from './DeleteConfirm';
import { EmptyState } from './EmptyState';
import { TaskFilters, FilterStatus } from './TaskFilters';
import { TaskSort, SortOption } from './TaskSort';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

/**
 * TaskList component
 * Client Component with optimistic updates
 * Manages task list display and CRUD operations
 */
export function TaskList() {
  const { tasks, loading, createTask, updateTask, deleteTask, toggleTaskStatus } = useTasks();
  const { success, error } = useToast();

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Optimistic state for instant UI updates
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    tasks,
    (state: Task[], action: { type: string; payload: any }) => {
      switch (action.type) {
        case 'create':
          return [action.payload, ...state];
        case 'update':
          return state.map((t) =>
            t.id === action.payload.id ? action.payload : t
          );
        case 'delete':
          return state.filter((t) => t.id !== action.payload);
        case 'toggle':
          return state.map((t) =>
            t.id === action.payload.id
              ? {
                  ...t,
                  status: t.status === 'pending' ? 'completed' : 'pending',
                }
              : t
          );
        default:
          return state;
      }
    }
  );

  /**
   * Handle task creation
   */
  const handleCreateTask = async (title: string, description?: string) => {
    try {
      const newTask = await createTask({ title, description });
      setOptimisticTasks({ type: 'create', payload: newTask });
      success('Task created successfully');
      setIsFormOpen(false);
    } catch (err: any) {
      error(err.message || 'Failed to create task');
    }
  };

  /**
   * Handle task update
   */
  const handleUpdateTask = async (
    id: string,
    title: string,
    description?: string
  ) => {
    try {
      const updatedTask = await updateTask(id, { title, description });
      setOptimisticTasks({ type: 'update', payload: updatedTask });
      success('Task updated successfully');
      setEditingTask(null);
      setIsFormOpen(false);
    } catch (err: any) {
      error(err.message || 'Failed to update task');
    }
  };

  /**
   * Handle task deletion
   */
  const handleDeleteTask = async () => {
    if (!deletingTaskId) return;

    try {
      await deleteTask(deletingTaskId);
      setOptimisticTasks({ type: 'delete', payload: deletingTaskId });
      success('Task deleted successfully');
      setDeleteConfirmOpen(false);
      setDeletingTaskId(null);
    } catch (err: any) {
      error(err.message || 'Failed to delete task');
    }
  };

  /**
   * Handle task completion toggle
   */
  const handleToggleStatus = async (id: string) => {
    try {
      const task = optimisticTasks.find((t) => t.id === id);
      if (!task) return;

      // Optimistic update
      setOptimisticTasks({ type: 'toggle', payload: { id } });

      // Actual update
      const updatedTask = await toggleTaskStatus(id);
      const message =
        updatedTask.status === 'completed'
          ? 'Task completed'
          : 'Task reopened';
      success(message);
    } catch (err: any) {
      // Revert optimistic update on error
      error(err.message || 'Failed to update task status');
    }
  };

  /**
   * Open task form for creation
   */
  const handleAddTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  /**
   * Open task form for editing
   */
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  /**
   * Open delete confirmation
   */
  const handleDeleteClick = (taskId: string) => {
    setDeletingTaskId(taskId);
    setDeleteConfirmOpen(true);
  };

  /**
   * Close modals
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setDeletingTaskId(null);
  };

  // Get URL params for filtering and sorting
  const searchParams = useSearchParams();
  const filterStatus = (searchParams.get('status') as FilterStatus) || 'all';
  const sortOption = (searchParams.get('sort') as SortOption) || 'date-desc';

  /**
   * Apply filtering and sorting to tasks
   * Uses useMemo for performance optimization
   */
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...optimisticTasks];

    // Apply filtering
    if (filterStatus !== 'all') {
      result = result.filter((task) => task.status === filterStatus);
    }

    // Apply sorting
    switch (sortOption) {
      case 'date-desc':
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'date-asc':
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return result;
  }, [optimisticTasks, filterStatus, sortOption]);

  // Check if we have an empty filter result (tasks exist but filter returns none)
  const hasEmptyFilterResult =
    optimisticTasks.length > 0 && filteredAndSortedTasks.length === 0;

  /**
   * Handle clear filters
   */
  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('status');
    params.delete('sort');
    window.location.href = '?' + params.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-4xl font-bold luxury-heading">✨ My Tasks</h2>
        {/* Luxury Add Button */}
        <button
          onClick={handleAddTask}
          aria-label="Add new task"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 luxury-gradient border-0 cursor-pointer"
        >
          <Plus className="h-6 w-6" />
          Add New Task
        </button>
      </div>

      {/* Filters and Sort Controls */}
      {optimisticTasks.length > 0 && !loading && (
        <div className="flex flex-col gap-4 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-amber-200/50 p-6 shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <TaskFilters />
          <TaskSort />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your tasks...</p>
        </div>
      )}

      {/* Task List, Empty State, or Empty Filter Result */}
      {!loading && optimisticTasks.length === 0 ? (
        <EmptyState onAddTask={handleAddTask} />
      ) : !loading && hasEmptyFilterResult ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-300 bg-white/60 backdrop-blur-sm p-12 text-center shadow-lg">
          <p className="mb-2 text-lg font-bold text-gray-900 luxury-heading">
            No {filterStatus} tasks found
          </p>
          <p className="mb-4 text-sm text-gray-600">
            Try adjusting your filters to see more tasks
          </p>
          <Button variant="secondary" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
      ) : !loading && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl">
          {filteredAndSortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEditTask}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Luxury Task Form Modal */}
      {isFormOpen && !editingTask && (
        <TaskFormLuxury
          isOpen={isFormOpen}
          onClose={handleCloseForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && deletingTaskId && (
        <DeleteConfirm
          taskTitle={
            optimisticTasks.find((t) => t.id === deletingTaskId)?.title ||
            'this task'
          }
          onConfirm={handleDeleteTask}
          onClose={handleCloseDeleteConfirm}
        />
      )}

      {/* Mobile FAB (Fixed Add Button) - visible only on mobile < 768px */}
      <button
        onClick={handleAddTask}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-200 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:hidden"
        aria-label="Add new task"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
