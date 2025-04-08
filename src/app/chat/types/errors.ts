import { ErrorInfo, ReactNode } from 'react';

export type ChatErrorCode =
  | 'INITIALIZATION_ERROR'
  | 'CONNECTION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'MESSAGE_ERROR'
  | 'CHAT_START_ERROR'
  | 'CHAT_END_ERROR'
  | 'PLAN_SWITCH_ERROR'
  | 'NOT_INITIALIZED'
  | 'DISCONNECT_ERROR'
  | 'AUTH_ERROR'
  | 'NOT_ELIGIBLE'
  | 'OUTSIDE_BUSINESS_HOURS'
  | 'HOURS_CHECK_FAILED'
  | 'ELIGIBILITY_CHECK_FAILED'
  | 'PLAN_NOT_FOUND'
  | 'INVALID_STATE'
  | 'COBROWSE_INIT_ERROR'
  | 'COBROWSE_END_ERROR'
  | 'TERMS_FETCH_ERROR'
  | 'API_ERROR'
  | 'NETWORK_ERROR'
  | 'EMAIL_SEND_ERROR'
  | 'EMAIL_FETCH_ERROR'
  | 'PHONE_FETCH_ERROR'
  | 'CHAT_GROUPS_ERROR'
  | 'UNKNOWN_ERROR';

export type ErrorSeverity = 'error' | 'warning' | 'info';

export class ChatError extends Error {
  constructor(
    message: string,
    public code: ChatErrorCode,
    public severity: ErrorSeverity = 'error',
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ChatError';
  }

  static fromError(
    error: unknown,
    code: ChatErrorCode = 'INITIALIZATION_ERROR',
    details?: Record<string, unknown>,
  ): ChatError {
    if (error instanceof ChatError) {
      return error;
    }
    const message = error instanceof Error ? error.message : String(error);
    return new ChatError(message, code, 'error', details);
  }

  static isChatError(error: unknown): error is ChatError {
    return error instanceof ChatError;
  }

  toString(): string {
    return `${this.name}[${this.code}]: ${this.message}${
      this.details ? ` (${JSON.stringify(this.details)})` : ''
    }`;
  }
}

export interface ChatErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ReactElement;
  onError?: (error: ChatError, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

export interface ChatErrorBoundaryState {
  error: ChatError | null;
}

declare global {
  interface Window {
    analytics?: {
      track: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}
