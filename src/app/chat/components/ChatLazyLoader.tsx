'use client';

/**
 * @file ChatLazyLoader.tsx
 * @description Component responsible for deferring the loading of the entire Genesys chat system
 * until explicit user interaction (e.g., clicking a "Chat with Us" button) or automatically.
 * This is a key performance optimization, preventing heavy chat scripts from impacting
 * initial page load times. It dynamically loads ChatProvider, ChatWidget, and ChatControls.
 * As per README.md: Defers loading of the chat system until user interaction or auto-initializes.
 */

import { logger } from '@/utils/logger';
import React, {
  ComponentType,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

const LOG_PREFIX = '[ChatLazyLoader]';

// Extend window interface for the global flag
declare global {
  interface Window {
    _chatLazyLoaderInitialized?: boolean;
  }
}

interface ChatLazyLoaderProps {
  autoInitialize?: boolean;
}

// Define prop types for the lazily loaded components
interface ChatProviderProps {
  children: React.ReactNode;
  autoInitialize?: boolean;
  maxInitAttempts?: number;
}

interface ChatWidgetProps {
  containerId?: string;
  showLoaderStatus?: boolean;
  forceFallbackButton?: boolean;
}

const ChatProvider = lazy(() =>
  import('@/app/chat/components/ChatProvider').then((mod) => ({
    default: mod.default as ComponentType<ChatProviderProps>,
  })),
);
const ChatWidget = lazy(() =>
  import('@/app/chat/components/ChatWidget').then((mod) => ({
    default: mod.default as ComponentType<ChatWidgetProps>,
  })),
);

// Global check (use with caution, ref is preferred)
if (
  typeof window !== 'undefined' &&
  typeof window._chatLazyLoaderInitialized === 'undefined'
) {
  window._chatLazyLoaderInitialized = false;
}

export const ChatLazyLoader: React.FC<ChatLazyLoaderProps> = ({
  autoInitialize = true,
}) => {
  const [chatInitialized, setChatInitialized] = useState(false);
  const isInitialized = useRef(false); // Ref to track initialization

  const initializeChat = useCallback(() => {
    logger.info(`${LOG_PREFIX} initializeChat triggered`);
    setChatInitialized(true);
  }, [setChatInitialized]);

  useEffect(() => {
    if (autoInitialize && !isInitialized.current) {
      const timer = setTimeout(() => {
        logger.info(`${LOG_PREFIX} Auto-initialization timer fired.`);
        try {
          initializeChat();
          logger.info(`${LOG_PREFIX} initializeChat called successfully`);
          isInitialized.current = true; // Mark as initialized
        } catch (error) {
          logger.error(`${LOG_PREFIX} Error in auto-initialization:`, error);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }

    // Global check (use with caution, ref is preferred)
    // Ensure window is defined before accessing _chatLazyLoaderInitialized
    if (
      autoInitialize &&
      typeof window !== 'undefined' &&
      !window._chatLazyLoaderInitialized
    ) {
      const timer = setTimeout(() => {
        logger.info(`${LOG_PREFIX} Global auto-initialization timer fired.`);
        try {
          initializeChat();
          logger.info(
            `${LOG_PREFIX} Global initializeChat called successfully`,
          );
          isInitialized.current = true; // Mark as initialized
          window._chatLazyLoaderInitialized = true;
        } catch (error) {
          logger.error(
            `${LOG_PREFIX} Global Error in auto-initialization:`,
            error,
          );
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoInitialize, initializeChat]);

  if (!chatInitialized) {
    logger.info(
      `${LOG_PREFIX} Chat not yet initialized. ${
        autoInitialize
          ? 'Auto-initializing...'
          : 'Rendering initialization button.'
      }`,
    );
    return autoInitialize ? (
      <div data-testid="chat-lazy-loader-auto-initializing">
        Initializing Chat...
      </div>
    ) : (
      <button onClick={initializeChat} data-testid="chat-lazy-loader-button">
        Open Chat
      </button>
    );
  }

  logger.info(
    `${LOG_PREFIX} Chat initialized. Rendering ChatProvider and ChatWidget.`,
  );
  logger.info('[ChatLazyLoader] About to render ChatProvider');

  return (
    <Suspense fallback={<div>Loading Chat UI...</div>}>
      <ChatProvider>
        <ChatWidget />
      </ChatProvider>
    </Suspense>
  );
};

// Add TypeScript interface for global window object if not already present globally
declare global {
  interface Window {
    dataLayer?: unknown[]; // For Google Tag Manager or similar analytics
  }
}
