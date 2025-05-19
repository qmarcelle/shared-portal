'use client';

/**
 * @file ChatProvider.tsx
 * @description This component is responsible for initializing the chat store (`chatStore.ts`)
 * with essential user and plan context once the chat system is loaded (typically by `ChatLazyLoader`).
 * It fetches user context (via `useUserContext`) and plan context (via `usePlanContext`)
 * and then triggers the `loadChatConfiguration` action in the chat store.
 * As per README.md: "Initializes store with user/plan context (once loaded by `ChatLazyLoader`)."
 * It ensures that chat configuration is loaded only when all necessary context data is available.
 */

import { logger } from '@/utils/logger';
import { useEffect, useState } from 'react';
import { usePlanContext } from '../hooks/usePlanContext';
import { useUserContext } from '../hooks/useUserContext';
import { chatConfigSelectors, useChatStore } from '../stores/chatStore';

const LOG_PREFIX = '[ChatProvider]';

interface ChatProviderProps {
  /** Children to render */
  children: React.ReactNode;
  /** Whether to auto-initialize chat on mount */
  autoInitialize?: boolean;
  /** Maximum number of initialization attempts to prevent loops */
  maxInitAttempts?: number;
  /** Show initialization errors in console */
  verbose?: boolean;
}

export default function ChatProvider({
  children,
  autoInitialize = true,
  maxInitAttempts = 3, // Increased default for robustness
  verbose = process.env.NODE_ENV === 'development', // Verbose in dev by default
}: ChatProviderProps) {
  // Initialization tracking
  const [initAttempts, setInitAttempts] = useState(0);
  const [initialized, setInitialized] = useState(false); // Tracks if loadChatConfiguration has been called

  logger.info(`${LOG_PREFIX} Component instance created.`, {
    autoInitialize,
    initialized,
    initAttempts,
  });

  // Get user and plan context
  const { userContext, isUserContextLoading } = useUserContext();
  const {
    planContext,
    isPlanContextLoading,
    error: planError,
  } = usePlanContext();

  // Get chat store state and actions
  const isLoadingConfig = useChatStore(chatConfigSelectors.isLoading);
  const configError = useChatStore(chatConfigSelectors.error);
  const loadChatConfiguration = useChatStore(
    (state) => state.actions.loadChatConfiguration,
  );
  const setError = useChatStore((state) => state.actions.setError);

  // Initialize chat configuration when contexts are ready
  useEffect(() => {
    logger.info(`${LOG_PREFIX} useEffect triggered.`, {
      autoInitialize,
      initialized,
      initAttempts,
      isUserContextLoading,
      isPlanContextLoading,
      isLoadingConfig,
    });

    if (!autoInitialize || initialized || isLoadingConfig) {
      if (isLoadingConfig)
        logger.info(
          `${LOG_PREFIX} Skipping: Chat configuration is already loading in store.`,
        );
      else if (initialized)
        logger.info(
          `${LOG_PREFIX} Skipping: Chat already initialized by this provider instance.`,
        );
      else logger.info(`${LOG_PREFIX} Skipping: Auto-initialize is false.`);
      return;
    }

    if (initAttempts >= maxInitAttempts) {
      logger.warn(
        `${LOG_PREFIX} Exceeded maximum initialization attempts. Halting.`,
        {
          attempts: initAttempts,
          max: maxInitAttempts,
        },
      );
      setError(new Error('ChatProvider: Max initialization attempts reached.'));
      return;
    }

    if (verbose) {
      logger.info(`${LOG_PREFIX} Context status:`, {
        isUserContextLoading,
        userContextProvided: !!userContext,
        isPlanContextLoading,
        planContextProvided: !!planContext,
        planError: planError?.message,
      });
    }

    if (isUserContextLoading || isPlanContextLoading) {
      logger.info(
        `${LOG_PREFIX} Waiting for user/plan contexts to load... Attempt: ${initAttempts + 1}`,
      );
      return;
    }

    setInitAttempts((prev) => prev + 1);
    logger.info(
      `${LOG_PREFIX} Initialization attempt ${initAttempts + 1}/${maxInitAttempts}.`,
    );

    if (planError) {
      logger.error(
        `${LOG_PREFIX} Plan context error. Halting initialization.`,
        planError,
      );
      setError(planError);
      setInitialized(true);
      return;
    }

    if (!userContext?.memberId || !planContext?.planId) {
      logger.warn(
        `${LOG_PREFIX} Missing required context values (memberId or planId). Halting for now. Will retry if contexts update.`,
        {
          userContext,
          planContext,
          hasMemberId: !!userContext?.memberId,
          hasPlanId: !!planContext?.planId,
        },
      );
      return;
    }

    logger.info(
      `${LOG_PREFIX} All contexts loaded and validated. Calling loadChatConfiguration.`,
      {
        memberId: userContext.memberId,
        planId: planContext.planId,
        attempt: initAttempts + 1,
        userContext,
        planContext,
      },
    );

    setInitialized(true);

    loadChatConfiguration(
      userContext.memberId,
      planContext.planId,
      userContext.memberType,
      userContext,
      planContext,
    )
      .then(() => {
        logger.info(`${LOG_PREFIX} loadChatConfiguration promise resolved.`);
      })
      .catch((loadError) => {
        logger.error(`${LOG_PREFIX} loadChatConfiguration promise rejected.`, {
          loadError,
        });
      });
  }, [
    autoInitialize,
    initialized,
    initAttempts,
    maxInitAttempts,
    userContext,
    planContext,
    isUserContextLoading,
    isPlanContextLoading,
    planError,
    loadChatConfiguration,
    setError,
    verbose,
    isLoadingConfig,
  ]);

  useEffect(() => {
    if (configError) {
      logger.error(
        `${LOG_PREFIX} Chat configuration error from store:`,
        configError.message,
      );
    }
  }, [configError]);

  logger.info(`${LOG_PREFIX} Rendering children.`);
  console.log('[ChatProvider] Module loaded');
  console.log('[ChatProvider] Component rendered');
  logger.info('[ChatProvider] Component rendered');
  return <>{children}</>;
}
