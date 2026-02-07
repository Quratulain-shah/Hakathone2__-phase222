// Task entity type definitions

/**
 * Task status enum
 */
export type TaskStatus = 'pending' | 'completed';

/**
 * Task priority levels
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Task categories for different activities
 */
export type TaskCategory =
  | 'namaz'      // Prayer times and religious activities
  | 'work'       // Work-related tasks
  | 'meeting'    // Meetings and appointments
  | 'sports'     // Sports activities (football, gym, etc.)
  | 'personal'   // Personal errands and tasks
  | 'study'      // Learning and education
  | 'health'     // Health and fitness
  | 'shopping'   // Shopping lists
  | 'finance'    // Bills and financial tasks
  | 'family'     // Family-related activities
  | 'other';     // Miscellaneous tasks

/**
 * Task entity interface
 * Represents a single todo item in the application
 */
export interface Task {
  /** Unique identifier (UUID v4) */
  id: string;

  /** Task title (1-200 characters, required) */
  title: string;

  /** Optional task description (0-5000 characters) */
  description?: string;

  /** Task completion status */
  status: TaskStatus;

  /** Task completion flag (derived from status) */
  completed: boolean;

  /** Task priority level */
  priority: TaskPriority;

  /** Task category */
  category: TaskCategory;

  /** Due date for the task (ISO 8601 format, optional) */
  dueDate?: string;

  /** Reminder time (ISO 8601 format, optional) */
  reminderTime?: string;

  /** Tags for additional organization */
  tags?: string[];

  /** Location for the task (optional) */
  location?: string;

  /** Recurring task pattern (optional) */
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
  };

  /** Creation timestamp (ISO 8601 format) */
  createdAt: string;

  /** Last modification timestamp (ISO 8601 format, optional) */
  updatedAt?: string;
}

/**
 * Payload for creating a new task
 */
export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  category?: TaskCategory;
  dueDate?: string;
  reminderTime?: string;
  tags?: string[];
  location?: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
  };
}

/**
 * Payload for updating an existing task
 */
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: TaskCategory;
  dueDate?: string;
  reminderTime?: string;
  tags?: string[];
  location?: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
  };
}

/**
 * Category configuration with metadata
 */
export interface CategoryConfig {
  id: TaskCategory;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
}
