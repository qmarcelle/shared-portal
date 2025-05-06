export class ChatError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = 'ChatError';
  }
}

// Extend Window interface to include elementTag property
declare global {
  interface Window {
    elementTag?: (
      event: string,
      category: string,
      data: Record<string, unknown>,
      label: string,
      callback: () => void,
    ) => void;
  }
}

/**
 * Registers global error handlers for chat functionality.
 * This ensures errors are properly caught, logged, and potentially reported.
 */
export const registerErrorHandler = (): void => {
  // Register window error handler for chat-specific issues
  const originalOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    // Only intercept Genesys/chat-related errors
    if (
      source?.includes('genesys') ||
      source?.includes('chat') ||
      message?.toString().toLowerCase().includes('genesys') ||
      message?.toString().toLowerCase().includes('chat')
    ) {
      console.error('Chat error caught by global handler:', {
        message,
        source,
        lineno,
        colno,
        error,
      });

      // Report to monitoring/analytics if needed
      if (window.elementTag) {
        window.elementTag(
          'Chat Error',
          'Error',
          {
            error: message?.toString(),
            source,
            line: lineno,
            column: colno,
          },
          'chat_error',
          () => {},
        );
      }

      // Return true to prevent default error handling if we handled it
      return true;
    }

    // Otherwise, pass to original handler
    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error);
    }
    return false;
  };

  // Register unhandled promise rejection handler
  const originalUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = (event) => {
    // Check if this is a chat-related error
    const reason = event.reason?.toString() || '';
    if (
      reason.toLowerCase().includes('genesys') ||
      reason.toLowerCase().includes('chat')
    ) {
      console.error('Unhandled chat promise rejection:', event.reason);

      // Report to monitoring/analytics if needed
      if (window.elementTag) {
        window.elementTag(
          'Chat Promise Error',
          'Error',
          {
            error: reason,
          },
          'chat_promise_error',
          () => {},
        );
      }

      // Prevent default handling
      event.preventDefault();
      return;
    }

    // Otherwise, pass to original handler
    if (originalUnhandledRejection) {
      originalUnhandledRejection.call(window, event);
    }
  };
};

/**
 * Handles chat-specific errors with appropriate logging and formatting.
 *
 * @param error - The error to handle
 * @returns Formatted ChatError
 */
export const handleChatError = (error: unknown): ChatError => {
  // If already a ChatError, return as is
  if (error instanceof ChatError) {
    console.error('Chat error:', error);
    return error;
  }

  // Convert generic Error to ChatError
  if (error instanceof Error) {
    const chatError = new ChatError(error.message, 'UNKNOWN_ERROR');
    console.error('Error converted to ChatError:', chatError);
    return chatError;
  }

  // Handle other error types
  const errorMessage = typeof error === 'string' ? error : 'Unknown chat error';
  const chatError = new ChatError(errorMessage, 'UNKNOWN_ERROR');
  console.error('Unknown error type converted to ChatError:', chatError);
  return chatError;
};
