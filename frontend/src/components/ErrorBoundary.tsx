'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * ErrorBoundary props interface
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ErrorBoundary state interface
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component
 * Catches React errors and displays a fallback UI
 * Provides reset functionality to recover from errors
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state to trigger fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // In production, you would send this to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    // Navigate to home/tasks page
    window.location.href = '/tasks';
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
          <div className="w-full max-w-md text-center">
            {/* Error Icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
            </div>

            {/* Error Title */}
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Something went wrong
            </h1>

            {/* Error Description */}
            <p className="mb-6 text-sm text-gray-600">
              We're sorry, but something unexpected happened. Please try again or
              return to the home page.
            </p>

            {/* Error Details (development only) */}
            {process.env.NODE_ENV === 'development' && error && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-left">
                <p className="mb-2 text-xs font-semibold text-red-800">
                  Error Details (dev only):
                </p>
                <pre className="overflow-x-auto text-xs text-red-700">
                  {error.toString()}
                </pre>
                {error.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs font-medium text-red-700">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 overflow-x-auto text-xs text-red-600">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-5 w-5" />
                Try Again
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2"
              >
                <Home className="h-5 w-5" />
                Go to Home
              </Button>
            </div>

            {/* Help Text */}
            <p className="mt-6 text-xs text-gray-500">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return children;
  }
}

/**
 * ErrorBoundary hook-based wrapper (for functional component usage)
 * Uses the class-based ErrorBoundary internally
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
): React.FC<P> {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
