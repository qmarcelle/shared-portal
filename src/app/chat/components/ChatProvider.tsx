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
// import type { LoggedInMember } from '@/actions/memberDetails';
// import { auth } from '@/auth';
import { logger } from '@/utils/logger';
// import type { Session } from 'next-auth';
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
  // REMOVED: verbose prop as it was unused
}

// Use React.memo to prevent re-renders when props don't change
export default function ChatProvider({
  children,
  autoInitialize = true,
  maxInitAttempts = 3,
  // REMOVED: verbose prop from destructuring
}: ChatProviderProps) {
  // Use useRef instead of useState where possible to reduce re-renders
  const initializedRef = useRef(false);
  const initAttemptsRef = useRef(0);
  const [loggedInMemberDetails, setLoggedInMemberDetails] = useState<
    any | null
  >(null); // Consider using a more specific type if available (e.g., LoggedInMember)
  const [isLoadingLoggedInMember, setIsLoadingLoggedInMember] = useState(true);
  const { data: session, status: sessionStatus } = useSession();

  // Only log once on initial mount
  useEffect(() => {
    // This effect now runs only once after the initial render.
    logger.info(`${LOG_PREFIX} Component instance created. Initial props:`, {
      autoInitialize: autoInitialize, // Logs the initial value of autoInitialize
      initialized: initializedRef.current, // Will be false here
      initAttempts: initAttemptsRef.current, // Will be 0 here
    });
    // mountedRef is no longer strictly needed if the effect runs once due to [] deps,
    // but can be kept if it's part of a pattern or for potential future use.
    // For a strict once-only effect, the mountedRef check is redundant.
  }, []); // Empty array for once-on-mount

  // Fetch LoggedInMember details when session is available
  const fetchMemberDetails = useCallback(async () => {
    if (session && sessionStatus === 'authenticated') {
      logger.info(
        `${LOG_PREFIX} Session available. Fetching loggedInMemberDetails.`,
      );
      setIsLoadingLoggedInMember(true);
      try {
        const details = await getLoggedInMember(session);
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
      if (!isLoadingLoggedInMember) setIsLoadingLoggedInMember(true);
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

  // Get chat store state and actions
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

    // Ensure loggedInMemberDetails has the expected structure before accessing properties
    // This adds type safety if 'any' is used for loggedInMemberDetails state
    if (
      typeof loggedInMemberDetails.groupId !== 'string' ||
      typeof loggedInMemberDetails.lineOfBusiness !== 'string'
    ) {
      logger.warn(
        `${LOG_PREFIX} loggedInMemberDetails missing expected fields (groupId, lineOfBusiness) for augmentedPlanContext.`,
      );
      return null;
    }

    return {
      memberMedicalPlanID: planContext.memberMedicalPlanID,
      groupId: loggedInMemberDetails.groupId,
      memberClientID: loggedInMemberDetails.lineOfBusiness,
    } as PlanConfig;
  }, [planContext?.memberMedicalPlanID, loggedInMemberDetails, planContext]); // Added planContext to deps if planContext.memberMedicalPlanID is used

  // Initialize chat configuration when contexts are ready
  const initializeChatConfig = useCallback(() => {
    if (!autoInitialize || initializedRef.current || isLoadingConfig) {
      return;
    }

    if (
      process.env.NODE_ENV === 'development' &&
      typeof window !== 'undefined' &&
      !window.useChatStore // Check before assigning
    ) {
      window.useChatStore = useChatStore;
      logger.info(
        `${LOG_PREFIX} Exposed useChatStore to window for debugging.`,
      );
    }

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
        // Avoid setting error if one is already being processed from config load
        if (!configError) {
          setError(
            new Error('ChatProvider: Max initialization attempts reached.'),
          );
        }
      }
      return;
    }

    initAttemptsRef.current += 1;

    if (planError) {
      logger.error(
        `${LOG_PREFIX} Plan context error. Halting initialization.`,
        planError,
      );
      if (!configError) setError(planError); // Avoid overwriting existing config error
      initializedRef.current = true; // Stop further attempts for this error
      return;
    }

    if (
      !userContext?.memberId ||
      !planContext?.planId || // Check planContext itself too
      !augmentedPlanContext
    ) {
      logger.warn(
        `${LOG_PREFIX} Missing required context values (memberId, planId, or augmentedPlanContext). Halting for now. Will retry if contexts update.`,
        {
          hasUserMemberId: !!userContext?.memberId,
          hasPlanId: !!planContext?.planId,
          hasAugmentedContext: !!augmentedPlanContext,
          isUserCtxLoading: isUserContextLoading,
          isPlanCtxLoading: isPlanContextLoading,
          isMemberDetailsLoading: isLoadingLoggedInMember,
        },
      );
      return;
    }

    logger.info(
      `${LOG_PREFIX} All contexts loaded and validated. Attempting to call loadChatConfiguration. Attempt: ${initAttemptsRef.current}`,
      { userContext, planContext, augmentedPlanContext }, // Log the contexts being used
    );

    initializedRef.current = true;

    loadChatConfiguration(
      userContext.memberId,
      planContext.planId,
      userContext.memberType,
      userContext, // Pass the whole userContext as per original
      augmentedPlanContext,
    )
      .then(() => {
        logger.info(
          `${LOG_PREFIX} loadChatConfiguration promise resolved successfully.`,
        );
      })
      .catch((loadError) => {
        // Error is already set by loadChatConfiguration internally if it rejects
        logger.error(
          `${LOG_PREFIX} loadChatConfiguration promise rejected or failed.`,
          {
            loadError,
          },
        );
        // Re-arm for another attempt if it's not a permanent error, by resetting initializedRef
        // This depends on the desired retry strategy for loadChatConfiguration failures.
        // For now, keeping initializedRef.current = true to prevent loops on persistent errors.
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
    planContext, // Make sure planContext object is stable or its relevant fields are deps
    augmentedPlanContext,
    loadChatConfiguration,
    setError,
    configError, // Added configError to dependencies
  ]);

  useEffect(() => {
    initializeChatConfig();
  }, [initializeChatConfig]);

  useEffect(() => {
    if (configError) {
      logger.error(
        `${LOG_PREFIX} Chat configuration error from store:`,
        configError.message, // Log only message if error object itself is logged elsewhere or too verbose
      );
    }
  }, [configError]);

  if (process.env.NODE_ENV === 'development') {
    // This log can be noisy if ChatProvider wraps many components or re-renders often.
    // Consider if it's essential for every render.
    // logger.info(`${LOG_PREFIX} Rendering children.`);
  }

  return <>{children}</>;
}

// Ensure window augmentation for useChatStore is correctly typed if possible
declare global {
  interface Window {
    useChatStore?: typeof useChatStore;
  }
}
