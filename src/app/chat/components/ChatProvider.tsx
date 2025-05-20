// ChatProvider.tsx
'use client';
/**
 * @file ChatProvider.tsx
 * @description This provider is responsible for orchestrating the initialization of the chat system.
 * It gathers all necessary data contexts (user, plan, session, loggedInMember, userProfile)
 * and then triggers the `loadChatConfiguration` action in `chatStore.ts`.
 * It ensures chat configuration is updated when the plan context changes (ID: 31146, ID: 31154).
 * It sources plan details like numberOfPlans and currentPlanName from `usePlanStore` (ID: 31146).
 */

import { getLoggedInMember } from '@/actions/memberDetails';
import type { LoggedInMember } from '@/models/app/loggedin_member';
import type { UserProfile } from '@/models/user_profile';
import type { SessionUser } from '@/userManagement/models/sessionUser';
import { usePlanStore } from '@/userManagement/stores/planStore';
import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePlanContext } from '../hooks/usePlanContext';
import { useUserContext } from '../hooks/useUserContext';
import {
  chatConfigSelectors,
  CurrentPlanDetails,
  useChatStore,
} from '../stores/chatStore';

const LOG_PREFIX = '[ChatProvider]';

interface ChatProviderProps {
  children: React.ReactNode;
  autoInitialize?: boolean;
  maxInitAttempts?: number;
  // staticChatConfig?: Partial<GenesysChatConfig>; // If you need global static overrides for buildGenesysChatConfig
}

