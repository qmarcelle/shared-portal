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

import { getLoggedInMember } from '@/actions/memberDetails';
// import type { LoggedInMember } from '@/actions/memberDetails'; // Temporarily remove if not exported
// import { auth } from '@/auth'; // Assuming getLoggedInMember handles auth if session is not passed
import { logger } from '@/utils/logger';
// import type { Session } from 'next-auth'; // Not strictly needed if session object is passed as any or its structure is simple for getLoggedInMember
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PlanConfig } from '../genesysChatConfig';
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

// Use React.memo to prevent re-renders when props don't change
export default function ChatProvider({
  children,
  autoInitialize = true,
  maxInitAttempts = 3,
  verbose = process.env.NODE_ENV === 'development',
}: ChatProviderProps) {
  // Use useRef instead of useState where possible to reduce re-renders
  const initializedRef = useRef(false);
  const initAttemptsRef = useRef(0);
  const [loggedInMemberDetails, setLoggedInMemberDetails] = useState<
    any | null
  >(null);
  const [isLoadingLoggedInMember, setIsLoadingLoggedInMember] = useState(true);
  const { data: session, status: sessionStatus } = useSession();

  // Only log once on initial mount
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      logger.info(`${LOG_PREFIX} Component instance created.`, {
        autoInitialize,
        initialized: initializedRef.current,
        initAttempts: initAttemptsRef.current,
      });
      mountedRef.current = true;
    }
  }, [autoInitialize]);

  // Fetch LoggedInMember details when session is available
  const fetchMemberDetails = useCallback(async () => {
    if (session && sessionStatus === 'authenticated') {
      logger.info(
        `${LOG_PREFIX} Session available. Fetching loggedInMemberDetails.`,
      );
      setIsLoadingLoggedInMember(true);
      try {
        const details = await getLoggedInMember(session as any);
        setLoggedInMemberDetails(details);
        logger.info(
          `${LOG_PREFIX} Successfully fetched loggedInMemberDetails.`,
          { detailsFound: !!details },
        );
      } catch (error) {
        logger.error(
          `${LOG_PREFIX} Error fetching loggedInMemberDetails:`,
          error,
        );
        setLoggedInMemberDetails(null);
      } finally {
        setIsLoadingLoggedInMember(false);
      }
    } else if (sessionStatus === 'unauthenticated') {
      logger.warn(
        `${LOG_PREFIX} Session unauthenticated. Cannot fetch loggedInMemberDetails.`,
      );
      setLoggedInMemberDetails(null);
      setIsLoadingLoggedInMember(false);
    } else if (sessionStatus === 'loading') {
      logger.info(
        `${LOG_PREFIX} Session is loading. Waiting to fetch loggedInMemberDetails.`,
      );
      setIsLoadingLoggedInMember(true);
    }
  }, [session, sessionStatus]);

  useEffect(() => {
    fetchMemberDetails();
  }, [fetchMemberDetails]);

  // Get user and plan context
  const { userContext, isUserContextLoading } = useUserContext();
  const {
    planContext,
    isPlanContextLoading,
    error: planError,
  } = usePlanContext();

  // Get chat store state and actions - use memoization to prevent unnecessary re-renders
  const isLoadingConfig = useChatStore(chatConfigSelectors.isLoading);
  const configError = useChatStore(chatConfigSelectors.error);
  const loadChatConfiguration = useChatStore(
    (state) => state.actions.loadChatConfiguration,
  );
  const setError = useChatStore((state) => state.actions.setError);

  // Memoize the augmented plan context to prevent unnecessary recalculations
  const augmentedPlanContext = useMemo(() => {
    if (!planContext?.memberMedicalPlanID || !loggedInMemberDetails) {
      return null;
    }

    return {
      memberMedicalPlanID: planContext.memberMedicalPlanID,
      groupId: loggedInMemberDetails.groupId,
      memberClientID: loggedInMemberDetails.lineOfBusiness,
    } as PlanConfig;
  }, [planContext?.memberMedicalPlanID, loggedInMemberDetails]);

  // Initialize chat configuration when contexts are ready
  // Use useCallback to memoize the initialization function
  const initializeChatConfig = useCallback(() => {
    // Skip if already initialized or loading
    if (!autoInitialize || initializedRef.current || isLoadingConfig) {
      return;
    }

    // Expose chatStore to window in development mode for debugging
    if (
      process.env.NODE_ENV === 'development' &&
      typeof window !== 'undefined' &&
      !window.useChatStore
    ) {
      window.useChatStore = useChatStore;
      logger.info(
        `${LOG_PREFIX} Exposed useChatStore to window for debugging.`,
      );
    }

    // Skip if waiting for data or exceeded max attempts
    if (
      initAttemptsRef.current >= maxInitAttempts ||
      isUserContextLoading ||
      isPlanContextLoading ||
      isLoadingLoggedInMember
    ) {
      if (initAttemptsRef.current >= maxInitAttempts) {
        logger.warn(
          `${LOG_PREFIX} Exceeded maximum initialization attempts. Halting.`,
          {
            attempts: initAttemptsRef.current,
            max: maxInitAttempts,
          },
        );
        setError(
          new Error('ChatProvider: Max initialization attempts reached.'),
        );
      }
      return;
    }

    initAttemptsRef.current += 1;

    // Check for errors
    if (planError) {
      logger.error(
        `${LOG_PREFIX} Plan context error. Halting initialization.`,
        planError,
      );
      setError(planError);
      initializedRef.current = true;
      return;
    }

    // Validate required data
    if (
      !userContext?.memberId ||
      !planContext?.planId ||
      !augmentedPlanContext
    ) {
      logger.warn(
        `${LOG_PREFIX} Missing required context values. Halting for now. Will retry if contexts update.`,
      );
      return;
    }

    logger.info(
      `${LOG_PREFIX} All contexts loaded and validated. Calling loadChatConfiguration.`,
    );

    initializedRef.current = true;

    // Load chat configuration
    loadChatConfiguration(
      userContext.memberId,
      planContext.planId,
      userContext.memberType,
      userContext,
      augmentedPlanContext,
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
    maxInitAttempts,
    isUserContextLoading,
    isPlanContextLoading,
    isLoadingLoggedInMember,
    isLoadingConfig,
    planError,
    userContext,
    planContext,
    augmentedPlanContext,
    loadChatConfiguration,
    setError,
  ]);

  // Run initialization effect with optimized dependencies
  useEffect(() => {
    initializeChatConfig();
  }, [initializeChatConfig]);

  // Log errors, but only when they change
  useEffect(() => {
    if (configError) {
      logger.error(
        `${LOG_PREFIX} Chat configuration error from store:`,
        configError.message,
      );
    }
  }, [configError]);

  // Log rendering only in development
  if (process.env.NODE_ENV === 'development') {
    logger.info(`${LOG_PREFIX} Rendering children.`);
  }

  // Simply return children without unnecessary logs that trigger re-renders
  return <>{children}</>;
}
