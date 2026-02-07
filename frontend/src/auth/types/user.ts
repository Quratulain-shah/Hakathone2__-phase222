// User and authentication type definitions

/**
 * User entity interface
 * Represents an authenticated user
 */
export interface User {
  /** Unique identifier (UUID v4) */
  id: string;

  /** Display name (1-100 characters, required) */
  name: string;

  /** Email address (required, validated format) */
  email: string;

  /** Optional profile picture URL */
  avatar?: string;
}

/**
 * Authentication state interface
 * Manages current user session state
 */
export interface AuthState {
  /** Whether user is currently authenticated */
  isAuthenticated: boolean;

  /** Current authenticated user (null if not authenticated) */
  user: User | null;
}

/**
 * Login credentials payload
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Signup credentials payload
 */
export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}
