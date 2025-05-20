// ChatProvider.tsx (Updated based on your latest version and log analysis)
'use client';

import { getLoggedInMember } from '@/actions/memberDetails';
import type { LoggedInMember } from '@/models/app/loggedin_member';
import type { PBEData } from '@/models/member/api/pbeData';
import type { UserProfile } from '@/models/user_profile';
import type { MemberPlan } from '@/userManagement/models/plan';
import type { SessionUser } from '@/userManagement/models/sessionUser';
import { usePlanStore } from '@/userManagement/stores/planStore';
import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { logger } from '@/utils/logger';
import { computeUserProfilesFromPbe } from '@/utils/profile_computer';
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
}

export default function ChatProvider({
  children,
  autoInitialize = true,
  maxInitAttempts = 3,
}: ChatProviderProps) {
  const initializedRef = useRef(false); // Tracks if loadChatConfiguration has been successfully called for current context
  const initAttemptsRef = useRef(0);
  const previousSelectedPlanIdRef = useRef<string | null | undefined>(null);

  const [loggedInMemberDetails, setLoggedInMemberDetails] =
    useState<LoggedInMember | null>(null);
  const [isLoadingLoggedInMember, setIsLoadingLoggedInMember] = useState(true);

  const [pbeData, setPbeData] = useState<PBEData | null>(null);
  const [isLoadingPbeData, setIsLoadingPbeData] = useState(true);

  const [userProfileData, setUserProfileData] = useState<UserProfile | null>(
    null,
  );
  const [isLoadingUserProfile, setIsLoadingUserProfile] = useState(true);

  const [mainAppPlanData, setMainAppPlanData] = useState<{
    numberOfPlans: number;
    selectedPlan: MemberPlan | null; // Store the whole selected plan object
    isLoaded: boolean;
  } | null>(null);
  const [isLoadingMainAppPlanData, setIsLoadingMainAppPlanData] =
    useState(true);

  const { data: session, status: sessionStatus } = useSession();
  const {
    plans: storePlans,
    selectedPlanId: storeSelectedPlanId,
    isLoading: isPlanStoreLoading,
  } = usePlanStore();

  useEffect(() => {
    logger.info(`${LOG_PREFIX} Component instance created/mounted. Props:`, {
      autoInitialize,
    });
  }, [autoInitialize]);

  const fetchLoggedInMemberData = useCallback(async () => {
    // Check if data already exists for the current user and we are not in a loading state
    if (
      session?.user?.id &&
      loggedInMemberDetails?.userId === session.user.id &&
      !isLoadingLoggedInMember
    ) {
      return;
    }

    if (session && sessionStatus === 'authenticated') {
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
      // Not loading and not authenticated
      setLoggedInMemberDetails(null);
      setIsLoadingLoggedInMember(false);
    }
  }, [session, sessionStatus, isLoadingLoggedInMember, loggedInMemberDetails]); // Added missing dependencies

  useEffect(() => {
    fetchLoggedInMemberData();
  }, [fetchLoggedInMemberData]);

  useEffect(() => {
    const fetchPbeData = async () => {
      if (session?.user?.id && sessionStatus === 'authenticated') {
        // Check if PBE data for this session user is already fetched and not loading
        if (
          pbeData &&
          !isLoadingPbeData &&
          (pbeData as any)?.userId === session.user.id
        ) {
          // Assuming PBEData might have a userId link
          return;
        }
        setIsLoadingPbeData(true);
        try {
          logger.info(
            `${LOG_PREFIX} Fetching PBEData for user ID: ${session.user.id}`,
          );
          const data = await getPersonBusinessEntity(session.user.id);
          setPbeData(data);
        } catch (error) {
          logger.error(`${LOG_PREFIX} Error fetching PBEData:`, error);
          setPbeData(null);
        } finally {
          setIsLoadingPbeData(false);
        }
      } else if (sessionStatus !== 'loading') {
        setPbeData(null);
        setIsLoadingPbeData(false);
      }
    };
    fetchPbeData();
  }, [session, sessionStatus, pbeData, isLoadingPbeData]); // Restored pbeData and isLoadingPbeData for correct dependency tracking

  useEffect(() => {
    // Ensures isLoadingUserProfile is reliably set to false once profile sourcing is attempted.
    if (sessionStatus === 'loading' || isLoadingPbeData) {
      setIsLoadingUserProfile(true);
      return;
    }

    if (sessionStatus === 'unauthenticated') {
      setUserProfileData(null);
      setIsLoadingUserProfile(false);
      return;
    }

    // Session is authenticated, and PBE data is no longer loading.
    if (!pbeData) {
      logger.warn(
        `${LOG_PREFIX} PBEData is null/undefined after its loading phase. Cannot compute UserProfile.`,
      );
      setUserProfileData(null);
      setIsLoadingUserProfile(false);
      return;
    }

    // Attempt to compute profile. Set loading true now.
    setIsLoadingUserProfile(true);
    if (session?.user?.currUsr?.umpi) {
      try {
        const profiles = computeUserProfilesFromPbe(
          pbeData,
          session.user.currUsr.umpi,
          session.user.currUsr.plan?.memCk,
        );
        const currentUserProfile = profiles.find(
          (p) => p.id === session.user.currUsr.umpi && p.selected,
        );
        if (currentUserProfile) {
          setUserProfileData(currentUserProfile);
        } else {
          const fallbackProfile = profiles.find(
            (p) => p.id === session.user.currUsr.umpi,
          );
          setUserProfileData(fallbackProfile || null);
          if (!fallbackProfile) {
            logger.warn(
              `${LOG_PREFIX} UserProfile not found for umpi: ${session.user.currUsr.umpi}. Attempted fallback.`,
            );
          }
        }
      } catch (error) {
        logger.error(
          `${LOG_PREFIX} Error computing UserProfile from PBEData:`,
          error,
        );
        setUserProfileData(null);
      } finally {
        setIsLoadingUserProfile(false); // Critical: ensure this is always called after attempt
      }
    } else {
      logger.warn(
        `${LOG_PREFIX} session.user.currUsr.umpi missing. Cannot compute UserProfile.`,
      );
      setUserProfileData(null);
      setIsLoadingUserProfile(false); // UMPI missing, computation attempt over
    }
  }, [session, sessionStatus, pbeData, isLoadingPbeData]);

  useEffect(() => {
    const sourceMainAppPlanData = () => {
      if (isPlanStoreLoading) {
        logger.info(`${LOG_PREFIX} Waiting for planStore to finish loading...`);
        setIsLoadingMainAppPlanData(true); // Explicitly set loading if planStore is loading
        return;
      }
      setIsLoadingMainAppPlanData(true); // Start of processing
      if (storePlans && storeSelectedPlanId) {
        const selectedPlan = storePlans.find(
          (p) => p.id === storeSelectedPlanId,
        );
        if (selectedPlan) {
          setMainAppPlanData({
            numberOfPlans: storePlans.length,
            selectedPlan: selectedPlan, // Store the selected plan
            isLoaded: true,
          });
        } else {
          logger.warn(
            `${LOG_PREFIX} SelectedPlanId (${storeSelectedPlanId}) not found in storePlans. Using fallback.`,
          );
          setMainAppPlanData({
            numberOfPlans: storePlans.length,
            selectedPlan: null, // No plan found
            isLoaded: false, // Indicate not fully loaded or error state
          });
        }
      } else if (storePlans && storePlans.length > 0 && !storeSelectedPlanId) {
        logger.warn(
          `${LOG_PREFIX} planStore has ${storePlans.length} plans, but no selectedPlanId. Using first plan as default.`,
        );
        const defaultPlan = storePlans[0];
        setMainAppPlanData({
          numberOfPlans: storePlans.length,
          selectedPlan: defaultPlan || null, // Store the default plan
          isLoaded: true,
        });
      } else {
        logger.warn(
          `${LOG_PREFIX} planStore data not fully available (plans empty: ${!storePlans || storePlans.length === 0}, no selectedId: ${!storeSelectedPlanId}).`,
        );
        setMainAppPlanData({
          numberOfPlans: 0,
          selectedPlan: null, // No plan available
          isLoaded: false,
        });
      }
      setIsLoadingMainAppPlanData(false);
    };

    // Run when authenticated or if plan store data changes (relevant for plan switches)
    if (
      sessionStatus === 'authenticated' ||
      (sessionStatus === 'unauthenticated' && !isPlanStoreLoading)
    ) {
      sourceMainAppPlanData();
    } else if (sessionStatus === 'loading') {
      setIsLoadingMainAppPlanData(true);
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

  // Effect to reset initialization flags if the selected plan ID changes
  useEffect(() => {
    const currentPlanId = storeSelectedPlanId;
    const previousPlanId = previousSelectedPlanIdRef.current;

    // Only consider it a switch if previousPlanId was set (not initial load)
    // and currentPlanId is set and different from previous.
    if (
      previousPlanId !== null &&
      previousPlanId !== undefined &&
      currentPlanId !== null &&
      currentPlanId !== undefined &&
      currentPlanId !== previousPlanId
    ) {
      logger.info(
        `${LOG_PREFIX} Plan switch detected (from ${previousPlanId} to ${currentPlanId}). Resetting chat initialization flags.`,
      );
      initializedRef.current = false;
      initAttemptsRef.current = 0;
    }
    // Always update the ref to the latest known plan ID from the store
    previousSelectedPlanIdRef.current = currentPlanId;
  }, [storeSelectedPlanId]);

  const initializeChatConfig = useCallback(() => {
    logger.info(
      `${LOG_PREFIX} Attempting initializeChatConfig. autoInitialize: ${autoInitialize}, initializedRef: ${initializedRef.current}, isLoadingStore: ${isLoadingConfigStore}, Attempts: ${initAttemptsRef.current}`,
    );

    if (!autoInitialize || initializedRef.current || isLoadingConfigStore) {
      return;
    }

    const allLoadingStates = {
      sessionStatus,
      isUserContextLoading,
      isPlanContextLoading,
      isLoadingLoggedInMember,
      isLoadingUserProfile,
      isLoadingPbeData,
      isLoadingMainAppPlanData, // Derived from isPlanStoreLoading
    };
    const someDataStillLoading =
      Object.values(allLoadingStates).some((val) => val === true) ||
      sessionStatus === 'loading';

    if (someDataStillLoading) {
      logger.info(
        `${LOG_PREFIX} Waiting for data contexts to load...`,
        allLoadingStates,
      );
      return;
    }

    if (initAttemptsRef.current >= maxInitAttempts) {
      logger.warn(`${LOG_PREFIX} Max init attempts reached. Halting.`);
      if (!configErrorStore && !planContextError)
        setErrorStore(new Error('ChatProvider: Max init attempts.'));
      initializedRef.current = true; // Prevent further attempts this cycle
      return;
    }
    initAttemptsRef.current += 1;
    logger.info(
      `${LOG_PREFIX} Past loading checks. Init Attempt: ${initAttemptsRef.current}`,
    );

    if (planContextError) {
      logger.error(
        `${LOG_PREFIX} Plan context hook error. Halting.`,
        planContextError,
      );
      if (!configErrorStore) setErrorStore(planContextError);
      initializedRef.current = true;
      return;
    }

    if (sessionStatus === 'unauthenticated') {
      logger.warn(
        `${LOG_PREFIX} User is unauthenticated. Chat initialization aborted during data checks.`,
      );
      if (!configErrorStore)
        setErrorStore(
          new Error('User unauthenticated, cannot initialize chat.'),
        );
      initializedRef.current = true;
      return;
    }

    // Final data object validation
    if (
      !session?.user ||
      !userContext ||
      !planContext ||
      !loggedInMemberDetails ||
      !userProfileData?.id ||
      !pbeData ||
      !mainAppPlanData?.isLoaded ||
      !mainAppPlanData.selectedPlan
    ) {
      logger.warn(
        `${LOG_PREFIX} Data objects not yet fully populated. Attempt: ${initAttemptsRef.current}.`,
        {
          sessionUser: !!session?.user,
          userContext: !!userContext,
          planContext: !!planContext,
          loggedInMemberDetails: !!loggedInMemberDetails,
          userProfileData: !!userProfileData?.id,
          pbeData: !!pbeData,
          mainAppPlanDataLoaded: mainAppPlanData?.isLoaded,
          mainAppSelectedPlan: !!mainAppPlanData?.selectedPlan,
        },
      );
      return;
    }

    logger.info(
      `${LOG_PREFIX} All data sources appear ready. Calling loadChatConfiguration.`,
    );

    const apiCallMemberId = userContext.userID;
    // Ensure mainAppPlanData.selectedPlan is not null before accessing its id
    const apiCallPlanId =
      planContext.planId ||
      (mainAppPlanData.selectedPlan ? mainAppPlanData.selectedPlan.id : '');

    // Ensure mainAppPlanData.selectedPlan is not null before accessing its properties
    const currentPlanDetailsForBuild: CurrentPlanDetails =
      mainAppPlanData.selectedPlan
        ? {
            numberOfPlans: mainAppPlanData.numberOfPlans,
            currentPlanName:
              mainAppPlanData.selectedPlan.name || 'Unknown Plan Name',
            currentPlanLOB: mainAppPlanData.selectedPlan.lob,
          }
        : {
            // Fallback if selectedPlan is null - though prior checks should prevent this
            numberOfPlans: mainAppPlanData.numberOfPlans,
            currentPlanName: 'Plan Not Available',
            currentPlanLOB: undefined,
          };

    initializedRef.current = true; // Set before async call to prevent re-entry for THIS data set

    loadChatConfiguration(
      apiCallMemberId,
      apiCallPlanId,
      loggedInMemberDetails,
      session.user as SessionUser,
      userProfileData,
      currentPlanDetailsForBuild,
    ).catch((e) => {
      logger.error(
        `${LOG_PREFIX} loadChatConfiguration call failed externally (promise rejected).`,
        e,
      );
      if (!useChatStore.getState().config.error) {
        // Check fresh store state
        setErrorStore(
          e instanceof Error
            ? e
            : new Error('Chat configuration loading failed unexpectedly'),
        );
      }
      initializedRef.current = false; // Allow retry if loadChatConfiguration itself fails
      initAttemptsRef.current = Math.max(0, initAttemptsRef.current - 1); // Decrement attempt so next retry is valid
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
    pbeData,
    isLoadingPbeData,
    mainAppPlanData, // MainAppPlanData object from usePlanStore derivation
    isLoadingMainAppPlanData, // Added to satisfy linter
    loadChatConfiguration,
    setErrorStore,
    configErrorStore,
  ]);

  // This useEffect is the main trigger for initializeChatConfig.
  // It runs when any of its numerous dependencies change, allowing retries as data loads.
  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} Main initialization useEffect triggered. sessionStatus: ${sessionStatus}, initializedRef: ${initializedRef.current}`,
    );
    if (sessionStatus === 'authenticated' && !initializedRef.current) {
      initializeChatConfig();
    } else if (sessionStatus === 'unauthenticated' && !initializedRef.current) {
      logger.warn(
        `${LOG_PREFIX} Session unauthenticated in main useEffect. Chat initialization not performed.`,
      );
      if (!configErrorStore) setErrorStore(new Error('User unauthenticated.'));
      initializedRef.current = true;
    }
  }, [initializeChatConfig, sessionStatus, configErrorStore, setErrorStore]); // Key dependencies

  return <>{children}</>;
}
