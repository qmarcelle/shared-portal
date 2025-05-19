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
import { useEffect, useState } from 'react';
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

export default function ChatProvider({
  children,
  autoInitialize = true,
  maxInitAttempts = 3,
  verbose = process.env.NODE_ENV === 'development',
}: ChatProviderProps) {
  const [initAttempts, setInitAttempts] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [loggedInMemberDetails, setLoggedInMemberDetails] = useState<
    any | null
  >(null); // Using any for now
  const [isLoadingLoggedInMember, setIsLoadingLoggedInMember] = useState(true);
  const { data: session, status: sessionStatus } = useSession();

  logger.info(`${LOG_PREFIX} Component instance created.`, {
    autoInitialize,
    initialized,
    initAttempts,
  });

  // Fetch LoggedInMember details when session is available
  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (session && sessionStatus === 'authenticated') {
        logger.info(
          `${LOG_PREFIX} Session available. Fetching loggedInMemberDetails.`,
        );
        setIsLoadingLoggedInMember(true);
        try {
          const details = await getLoggedInMember(session as any); // Pass session, cast to any if type is complex
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
    };

    fetchMemberDetails();
  }, [session, sessionStatus]);

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
      isLoadingLoggedInMember,
    });

    // Expose chatStore to window in development mode for debugging
    if (
      process.env.NODE_ENV === 'development' &&
      typeof window !== 'undefined'
    ) {
      window.useChatStore = useChatStore;
      logger.info(
        `${LOG_PREFIX} Exposed useChatStore to window for debugging.`,
      );
    }

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

    if (
      isUserContextLoading ||
      isPlanContextLoading ||
      isLoadingLoggedInMember
    ) {
      logger.info(
        `${LOG_PREFIX} Waiting for user/plan contexts or member details to load... Attempt: ${initAttempts + 1}`,
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

    // Ensure planContext and its required fields for PlanConfig are valid
    // planContext.planId is used as a separate arg to loadChatConfiguration
    // planContext.memberMedicalPlanID is needed for the PlanConfig object
    if (
      !userContext?.memberId ||
      !planContext?.planId ||
      !planContext.memberMedicalPlanID ||
      !loggedInMemberDetails
    ) {
      logger.warn(
        `${LOG_PREFIX} Missing required context values (memberId, planId, memberMedicalPlanID, or loggedInMemberDetails). Halting for now. Will retry if contexts update.`,
        {
          userContextProvided: !!userContext,
          planContextProvided: !!planContext,
          planIdProvided: !!planContext?.planId,
          memberMedicalPlanIDProvided: !!planContext?.memberMedicalPlanID,
          loggedInMemberDetailsProvided: !!loggedInMemberDetails,
        },
      );
      return;
    }

    // Construct augmentedPlanContext strictly according to PlanConfig
    const augmentedPlanContext: PlanConfig = {
      // Required fields from PlanConfig must be set
      memberMedicalPlanID: planContext.memberMedicalPlanID, // Now guaranteed by the check above
      groupId: loggedInMemberDetails.groupId,
      memberClientID: loggedInMemberDetails.lineOfBusiness,
      // Optional fields from PlanConfig can be added if available
      // Example: if loggedInMemberDetails has groupType, it could be assigned here:
      // groupType: loggedInMemberDetails.groupDetails?.groupType,
    };

    logger.info(
      `${LOG_PREFIX} All contexts loaded and validated. Calling loadChatConfiguration.`,
      {
        memberId: userContext.memberId,
        planId: planContext.planId, // Use original planContext.planId for the planId argument
        attempt: initAttempts + 1,
        userContext,
        augmentedPlanContext,
      },
    );

    setInitialized(true);

    loadChatConfiguration(
      userContext.memberId,
      planContext.planId, // Pass planContext.planId as the planId argument
      userContext.memberType,
      userContext,
      augmentedPlanContext, // Pass the correctly typed PlanConfig
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
    loggedInMemberDetails,
    isLoadingLoggedInMember,
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
