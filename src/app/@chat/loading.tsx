'use client';

import { logger } from '@/utils/logger';
import { useEffect } from 'react';

console.log('[ChatLoading] Loading component mounted');

/**
 * Loading state for the chat parallel route
 * This displays while the chat is being loaded
 */
export default function ChatLoading() {
  useEffect(() => {
    logger.info('[ChatLoading] Chat loading state active', {
      timestamp: new Date().toISOString(),
    });
  }, []);

  return (
    <div
      className="chat-loading-container p-4"
      role="status"
      aria-live="polite"
    >
      <div className="chat-loading-indicator flex items-center">
        <svg
          className="animate-spin h-5 w-5 mr-3 text-blue-600"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading chat...
      </div>
    </div>
  );
}
