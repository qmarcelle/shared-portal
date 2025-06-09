'use client';

/**
 * @file ChatLazyLoader.tsx
 * @description Component responsible for deferring the loading of the entire Genesys chat system
 * until explicit user interaction (e.g., clicking a "Chat with Us" button) or automatically.
 * This is a key performance optimization, preventing heavy chat scripts from impacting
 * initial page load times. It dynamically loads ChatProvider and ChatWidget.
 * As per README.md: Defers loading of the chat system until user interaction or auto-initializes.
 */

import { logger } from '@/utils/logger';
import { lazy, useCallback, useEffect, useRef, useState } from 'react';

const LOG_PREFIX = '[ChatLazyLoader]';

// Extend window interface for chat lazy loader flag
declare global {
  interface Window {
    _chatLazyLoaderInitialized?: boolean;
  }
}

interface ChatLazyLoaderProps {
  autoInitialize?: boolean;
}

// Prop types are inferred from the actual components when lazily loaded

// **CLOUD FLOW STEP 1** - Lazy load core chat components for performance optimization
const ChatProvider = lazy(() =>
  import('@/app/chat/components/ChatProvider').then((mod) => {
    logger.info(
      `${LOG_PREFIX} [CLOUD FLOW] ChatProvider component loaded via dynamic import. Ready for configuration loading.`,
    );
    return { default: mod.default };
  }),
);
const ChatWidget = lazy(() =>
  import('@/app/chat/components/ChatWidget').then((mod) => {
    logger.info(
      `${LOG_PREFIX} [CLOUD FLOW] ChatWidget component loaded via dynamic import. Ready for script loading and UI rendering.`,
    );
    return { default: mod.default };
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
      `${LOG_PREFIX} [CLOUD FLOW] initializeChat triggered for instance ${instanceId}. Starting chat system activation.`,
      {
        chatInitialized,
        isInstanceInitialized: isInstanceInitialized.current,
        autoInitialize,
      },
    );

    if (!isInstanceInitialized.current) {
      // **CLOUD FLOW STEP 2** - User interaction or auto-timer triggered chat initialization
      logger.info(
        `${LOG_PREFIX} [CLOUD FLOW] Activating chat system. This will render ChatProvider → ChatWidget → Configuration Loading.`,
      );

      setChatInitialized(true);
      isInstanceInitialized.current = true;

      // **FLOW CONTINUES** - Next step is React rendering ChatProvider component
      logger.info(
        `${LOG_PREFIX} [CLOUD FLOW] Chat system activated. Flow continues: ChatProvider will call chatStore.loadChatConfiguration().`,
      );
    } else {
      logger.info(
        `${LOG_PREFIX} [CLOUD FLOW] Chat system already initialized for this instance. Skipping duplicate activation.`,
      );
    }
  }, [instanceId, chatInitialized, autoInitialize]);

  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} Effect for auto-initialization running for instance ${instanceId}. autoInitialize: ${autoInitialize}, isInstanceInitialized (ref): ${isInstanceInitialized.current}, window._chatLazyLoaderInitialized: ${typeof window !== 'undefined' ? window._chatLazyLoaderInitialized : 'undefined'}`,
    );

    let timerId: ReturnType<typeof setTimeout> | undefined;

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
    <ChatProvider key={`chat-provider-${instanceId}`} autoInitialize={true}>
      <ChatWidget />
    </ChatProvider>
  );
};
