'use client';

import { logger } from '@/utils/logger';
import React, { Component, ErrorInfo } from 'react';
import { ChatError } from '../../types';

interface ChatErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: ChatError, errorInfo?: ErrorInfo) => void;
  onReset?: () => void;
  fallback?: React.ReactElement;
}

interface ChatErrorBoundaryState {
  error: ChatError | null;
}

interface ErrorFallbackProps {
  error: ChatError;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => (
  <div className="chat-error-fallback" role="alert">
    <div className="error-content">
      <h3>Chat Error</h3>
      <p>{error.message}</p>
      {error.severity === 'error' && (
        <div className="error-actions">
          <button
            onClick={resetError}
            className="retry-button"
            aria-label="Retry"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="refresh-button"
            aria-label="Refresh page"
          >
            Refresh Page
          </button>
        </div>
      )}
      {error.severity === 'warning' && (
        <button onClick={resetError} className="dismiss-button">
          Dismiss
        </button>
      )}
    </div>
  </div>
);

/**
 * ChatErrorBoundary
 *
 * A React error boundary component specifically designed for chat-related errors.
 * Features:
 * - Catches and handles chat-specific errors
 * - Provides fallback UI with retry options
 * - Logs errors for monitoring
 * - Supports custom error handling
 * - Maintains error state for recovery
 */
export class ChatErrorBoundary extends Component<
  ChatErrorBoundaryProps,
  ChatErrorBoundaryState
> {
  constructor(props: ChatErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
    this.resetError = this.resetError.bind(this);
  }

  static getDerivedStateFromError(error: unknown): ChatErrorBoundaryState {
    // Convert any error to a ChatError
    const chatError = ChatError.isChatError(error)
      ? error
      : ChatError.fromError(error, 'INITIALIZATION_ERROR');

    return { error: chatError };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error with additional context
    logger.error('Chat component error:', {
      error: ChatError.fromError(error),
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      severity: error instanceof ChatError ? error.severity : 'error',
    });

    // Call the onError prop if provided
    if (this.props.onError) {
      this.props.onError(ChatError.fromError(error), errorInfo);
    }

    // Track error for analytics
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('Chat Error', {
        error: error.message,
        type: error instanceof ChatError ? error.code : 'UNKNOWN',
        severity: error instanceof ChatError ? error.severity : 'error',
      });
    }
  }

  resetError() {
    this.setState({ error: null });

    // Call onReset prop if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render() {
    const { error } = this.state;
    const { fallback, children } = this.props;

    if (error) {
      // Use custom fallback if provided
      if (fallback) {
        return React.cloneElement(fallback, {
          error,
          resetError: this.resetError,
        });
      }

      // Use default error fallback
      return <ErrorFallback error={error} resetError={this.resetError} />;
    }

    return children;
  }
}

// HOC for wrapping components with error boundary
export const withChatErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Partial<ChatErrorBoundaryProps>,
) => {
  return function WithErrorBoundary(props: P) {
    return (
      <ChatErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ChatErrorBoundary>
    );
  };
};
