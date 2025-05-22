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
  import('@/app/chat/components/ChatProvider').then((mod) => {
    logger.info(`${LOG_PREFIX} Dynamic import for ChatProvider resolved.`);
    return { default: mod.default as ComponentType<ChatProviderProps> };
  }),
);
const ChatWidget = lazy(() =>
  import('@/app/chat/components/ChatWidget').then((mod) => {
    logger.info(`${LOG_PREFIX} Dynamic import for ChatWidget resolved.`);
    return { default: mod.default as ComponentType<ChatWidgetProps> };
  }),
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
  const isInstanceInitialized = useRef(false); // Tracks if THIS instance has completed its initialization attempt
  const instanceId = useRef(
    `lazy-loader-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  ).current;

  // Log mount and unmount of ChatLazyLoader
  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} ========== ChatLazyLoader MOUNTED ========== Instance: ${instanceId}, autoInitialize: ${autoInitialize}`,
    );
    return () => {
      logger.warn(
        `${LOG_PREFIX} ========== ChatLazyLoader UNMOUNTING ========== Instance: ${instanceId}`,
      );
    };
  }, [instanceId, autoInitialize]);

  const initializeChat = useCallback(() => {
    logger.info(
      `${LOG_PREFIX} initializeChat called for instance ${instanceId}. Current chatInitialized (from state): ${chatInitialized}, isInstanceInitialized (ref): ${isInstanceInitialized.current}`,
    );
    if (!isInstanceInitialized.current) {
      setChatInitialized(true);
      isInstanceInitialized.current = true;
      logger.info(
        `${LOG_PREFIX} Instance ${instanceId}: Set chatInitialized to true. isInstanceInitialized set to true.`,
      );
    } else {
      logger.info(
        `${LOG_PREFIX} Instance ${instanceId}: initializeChat called but isInstanceInitialized was already true. No action taken.`,
      );
    }
  }, [instanceId]);

  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} Effect for auto-initialization running for instance ${instanceId}. autoInitialize: ${autoInitialize}, isInstanceInitialized (ref): ${isInstanceInitialized.current}, window._chatLazyLoaderInitialized: ${typeof window !== 'undefined' ? window._chatLazyLoaderInitialized : 'undefined'}`,
    );

    let timerId: NodeJS.Timeout | undefined;

    if (autoInitialize && !isInstanceInitialized.current) {
      logger.info(
        `${LOG_PREFIX} Instance ${instanceId}: autoInitialize is true and this instance is not yet initialized. Starting timer.`,
      );
      timerId = setTimeout(() => {
        logger.info(
          `${LOG_PREFIX} Instance ${instanceId}: Auto-initialization timer fired. Calling initializeChat.`,
        );
        try {
          initializeChat();
          if (typeof window !== 'undefined')
            window._chatLazyLoaderInitialized = true;
        } catch (error) {
          logger.error(
            `${LOG_PREFIX} Instance ${instanceId}: Error in auto-initialization timer callback:`,
            error,
          );
        }
      }, 3000);
    } else if (isInstanceInitialized.current) {
      logger.info(
        `${LOG_PREFIX} Instance ${instanceId}: Already initialized by this instance. No timer needed.`,
      );
    } else if (!autoInitialize) {
      logger.info(
        `${LOG_PREFIX} Instance ${instanceId}: autoInitialize is false. Waiting for manual trigger if any.`,
      );
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
        logger.info(
          `${LOG_PREFIX} Instance ${instanceId}: Cleared auto-initialization timer on unmount/re-effect.`,
        );
      }
    };
  }, [autoInitialize, initializeChat, instanceId]);

  logger.info(
    `${LOG_PREFIX} Rendering for instance ${instanceId}. chatInitialized (state): ${chatInitialized}, autoInitialize: ${autoInitialize}`,
  );

  if (!chatInitialized) {
    return autoInitialize ? (
      <div data-testid="chat-lazy-loader-auto-initializing">
        {/* Chat will initialize automatically... (Silent for user unless error) */}
      </div>
    ) : (
      <button onClick={initializeChat} data-testid="chat-lazy-loader-button">
        Open Chat (Manual Init)
      </button>
    );
  }

  logger.info(
    `${LOG_PREFIX} Instance ${instanceId}: chatInitialized is true. Rendering ChatProvider and ChatWidget.`,
  );

  return (
    <Suspense fallback={<div>Loading Chat Modules...</div>}>
      <ChatProvider key={`chat-provider-${instanceId}`} autoInitialize={true}>
        <div id="genesys-chat-container" className="genesys-chat-container">
          <ChatWidget />
        </div>
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
