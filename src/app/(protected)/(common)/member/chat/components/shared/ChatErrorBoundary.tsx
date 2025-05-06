'use client';

import { ChatError } from '@/app/(protected)/(common)/member/chat/types/index';
import React, { Component, ErrorInfo } from 'react';

interface Props {
  children: React.ReactNode;
  onError?: (error: ChatError) => void;
  onReset?: () => void;
  fallback?: React.ReactElement;
}

interface State {
  error: ChatError | null;
}

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
export class ChatErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      error:
        error instanceof ChatError
          ? error
          : new ChatError('An unexpected error occurred', 'UNKNOWN_ERROR'),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Chat error:', error, errorInfo);
    if (this.props.onError && error instanceof ChatError) {
      this.props.onError(error);
    }
  }

  resetError = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.error) {
      const { error } = this.state;
      if (this.props.fallback) {
        return React.cloneElement(this.props.fallback, {
          error,
          resetError: this.resetError,
        });
      }
      return (
        <div className="chat-error">
          <h3>Chat Error</h3>
          <p>{error.message}</p>
          <div className="error-actions">
            <button onClick={this.resetError} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export const withChatErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Partial<Props>,
) => {
  return function WithErrorBoundary(props: P) {
    return (
      <ChatErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ChatErrorBoundary>
    );
  };
};
