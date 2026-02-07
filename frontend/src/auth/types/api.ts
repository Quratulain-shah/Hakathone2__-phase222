// API response type definitions

import { Task } from './task';
import { User } from './user';

/**
 * Generic API success response wrapper
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Generic API error response
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Task list response payload
 */
export interface TaskListResponse {
  tasks: Task[];
  total: number;
}

/**
 * Auth response payload
 */
export interface AuthResponse {
  user: User;
  token?: string; // JWT token (will be used in Phase 2b)
}

/**
 * Generic delete response
 */
export interface DeleteResponse {
  id: string;
  deleted: boolean;
}

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ApiErrorResponse {
  return response.success === false;
}
