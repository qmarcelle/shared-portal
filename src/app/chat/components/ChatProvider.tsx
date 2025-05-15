'use client';

/**
 * ChatProvider Component
 *
 * Initializes the chat store with user and plan context.
 * Serves as a single initialization point for chat functionality.
 * Ensures chat configuration is loaded once user and plan contexts are available.
 */

import { logger } from '@/utils/logger';
import { useEffect, useState } from 'react';
import { usePlanContext } from '../hooks/usePlanContext';
import { useUserContext } from '../hooks/useUserContext';
import { chatConfigSelectors, useChatStore } from '../stores/chatStore';

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
  maxInitAttempts = 3,
  verbose = false,
}: ChatProviderProps) {
  // Initialization tracking
  const [initAttempts, setInitAttempts] = useState(0);
  const [initialized, setInitialized] = useState(false);

  // Get user and plan context
  const { userContext, isUserContextLoading } = useUserContext();
  const {
    planContext,
    isPlanContextLoading,
    error: planError,
  } = usePlanContext();

  // Get chat store state and actions
  const isLoading = useChatStore(chatConfigSelectors.isLoading);
  const configError = useChatStore(chatConfigSelectors.error);
  const loadChatConfiguration = useChatStore(
    (state) => state.actions.loadChatConfiguration,
  );
  const setError = useChatStore((state) => state.actions.setError);

  // Initialize chat configuration when contexts are ready
  useEffect(() => {
    // Skip if not auto-initializing or already initialized
    if (!autoInitialize || initialized) {
      return;
    }

    // Prevent excessive initialization attempts
    if (initAttempts >= maxInitAttempts) {
      logger.warn('[ChatProvider] Exceeded maximum initialization attempts', {
        attempts: initAttempts,
        max: maxInitAttempts,
      });
      return;
    }

    // Track initialization attempt
    setInitAttempts((prev) => prev + 1);

    // Skip if contexts are still loading
    if (isUserContextLoading || isPlanContextLoading) {
      verbose && logger.info('[ChatProvider] Waiting for contexts to load');
      return;
    }

    // Handle plan context error
    if (planError) {
      logger.error('[ChatProvider] Plan context error', planError);
      setError(planError);
      return;
    }

    // Validate required context values
    if (!userContext?.memberId || !planContext?.planId) {
      logger.warn('[ChatProvider] Missing required context values', {
        hasMemberId: !!userContext?.memberId,
        hasPlanId: !!planContext?.planId,
      });
      return;
    }

    // Load chat configuration
    logger.info('[ChatProvider] Initializing chat configuration', {
      memberId: userContext.memberId,
      planId: planContext.planId,
      attempt: initAttempts,
    });

    // Mark as initialized to prevent further attempts
    setInitialized(true);

    // Initialize chat store with context data
    loadChatConfiguration(
      userContext.memberId,
      planContext.planId,
      'byMemberCk',
      userContext,
      planContext,
    );
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
  ]);

  return <>{children}</>;
}
