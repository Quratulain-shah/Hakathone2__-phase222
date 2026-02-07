'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '@/types/task';
import { api } from '@/auth/lib/api';
import { isAuthenticated, getAuthToken } from '@/auth/lib/auth';

/**
 * Task context interface
 */
interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  refreshTasks: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<Task>;
}

/**
 * Task context
 */
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Get user-specific storage key
function getUserStorageKey(): string {
  const token = getAuthToken();
  if (!token) return 'todo-app-tasks';

  // Check if token is properly formatted
  const parts = token.split('.');
  if (parts.length !== 3) {
    return 'todo-app-tasks';
  }

  try {
    const payload = parts[1]; // Get the payload part
    // Decode base64 URL-safe string
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const parsedPayload = JSON.parse(jsonPayload);
    const userId = parsedPayload.sub || parsedPayload.userId || 'anonymous';
    return `todo-app-tasks-user-${userId}`;
  } catch (error) {
    console.error('Error parsing JWT token in TaskContext:', error);
    return 'todo-app-tasks';
  }
}

function getStoredTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    const storageKey = getUserStorageKey();
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredTasks(tasks: Task[]) {
  if (typeof window === 'undefined') return;
  const storageKey = getUserStorageKey();
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function clearStoredTasks() {
  if (typeof window === 'undefined') return;
  // Clear only the anonymous/shared key (old format)
  localStorage.removeItem('todo-app-tasks');
}

/**
 * Task context provider component
 * Manages task data with API calls and local state
 */
export function TaskProvider({ children }: { children: React.ReactNode }) {
  // Initialize from user-specific localStorage
  const [tasks, setTasks] = useState<Task[]>(getStoredTasks);
  const [loading, setLoading] = useState(false);
  const lastAuthToken = useRef<string | null>(null);

  // Function to load tasks (can be called manually too)
  const loadTasks = useCallback(async () => {
    const currentToken = isAuthenticated();

    // Only load tasks if user is authenticated
    if (!currentToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.tasks.getAll();
      if (response.success && response.data) {
        // Get existing tasks from localStorage to preserve priority/category
        const existingTasks = getStoredTasks();
        const existingById = new Map(existingTasks.map(t => [t.id, t]));

        // Merge backend tasks with local priority/category
        const newTasks = response.data.tasks.map(task => {
          const existing = existingById.get(task.id);
          return existing ? { ...task, priority: existing.priority, category: existing.category } : task;
        });

        setTasks(newTasks);
        setStoredTasks(newTasks);
      } else if (response.error?.code === 'UNAUTHORIZED') {
        // Token expired or invalid - clear tasks
        clearStoredTasks();
        setTasks([]);
      } else {
        // Other error - keep existing local tasks, don't overwrite with empty
        console.error('Failed to load tasks:', response.error?.message);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Keep existing tasks on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tasks on mount and when auth state changes
  useEffect(() => {
    // Initial load if authenticated
    if (isAuthenticated()) {
      loadTasks();
    }

    // Listen for storage events (login/logout from other tabs or same tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-token') {
        // User logged in or out - check auth state
        setTimeout(() => {
          if (isAuthenticated()) {
            // New user logged in - load their tasks from backend
            // DON'T clear old tasks yet - wait for backend response
            loadTasks();
          } else {
            // User logged out - keep tasks in localStorage for when they return
            // Just refresh state from localStorage
            setTasks(getStoredTasks());
          }
        }, 100);
      }
    };

    // Also check periodically for auth changes (handles same-tab logout/login)
    const intervalId = setInterval(() => {
      const token = isAuthenticated();
      if (token !== lastAuthToken.current) {
        lastAuthToken.current = token;
        if (token) {
          // New user logged in - load their tasks from backend
          loadTasks();
        } else {
          // User logged out - DON'T clear tasks (keep for when they return)
          setTasks(getStoredTasks());
        }
      }
    }, 500);

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [loadTasks]);

  /**
   * Create a new task with all properties
   */
  const createTask = useCallback(async (input: CreateTaskInput): Promise<Task> => {
    const response = await api.tasks.create(input);
    if (response.success && response.data) {
      // Merge priority/category from input (client-side) with backend response
      const newTask: Task = {
        ...response.data,
        priority: input.priority || 'medium',
        category: input.category || 'personal',
      };
      setTasks((prev) => {
        const updated = [newTask, ...prev];
        setStoredTasks(updated);
        return updated;
      });
      return newTask;
    } else {
      throw new Error(response.error?.message || 'Failed to create task');
    }
  }, []);

  /**
   * Update an existing task
   */
  const updateTask = useCallback(async (id: string, input: UpdateTaskInput): Promise<Task> => {
    const response = await api.tasks.update(id, input);
    if (response.success && response.data) {
      // Preserve priority/category from local state
      const existingTask = tasks.find(t => t.id === id);
      const updatedTask: Task = {
        ...response.data,
        priority: existingTask?.priority || input.priority || 'medium',
        category: existingTask?.category || input.category || 'personal',
      };
      setTasks((prev) => {
        const updated = prev.map((t) => (t.id === id ? updatedTask : t));
        setStoredTasks(updated);
        return updated;
      });
      return updatedTask;
    } else {
      throw new Error(response.error?.message || 'Failed to update task');
    }
  }, [tasks]);

  /**
   * Delete an existing task
   */
  const deleteTask = useCallback(async (id: string): Promise<void> => {
    const response = await api.tasks.delete(id);
    if (response.success) {
      setTasks((prev) => {
        const updated = prev.filter((t) => t.id !== id);
        setStoredTasks(updated);
        return updated;
      });
    } else {
      throw new Error(response.error?.message || 'Failed to delete task');
    }
  }, []);

  /**
   * Toggle task completion status
   */
  const toggleTaskStatus = useCallback(async (id: string): Promise<Task> => {
    // Get current task to determine new status
    const currentTask = tasks.find(t => t.id === id);
    if (!currentTask) {
      throw new Error('Task not found');
    }

    const newStatus: TaskStatus = currentTask.status === 'pending' ? 'completed' : 'pending';
    const input: UpdateTaskInput = {
      ...currentTask,
      status: newStatus,
    };

    const response = await api.tasks.update(id, input);
    if (response.success && response.data) {
      // Preserve priority/category from currentTask
      const updatedTask: Task = {
        ...response.data,
        priority: currentTask.priority,
        category: currentTask.category,
      };
      setTasks((prev) => {
        const updated = prev.map((t) => (t.id === id ? updatedTask : t));
        setStoredTasks(updated);
        return updated;
      });
      return updatedTask;
    } else {
      throw new Error(response.error?.message || 'Failed to update task');
    }
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        refreshTasks: loadTasks,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

/**
 * Hook to access task context
 * @throws {Error} If used outside TaskProvider
 */
export function useTasks(): TaskContextType {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
}
