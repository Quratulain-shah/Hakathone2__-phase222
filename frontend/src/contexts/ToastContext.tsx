'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastType } from '@/types/ui';

/**
 * Toast context interface
 */
interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

/**
 * Toast context
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Maximum number of toasts visible at once
 */
const MAX_TOASTS = 3;

/**
 * Default toast duration in milliseconds
 */
const DEFAULT_DURATION = 3000;

/**
 * Toast context provider component
 * Manages toast notification queue with auto-dismiss
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Remove a toast by ID
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Add a new toast notification
   */
  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = DEFAULT_DURATION) => {
      const newToast: Toast = {
        id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        message,
        duration,
      };

      setToasts((prev) => {
        // Remove oldest toast if at max capacity
        const updated = prev.length >= MAX_TOASTS ? prev.slice(1) : prev;
        return [...updated, newToast];
      });

      // Auto-dismiss after duration
      setTimeout(() => {
        removeToast(newToast.id);
      }, duration);
    },
    [removeToast]
  );

  /**
   * Convenience method for success toasts
   */
  const success = useCallback(
    (message: string, duration?: number) => {
      addToast(message, 'success', duration);
    },
    [addToast]
  );

  /**
   * Convenience method for error toasts
   */
  const error = useCallback(
    (message: string, duration?: number) => {
      addToast(message, 'error', duration);
    },
    [addToast]
  );

  /**
   * Convenience method for info toasts
   */
  const info = useCallback(
    (message: string, duration?: number) => {
      addToast(message, 'info', duration);
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        info,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

/**
 * Hook to access toast context
 * @throws {Error} If used outside ToastProvider
 */
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