export default function ChatProvider({
  children,
  autoInitialize = true,
  maxInitAttempts = 3,
}: ChatProviderProps) {
  const initializedRef = useRef(false);
  const initAttemptsRef = useRef(0);

  const [loggedInMemberDetails, setLoggedInMemberDetails] =
    useState<LoggedInMember | null>(null);
  const [isLoadingLoggedInMember, setIsLoadingLoggedInMember] = useState(true);

  // --- Data Sourcing: Replace placeholders with your actual logic ---
  const [userProfileData, setUserProfileData] = useState<UserProfile | null>(
    null,
  );
  const [isLoadingUserProfile, setIsLoadingUserProfile] = useState(true);

  const [mainAppPlanData, setMainAppPlanData] = useState<{
    numberOfPlans: number;
    currentPlanName: string;
    currentPlanLOB?: string;
    isLoaded: boolean; // Flag to know when this data is ready
  } | null>(null);
  const [isLoadingMainAppPlanData, setIsLoadingMainAppPlanData] =
    useState(true);
  // --- End Data Sourcing Placeholders ---

  const { data: session, status: sessionStatus } = useSession();
  const {
    plans: storePlans,
    selectedPlanId: storeSelectedPlanId,
    isLoading: isPlanStoreLoading,
  } = usePlanStore();

  useEffect(() => {
    logger.info(`${LOG_PREFIX} Component instance created. Initial props:`, {
      autoInitialize,
    });
  }, [autoInitialize]);

  const fetchLoggedInMemberData = useCallback(async () => {
    if (session && sessionStatus === 'authenticated') {
      if (isLoadingLoggedInMember === false && loggedInMemberDetails !== null) {
        // Already fetched and present
        return;
      }
      logger.info(
        `${LOG_PREFIX} Session authenticated. Fetching LoggedInMember details.`,
      );
      setIsLoadingLoggedInMember(true);
      try {
        const details = await getLoggedInMember(session);
        setLoggedInMemberDetails(details);
      } catch (error) {
        logger.error(
          `${LOG_PREFIX} Error fetching LoggedInMember details:`,
          error,
        );
        setLoggedInMemberDetails(null);
      } finally {
        setIsLoadingLoggedInMember(false);
      }
    } else if (sessionStatus !== 'loading') {
      setLoggedInMemberDetails(null);
      setIsLoadingLoggedInMember(false);
    }
  }, [session, sessionStatus, isLoadingLoggedInMember, loggedInMemberDetails]); // Added isLoading and details to prevent re-fetch if already loaded

  useEffect(() => {
    fetchLoggedInMemberData();
  }, [fetchLoggedInMemberData]);

  // Placeholder Effect for UserProfile - REPLACE THIS
  useEffect(() => {
    const sourceUserProfile = () => {
      setIsLoadingUserProfile(true);
      if (session?.user?.currUsr) {
        // Ideal: Your session.user.currUsr is already shaped like or contains UserProfile
        // This requires server-side setup in your next-auth callbacks (computeSessionUser)
        // For example:
        const currUsr = session.user.currUsr as any; // Cast for example
        setUserProfileData({
          id: currUsr.umpi || session.user.id || 'unknown_user_id',
          firstName: currUsr.firstName,
          lastName: currUsr.lastName,
          dob: currUsr.dob || currUsr.dateOfBirth,
          // ... map other UserProfile fields from currUsr ...
        } as UserProfile);
        logger.info(
          `${LOG_PREFIX} UserProfile data sourced from session.user.currUsr.`,
        );
      } else if (sessionStatus === 'authenticated') {
        logger.warn(
          `${LOG_PREFIX} Session authenticated but currUsr not (yet) available for UserProfile.`,
        );
        // If UserProfile needs a separate fetch, do it here, but prefer session enrichment.
        // For now, setting to null if not in session.
        setUserProfileData(null);
      } else {
        setUserProfileData(null);
      }
      setIsLoadingUserProfile(false);
    };

    if (
      sessionStatus === 'authenticated' ||
      sessionStatus === 'unauthenticated'
    ) {
      sourceUserProfile();
    }
  }, [session, sessionStatus]);

  // Placeholder Effect for Main Application Plan Data - REPLACE THIS
  useEffect(() => {
    const sourceMainAppPlanData = () => {
      if (isPlanStoreLoading) {
        logger.info(`${LOG_PREFIX} Waiting for planStore to finish loading...`);
        return;
      }
      setIsLoadingMainAppPlanData(true);

      logger.info(
        `${LOG_PREFIX} Sourcing main application plan data from usePlanStore.`,
      );

      if (storePlans && storePlans.length > 0 && storeSelectedPlanId) {
        const selectedPlan = storePlans.find(
          (p) => p.id === storeSelectedPlanId,
        );
        setMainAppPlanData({
          numberOfPlans: storePlans.length,
          currentPlanName: selectedPlan?.name || 'Unknown Plan Name',
          currentPlanLOB: undefined,
          isLoaded: true,
        });
      } else if (storePlans && storePlans.length > 0 && !storeSelectedPlanId) {
        logger.warn(
          `${LOG_PREFIX} planStore has plans, but no selectedPlanId. Using first plan as default.`,
        );
        const defaultPlan = storePlans[0];
        setMainAppPlanData({
          numberOfPlans: storePlans.length,
          currentPlanName: defaultPlan?.name || 'Default Plan Name',
          currentPlanLOB: undefined,
          isLoaded: true,
        });
      } else {
        logger.warn(
          `${LOG_PREFIX} planStore data not fully available (plans empty or no selectedId). Using fallback plan details.`,
          { numPlans: storePlans?.length, selectedId: storeSelectedPlanId },
        );
        setMainAppPlanData({
          numberOfPlans: storePlans?.length || 1,
          currentPlanName: 'Loading Plan...',
          currentPlanLOB: undefined,
          isLoaded: false,
        });
      }
      setIsLoadingMainAppPlanData(false);
    };

    if (
      sessionStatus === 'authenticated' ||
      sessionStatus === 'unauthenticated'
    ) {
      sourceMainAppPlanData();
    }
  }, [sessionStatus, storePlans, storeSelectedPlanId, isPlanStoreLoading]);

  const { userContext, isUserContextLoading } = useUserContext();
  const {
    planContext,
    isPlanContextLoading,
    error: planContextError,
  } = usePlanContext();

  const isLoadingConfigStore = useChatStore(chatConfigSelectors.isLoading);
  const configErrorStore = useChatStore(chatConfigSelectors.error);
  const loadChatConfiguration = useChatStore(
    (state) => state.actions.loadChatConfiguration,
  );
  const setErrorStore = useChatStore((state) => state.actions.setError);

  const initializeChatConfig = useCallback(() => {
    if (!autoInitialize || initializedRef.current || isLoadingConfigStore) {
      return;
    }

    if (
      isUserContextLoading ||
      isPlanContextLoading ||
      isLoadingLoggedInMember ||
      isLoadingUserProfile ||
      isLoadingMainAppPlanData ||
      sessionStatus === 'loading'
    ) {
      logger.info(`${LOG_PREFIX} Waiting for all data contexts to load...`);
      return;
    }

    if (initAttemptsRef.current >= maxInitAttempts) {
      logger.warn(`${LOG_PREFIX} Max init attempts reached. Halting.`);
      if (!configErrorStore && !planContextError)
        setErrorStore(new Error('ChatProvider: Max init attempts.'));
      return;
    }
    initAttemptsRef.current += 1;

    if (planContextError) {
      logger.error(
        `${LOG_PREFIX} Plan context hook error. Halting.`,
        planContextError,
      );
      if (!configErrorStore) setErrorStore(planContextError);
      initializedRef.current = true; // Prevent further attempts for this error
      return;
    }

    if (
      !session?.user ||
      !userContext ||
      !planContext ||
      !loggedInMemberDetails ||
      !userProfileData ||
      !mainAppPlanData?.isLoaded
    ) {
      logger.warn(
        `${LOG_PREFIX} Not all required data objects are ready yet. Attempt: ${initAttemptsRef.current}.`,
      );
      // Retry will be triggered by useEffect if loading states change.
      return;
    }

    const apiCallMemberId = userContext.userID;
    const apiCallPlanId = planContext.planId || 'FALLBACK_PLAN_ID'; // Ensure a fallback if planId can be undefined

    const currentPlanDetailsForBuild: CurrentPlanDetails = {
      numberOfPlans: mainAppPlanData.numberOfPlans,
      currentPlanName: mainAppPlanData.currentPlanName,
      currentPlanLOB: mainAppPlanData.currentPlanLOB,
    };

    logger.info(
      `${LOG_PREFIX} All data ready. Calling loadChatConfiguration. Attempt: ${initAttemptsRef.current}`,
    );
    initializedRef.current = true;

    loadChatConfiguration(
      apiCallMemberId,
      apiCallPlanId,
      loggedInMemberDetails,
      session.user as SessionUser, // Ensure session.user aligns with SessionUser type
      userProfileData,
      currentPlanDetailsForBuild,
    ).catch((e) => {
      logger.error(
        `${LOG_PREFIX} loadChatConfiguration call failed externally.`,
        e,
      );
      // Ensure error is set in the store if the promise from the action rejects
      if (!useChatStore.getState().config.error) {
        setErrorStore(
          e instanceof Error
            ? e
            : new Error('Chat configuration loading failed'),
        );
      }
    });
  }, [
    autoInitialize,
    isLoadingConfigStore,
    maxInitAttempts,
    session,
    sessionStatus,
    userContext,
    isUserContextLoading,
    planContext,
    isPlanContextLoading,
    planContextError,
    loggedInMemberDetails,
    isLoadingLoggedInMember,
    userProfileData,
    isLoadingUserProfile,
    mainAppPlanData,
    isLoadingMainAppPlanData,
    loadChatConfiguration,
    setErrorStore,
    configErrorStore,
  ]);

  useEffect(() => {
    // Trigger initialization when session is authenticated and not already initialized
    // OR if any of the dependencies of initializeChatConfig change (which includes loading states),
    // allowing for retries as data becomes available.
    if (sessionStatus === 'authenticated' && !initializedRef.current) {
      initializeChatConfig();
    } else if (sessionStatus === 'unauthenticated' && !initializedRef.current) {
      logger.warn(
        `${LOG_PREFIX} Session unauthenticated. Chat initialization not performed.`,
      );
      // No error set here, as chat might just be unavailable for unauth users.
      // If an error *should* be set, add:
      // if (!configErrorStore) setErrorStore(new Error('User unauthenticated for chat.'));
      initializedRef.current = true; // Mark as "handled" for unauthenticated case
    }
  }, [initializeChatConfig, sessionStatus, configErrorStore, setErrorStore]); // Add configErrorStore for re-evaluation

  return <>{children}</>;
}
