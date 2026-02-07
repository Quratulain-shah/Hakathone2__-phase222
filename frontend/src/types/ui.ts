// UI state type definitions

import { Task } from './task';

/**
 * Modal mode enum for task form
 */
export type ModalMode = 'create' | 'edit';

/**
 * Toast notification type
 */
export type ToastType = 'success' | 'error' | 'info';

/**
 * Task form modal state
 */
export interface TaskFormModal {
  /** Whether modal is currently visible */
  isOpen: boolean;

  /** Modal mode: create or edit */
  mode: ModalMode;

  /** Task being edited (null for create mode) */
  task: Task | null;
}

/**
 * Delete confirmation modal state
 */
export interface DeleteConfirmModal {
  /** Whether modal is currently visible */
  isOpen: boolean;

  /** ID of task to delete (null when closed) */
  taskId: string | null;
}

/**
 * Toast notification interface
 */
export interface Toast {
  /** Unique identifier for React key */
  id: string;

  /** Toast type (affects styling and icon) */
  type: ToastType;

  /** Message to display */
  message: string;

  /** Auto-dismiss duration in milliseconds (default: 3000) */
  duration: number;
}

/**
 * Complete UI state interface
 */
export interface UIState {
  /** Modal visibility states */
  modals: {
    taskForm: TaskFormModal;
    deleteConfirm: DeleteConfirmModal;
  };

  /** Toast notification queue (max 3 visible) */
  toasts: Toast[];

  /** Loading states */
  loading: {
    isSubmitting: boolean;
  };
}

/**
 * Filter status enum
 */
export type FilterStatus = 'all' | 'pending' | 'completed';

/**
 * Sort option enum
 */
export type SortOption = 'date' | 'title';

/**
 * Filter and sort state interface
 */
export interface FilterState {
  /** Active status filter */
  status: FilterStatus;

  /** Active sort order */
  sort: SortOption;
}
