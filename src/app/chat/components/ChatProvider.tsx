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
    const instanceId = Math.random().toString(36).substring(7);
    logger.info(
      `${LOG_PREFIX} ========== ChatProvider MOUNTED ========== Instance: ${instanceId}`,
    );
    return () => {
      logger.warn(
        `${LOG_PREFIX} ========== ChatProvider UNMOUNTING ========== Instance: ${instanceId}`,
      );
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

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
    logger.info(
      `${LOG_PREFIX} PBE useEffect triggered. Deps - userId: ${session?.user?.id}, sessionStatus: ${sessionStatus}. Current isLoadingPbeData: ${isLoadingPbeData}`,
    );
    const fetchPbeData = async () => {
      if (session?.user?.id && sessionStatus === 'authenticated') {
        logger.info(
          `${LOG_PREFIX} Authenticated. Preparing to fetch PBEData for user ID: ${session.user.id}. Current isLoadingPbeData: ${isLoadingPbeData}`,
        );
        setIsLoadingPbeData(true);
        try {
          const pbeFetchTimeout = 15000; // 15 seconds
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(
              () =>
                reject(
                  new Error(
                    `PBE fetch for userId ${session?.user?.id} timed out after ${pbeFetchTimeout}ms`,
                  ),
                ),
              pbeFetchTimeout,
            ),
          );

          logger.info(
            `${LOG_PREFIX} About to call getPersonBusinessEntity for userId: ${session.user.id}`,
          );
          const data = (await Promise.race([
            getPersonBusinessEntity(session.user.id),
            timeoutPromise,
          ])) as PBEData | undefined;

          logger.info(
            `${LOG_PREFIX} PBE fetch attempt successful/resolved. Data:`,
            data,
          );
          setPbeData(data || null);
          logger.info(
            `${LOG_PREFIX} About to set isLoadingPbeData to false (success path). Current value: ${isLoadingPbeData}`,
          );
          setIsLoadingPbeData(false);
        } catch (error) {
          logger.error(
            `${LOG_PREFIX} PBE fetch attempt failed/rejected. Error:`,
            error,
          );
          setPbeData(null);
          logger.info(
            `${LOG_PREFIX} About to set isLoadingPbeData to false (error path). Current value: ${isLoadingPbeData}`,
          );
          setIsLoadingPbeData(false);
        }
      } else if (sessionStatus !== 'loading') {
        logger.info(
          `${LOG_PREFIX} Not authenticated or session not ready. Resetting PBEData.`,
        );
        setPbeData(null);
        // Ensure isLoadingPbeData is false if we are not attempting a fetch and not session loading
        if (isLoadingPbeData) {
          logger.info(
            `${LOG_PREFIX} Setting isLoadingPbeData to false (not authenticated/not session loading path). Current value: ${isLoadingPbeData}`,
          );
          setIsLoadingPbeData(false);
        }
      } else {
        logger.info(
          `${LOG_PREFIX} Session is loading. isLoadingPbeData should be true. Current value: ${isLoadingPbeData}`,
        );
        if (!isLoadingPbeData) setIsLoadingPbeData(true);
      }
    };
    fetchPbeData();
  }, [session?.user?.id, sessionStatus]);

  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} UserProfile useEffect triggered. Deps - sessionStatus: ${sessionStatus}, isLoadingPbeData: ${isLoadingPbeData}, pbeData available: ${!!pbeData}, session.user.currUsr.umpi: ${session?.user?.currUsr?.umpi}`,
    );
    // Ensures isLoadingUserProfile is reliably set to false once profile sourcing is attempted.
    if (sessionStatus === 'loading' || isLoadingPbeData) {
      // Condition A
      logger.info(
        `${LOG_PREFIX} UserProfile useEffect: Condition A met (session loading or PBE loading). Setting isLoadingUserProfile: true.`,
      );
      setIsLoadingUserProfile(true);
      return;
    }

    if (sessionStatus === 'unauthenticated') {
      // Condition B
      logger.info(
        `${LOG_PREFIX} UserProfile useEffect: Condition B met (unauthenticated). Setting isLoadingUserProfile: false.`,
      );
      setUserProfileData(null);
      setIsLoadingUserProfile(false);
      return;
    }

    // Session is authenticated, and PBE data is no longer loading.
    if (!pbeData) {
      // Condition C
      logger.warn(
        `${LOG_PREFIX} UserProfile useEffect: Condition C met (PBEData is null/undefined). Setting isLoadingUserProfile: false.`,
      );
      setUserProfileData(null);
      setIsLoadingUserProfile(false); // Good: sets to false
      return;
    }

    // Attempt to compute profile. Set loading true now.
    logger.info(
      `${LOG_PREFIX} UserProfile useEffect: Attempting to compute profile. Setting isLoadingUserProfile: true (Condition D).`,
    );
    setIsLoadingUserProfile(true); // Condition D: Sets to true before computation
    if (session?.user?.currUsr?.umpi) {
      // Condition E
      logger.info(
        `${LOG_PREFIX} UserProfile useEffect: UMPI found (${session.user.currUsr.umpi}). Entering try/catch/finally for computeUserProfilesFromPbe.`,
      );
      try {
        const profiles = computeUserProfilesFromPbe(
          pbeData,
          session.user.currUsr.umpi,
          session.user.currUsr.plan?.memCk,
        );
        logger.info(
          `${LOG_PREFIX} UserProfile useEffect: computeUserProfilesFromPbe returned profiles:`,
          profiles,
        );
        const currentUserProfile = profiles.find(
          (p) => p.id === session.user.currUsr.umpi && p.selected,
        );
        if (currentUserProfile) {
          setUserProfileData(currentUserProfile);
          logger.info(
            `${LOG_PREFIX} UserProfile useEffect: currentUserProfile found and set.`,
            currentUserProfile,
          );
        } else {
          const fallbackProfile = profiles.find(
            (p) => p.id === session.user.currUsr.umpi,
          );
          setUserProfileData(fallbackProfile || null);
          if (!fallbackProfile) {
            logger.warn(
              `${LOG_PREFIX} UserProfile useEffect: UserProfile not found for umpi: ${session.user.currUsr.umpi}. Attempted fallback, result:`,
              fallbackProfile,
            );
          } else {
            logger.info(
              `${LOG_PREFIX} UserProfile useEffect: Fallback profile found and set.`,
              fallbackProfile,
            );
          }
        }
      } catch (error) {
        logger.error(
          `${LOG_PREFIX} UserProfile useEffect: Error computing UserProfile from PBEData:`,
          error,
        );
        setUserProfileData(null);
      } finally {
        logger.info(
          `${LOG_PREFIX} UserProfile useEffect: In finally block. Setting isLoadingUserProfile: false.`,
        );
        setIsLoadingUserProfile(false); // CRITICAL: Good, this is in a finally block
      }
    } else {
      // Condition F: Else for (session?.user?.currUsr?.umpi)
      logger.warn(
        `${LOG_PREFIX} UserProfile useEffect: Condition F met (session.user.currUsr.umpi missing). Setting isLoadingUserProfile: false.`,
      );
      setUserProfileData(null);
      setIsLoadingUserProfile(false); // GOOD: Sets to false if UMPI is missing
    }
  }, [session, sessionStatus, pbeData, isLoadingPbeData]);

  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} mainAppPlanData useEffect triggered. Deps - sessionStatus: ${sessionStatus}, storePlans count: ${storePlans?.length}, storeSelectedPlanId: ${storeSelectedPlanId}, isPlanStoreLoading: ${isPlanStoreLoading}`,
    );
    const sourceMainAppPlanData = () => {
      if (isPlanStoreLoading) {
        logger.info(
          `${LOG_PREFIX} mainAppPlanData: Waiting for planStore to finish loading... Setting isLoadingMainAppPlanData: true.`,
        );
        setIsLoadingMainAppPlanData(true); // Explicitly set loading if planStore is loading
        return;
      }
      logger.info(
        `${LOG_PREFIX} mainAppPlanData: PlanStore not loading. Starting processing. Setting isLoadingMainAppPlanData: true.`,
      );
      setIsLoadingMainAppPlanData(true); // Start of processing

      if (storePlans && storeSelectedPlanId) {
        const selectedPlan = storePlans.find(
          (p) => p.id === storeSelectedPlanId,
        );
        if (selectedPlan) {
          const newMainAppPlanData = {
            numberOfPlans: storePlans.length,
            selectedPlan: selectedPlan, // Store the selected plan
            isLoaded: true,
          };
          logger.info(
            `${LOG_PREFIX} mainAppPlanData: storePlans and storeSelectedPlanId found. Selected plan: ${selectedPlan.id}. Setting mainAppPlanData:`,
            newMainAppPlanData,
          );
          setMainAppPlanData(newMainAppPlanData);
        } else {
          const newMainAppPlanData = {
            numberOfPlans: storePlans.length,
            selectedPlan: null, // No plan found
            isLoaded: false, // Indicate not fully loaded or error state
          };
          logger.warn(
            `${LOG_PREFIX} mainAppPlanData: SelectedPlanId (${storeSelectedPlanId}) not found in storePlans. Using fallback. Setting mainAppPlanData:`,
            newMainAppPlanData,
          );
          setMainAppPlanData(newMainAppPlanData);
        }
      } else if (storePlans && storePlans.length > 0 && !storeSelectedPlanId) {
        const defaultPlan = storePlans[0];
        const newMainAppPlanData = {
          numberOfPlans: storePlans.length,
          selectedPlan: defaultPlan || null, // Store the default plan
          isLoaded: true,
        };
        logger.warn(
          `${LOG_PREFIX} mainAppPlanData: planStore has ${storePlans.length} plans, but no selectedPlanId. Using first plan as default (${defaultPlan?.id}). Setting mainAppPlanData:`,
          newMainAppPlanData,
        );
        setMainAppPlanData(newMainAppPlanData);
      } else {
        const newMainAppPlanData = {
          numberOfPlans: 0,
          selectedPlan: null, // No plan available
          isLoaded: false,
        };
        logger.warn(
          `${LOG_PREFIX} mainAppPlanData: planStore data not fully available (plans empty: ${!storePlans || storePlans.length === 0}, no selectedId: ${!storeSelectedPlanId}). Setting mainAppPlanData:`,
          newMainAppPlanData,
        );
        setMainAppPlanData(newMainAppPlanData);
      }
      logger.info(
        `${LOG_PREFIX} mainAppPlanData: Processing finished. Setting isLoadingMainAppPlanData: false.`,
      );
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
    const apiCallPlanId =
      planContext.planId ||
      (mainAppPlanData.selectedPlan ? mainAppPlanData.selectedPlan.id : '');

    const currentPlanDetailsForBuild: CurrentPlanDetails =
      mainAppPlanData.selectedPlan
        ? {
            numberOfPlans: mainAppPlanData.numberOfPlans,
            currentPlanName:
              mainAppPlanData.selectedPlan.name || 'Unknown Plan Name',
            currentPlanLOB: mainAppPlanData.selectedPlan.lob,
          }
        : {
            numberOfPlans: mainAppPlanData.numberOfPlans,
            currentPlanName: 'Plan Not Available', // This case might be problematic
            currentPlanLOB: undefined,
          };

    // Log the exact details being passed to loadChatConfiguration
    logger.info(`${LOG_PREFIX} Preparing to call loadChatConfiguration with:`, {
      apiCallMemberId,
      apiCallPlanId,
      loggedInMemberDetailsUserId: loggedInMemberDetails?.userId,
      sessionUserId: session.user?.id,
      userProfileDataId: userProfileData?.id,
      currentPlanDetailsForBuild,
    });

    initializedRef.current = true;

    loadChatConfiguration(
      apiCallMemberId,
      apiCallPlanId,
      loggedInMemberDetails,
      session.user as SessionUser,
      userProfileData,
      currentPlanDetailsForBuild,
    ).catch((e) => {
      const errorContext = {
        detailsPassedToLoadChatConfiguration: {
          apiCallMemberId,
          apiCallPlanId,
          loggedInMemberDetailsUserId: loggedInMemberDetails?.userId,
          sessionUserId: session.user?.id,
          userProfileDataId: userProfileData?.id,
          currentPlanDetailsForBuild,
        },
        originalError: e,
      };
      logger.error(
        `${LOG_PREFIX} loadChatConfiguration call failed externally (promise rejected). Context:`,
        errorContext,
      );
      if (!useChatStore.getState().config.error) {
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
