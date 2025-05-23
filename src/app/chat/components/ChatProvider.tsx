'use client';

import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';

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

import { usePlanContext } from '../hooks/usePlanContext';
import { useUserContext } from '../hooks/useUserContext';
import {
  chatConfigSelectors,
  CurrentPlanDetails,
  useChatStore,
} from '../stores/chatStore';

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
  const initializedRef = useRef(false);
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
    selectedPlan: MemberPlan | null;
    isLoaded: boolean;
  } | null>(null);
  const [isLoadingMainAppPlanData, setIsLoadingMainAppPlanData] =
    useState(true);

  const { data: session, status: sessionStatus } = useSession();
  const {
    plans: storePlans,
    selectedPlanId: storeSelectedPlanId,
    isLoading: isPlanStoreLoading,
    setPlans: setStorePlans,
    setSelectedPlanId: setStoreSelectedPlanId,
  } = usePlanStore();

  // Effect for mount and unmount logging (warn level for unmount)
  useEffect(() => {
    const instanceId = Math.random().toString(36).substring(7);
    // logger.info (`${LOG_PREFIX} ========== ChatProvider MOUNTED ========== Instance: ${instanceId}`); // Removed info log
    return () => {
      logger.warn(
        `[ChatProvider] ========== ChatProvider UNMOUNTING ========== Instance: ${instanceId}`,
      );
    };
  }, []);

  const fetchLoggedInMemberData = useCallback(async () => {
    if (
      session?.user?.id &&
      loggedInMemberDetails?.userId === session.user.id &&
      !isLoadingLoggedInMember
    ) {
      return;
    }

    if (session && sessionStatus === 'authenticated') {
      setIsLoadingLoggedInMember(true);
      try {
        const details = await getLoggedInMember(session);
        setLoggedInMemberDetails(details);
      } catch (error) {
        logger.error(
          `[ChatProvider] Error fetching LoggedInMember details:`,
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
  }, [session, sessionStatus, isLoadingLoggedInMember, loggedInMemberDetails]);

  useEffect(() => {
    fetchLoggedInMemberData();
  }, [fetchLoggedInMemberData]);

  // Effect to fetch PBE Data
  useEffect(() => {
    const fetchPbeDataAsync = async () => {
      if (session?.user?.id && sessionStatus === 'authenticated') {
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

          const data = (await Promise.race([
            getPersonBusinessEntity(session.user.id),
            timeoutPromise,
          ])) as PBEData | undefined;
          setPbeData(data || null);
        } catch (error) {
          logger.error(
            `[ChatProvider] PBE fetch attempt failed/rejected. Error:`,
            error,
          );
          setPbeData(null);
        } finally {
          setIsLoadingPbeData(false);
        }
      } else if (sessionStatus !== 'loading') {
        setPbeData(null);
        if (isLoadingPbeData) {
          setIsLoadingPbeData(false);
        }
      } else {
        // Session is loading
        if (!isLoadingPbeData) setIsLoadingPbeData(true);
      }
    };
    fetchPbeDataAsync();
  }, [session?.user?.id, sessionStatus, isLoadingPbeData]); // isLoadingPbeData kept to handle reset scenarios correctly

  // Effect to compute UserProfile
  useEffect(() => {
    if (sessionStatus === 'loading' || isLoadingPbeData) {
      if (!isLoadingUserProfile) setIsLoadingUserProfile(true);
      return;
    }

    if (sessionStatus === 'unauthenticated') {
      setUserProfileData(null);
      if (isLoadingUserProfile) setIsLoadingUserProfile(false);
      return;
    }

    if (!pbeData) {
      setUserProfileData(null);
      if (isLoadingUserProfile) setIsLoadingUserProfile(false);
      return;
    }

    if (!isLoadingUserProfile) setIsLoadingUserProfile(true); // Set loading true before computation

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
              `[ChatProvider] UserProfile useEffect: UserProfile not found for umpi: ${session.user.currUsr.umpi}. Attempted fallback, result was null.`,
            );
          }
        }
      } catch (error) {
        logger.error(
          `[ChatProvider] UserProfile useEffect: Error computing UserProfile from PBEData:`,
          error,
        );
        setUserProfileData(null);
      } finally {
        setIsLoadingUserProfile(false);
      }
    } else {
      logger.warn(
        `[ChatProvider] UserProfile useEffect: session.user.currUsr.umpi missing. Cannot compute profile.`,
      );
      setUserProfileData(null);
      setIsLoadingUserProfile(false);
    }
  }, [session, sessionStatus, pbeData, isLoadingPbeData, isLoadingUserProfile]); // isLoadingUserProfile added as a dep

  // useEffect to synchronize UserProfile plan data with PlanStore
  useEffect(() => {
    if (
      userProfileData &&
      userProfileData.plans &&
      userProfileData.plans.length > 0
    ) {
      const plansFromProfile: MemberPlan[] = userProfileData.plans.map(
        (p: any) => {
          const id =
            p.memCK ||
            p.patientFhirId ||
            `fallback-plan-id-${Math.random().toString(36).substring(7)}`;
          return {
            id: id,
            name: p.name || `Plan ${id}`,
            subscriber: userProfileData.id || 'Unknown Subscriber',
            policies: p.policies || [],
            lob: p.lob,
          };
        },
      );

      const selectedPlanFromProfile = userProfileData.plans.find(
        (p: any) => p.selected === true,
      );
      const selectedPlanInMappedArray = selectedPlanFromProfile
        ? plansFromProfile.find(
            (mp) =>
              mp.id ===
              (selectedPlanFromProfile.memCK ||
                selectedPlanFromProfile.patientFhirId),
          )
        : plansFromProfile[0];
      const selectedPlanIdToSet = selectedPlanInMappedArray?.id || '';

      // Get current values from store to compare
      const currentStorePlans = usePlanStore.getState().plans;
      const currentStoreSelectedPlanId = usePlanStore.getState().selectedPlanId;

      if (
        JSON.stringify(plansFromProfile) !== JSON.stringify(currentStorePlans)
      ) {
        setStorePlans(plansFromProfile);
      }

      if (selectedPlanIdToSet !== currentStoreSelectedPlanId) {
        setStoreSelectedPlanId(selectedPlanIdToSet);
      }
    } else if (
      userProfileData &&
      (!userProfileData.plans || userProfileData.plans.length === 0)
    ) {
      logger.warn(
        `[ChatProvider] SyncUserProfileToPlanStore: UserProfileData exists but has no plans. Resetting PlanStore.`,
      );
      // Get current values from store to compare before resetting
      const currentStorePlans = usePlanStore.getState().plans;
      const currentStoreSelectedPlanId = usePlanStore.getState().selectedPlanId;

      if (currentStorePlans.length > 0) {
        setStorePlans([]);
      }
      if (currentStoreSelectedPlanId !== '') {
        setStoreSelectedPlanId('');
      }
    }
  }, [userProfileData, setStorePlans, setStoreSelectedPlanId]);

  // Effect to derive mainAppPlanData from PlanStore
  useEffect(() => {
    if (sessionStatus === 'loading') {
      if (!isLoadingMainAppPlanData) setIsLoadingMainAppPlanData(true);
      if (mainAppPlanData?.isLoaded)
        setMainAppPlanData({
          numberOfPlans: 0,
          selectedPlan: null,
          isLoaded: false,
        });
      return;
    }
    if (sessionStatus === 'unauthenticated') {
      setMainAppPlanData({
        numberOfPlans: 0,
        selectedPlan: null,
        isLoaded: false,
      });
      if (isLoadingMainAppPlanData) setIsLoadingMainAppPlanData(false);
      return;
    }
    if (isPlanStoreLoading) {
      if (!isLoadingMainAppPlanData) setIsLoadingMainAppPlanData(true);
      if (mainAppPlanData?.isLoaded)
        setMainAppPlanData({
          numberOfPlans: 0,
          selectedPlan: null,
          isLoaded: false,
        });
      return;
    }

    const plansArePopulated = storePlans && storePlans.length > 0;
    const selectedPlanIdIsValid =
      storeSelectedPlanId && storeSelectedPlanId.trim() !== '';

    if (plansArePopulated && selectedPlanIdIsValid) {
      const selectedPlan = storePlans.find((p) => p.id === storeSelectedPlanId);
      if (selectedPlan) {
        setMainAppPlanData({
          numberOfPlans: storePlans.length,
          selectedPlan,
          isLoaded: true,
        });
      } else {
        logger.warn(
          `[ChatProvider] mainAppPlanData: storeSelectedPlanId ('${storeSelectedPlanId}') not found in storePlans. Defaulting.`,
        );
        const defaultPlan = storePlans[0];
        setMainAppPlanData({
          numberOfPlans: storePlans.length,
          selectedPlan: defaultPlan || null,
          isLoaded: !!defaultPlan,
        });
      }
    } else if (plansArePopulated && !selectedPlanIdIsValid) {
      const defaultPlan = storePlans[0];
      setMainAppPlanData({
        numberOfPlans: storePlans.length,
        selectedPlan: defaultPlan,
        isLoaded: true,
      });
    } else {
      setMainAppPlanData({
        numberOfPlans: 0,
        selectedPlan: null,
        isLoaded: false,
      });
    }
    setIsLoadingMainAppPlanData(false); // Always set loading to false after processing
  }, [
    sessionStatus,
    storePlans,
    storeSelectedPlanId,
    isPlanStoreLoading,
    mainAppPlanData?.isLoaded,
    isLoadingMainAppPlanData,
  ]);

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

  const allDataLoaded =
    sessionStatus === 'authenticated' &&
    !isUserContextLoading &&
    !isPlanContextLoading &&
    !isLoadingLoggedInMember &&
    !isLoadingUserProfile &&
    !isLoadingPbeData &&
    !isLoadingMainAppPlanData &&
    !!userContext &&
    !!planContext &&
    !!loggedInMemberDetails &&
    !!userProfileData?.id && // Check for id as a proxy for valid UserProfile object
    !!pbeData &&
    !!mainAppPlanData?.isLoaded &&
    !!mainAppPlanData.selectedPlan;

  useEffect(() => {
    const currentPlanId = storeSelectedPlanId;
    const previousPlanId = previousSelectedPlanIdRef.current;
    if (
      previousPlanId !== null &&
      previousPlanId !== undefined &&
      currentPlanId !== null &&
      currentPlanId !== undefined &&
      currentPlanId !== previousPlanId
    ) {
      logger.warn(
        // Changed to warn for visibility
        `[ChatProvider] Plan switch detected (from ${previousPlanId} to ${currentPlanId}). Resetting chat initialization flags.`,
      );
      initializedRef.current = false;
      initAttemptsRef.current = 0;
    }
    previousSelectedPlanIdRef.current = currentPlanId;
  }, [storeSelectedPlanId]);

  const initializeChatConfig = useCallback(() => {
    if (
      !session?.user ||
      !userContext ||
      !planContext ||
      !loggedInMemberDetails ||
      !userProfileData?.id ||
      !pbeData ||
      !mainAppPlanData?.selectedPlan
    ) {
      logger.error(
        `[ChatProvider] initializeChatConfig called but essential data is missing. Bailing.`,
        {
          /* details */
        }, // Details can be added if needed for specific debugging
      );
      return;
    }

    if (initAttemptsRef.current >= maxInitAttempts) {
      logger.warn(
        `[ChatProvider] Max init attempts reached (${maxInitAttempts}). Halting.`,
      );
      if (!configErrorStore && !planContextError)
        setErrorStore(new Error('ChatProvider: Max init attempts.'));
      initializedRef.current = true;
      return;
    }
    initAttemptsRef.current += 1;

    if (planContextError) {
      logger.error(
        `[ChatProvider] Plan context hook error. Halting.`,
        planContextError,
      );
      if (!configErrorStore) setErrorStore(planContextError);
      initializedRef.current = true;
      return;
    }

    initializedRef.current = true; // Mark as attempting/initialized for this cycle

    const apiCallMemberId = mainAppPlanData.selectedPlan!.id;
    const currentPlanDetailsForBuild: CurrentPlanDetails = {
      numberOfPlans: mainAppPlanData.numberOfPlans,
      currentPlanName:
        mainAppPlanData.selectedPlan!.name || 'Unknown Plan Name',
      currentPlanLOB: mainAppPlanData.selectedPlan!.lob || 'Unknown LOB',
    };

    loadChatConfiguration(
      apiCallMemberId,
      loggedInMemberDetails,
      session.user as SessionUser,
      userProfileData,
      currentPlanDetailsForBuild,
    ).catch((e) => {
      logger.error(
        `[ChatProvider] loadChatConfiguration call failed externally (promise rejected).`,
        e,
      );
      if (!useChatStore.getState().config.error) {
        // Check current error state directly
        setErrorStore(
          e instanceof Error
            ? e
            : new Error('Chat configuration loading failed unexpectedly'),
        );
      }
      initializedRef.current = false;
      initAttemptsRef.current = Math.max(0, initAttemptsRef.current - 1);
    });
  }, [
    autoInitialize, // This being a dependency is odd if initializeChatConfig is called imperatively elsewhere or only by main effect
    isLoadingConfigStore, // Also odd if this function is meant to be a pure "do it now" action
    maxInitAttempts,
    session,
    userContext,
    planContext,
    loggedInMemberDetails,
    userProfileData,
    pbeData,
    mainAppPlanData,
    loadChatConfiguration,
    setErrorStore,
    configErrorStore,
    planContextError,
    // Removed sessionStatus, and loading flags for individual data pieces as allDataLoaded handles their aggregate
    // and this function should ideally be called when data *is* ready.
  ]);

  // Main initialization useEffect
  useEffect(() => {
    if (
      allDataLoaded &&
      !initializedRef.current &&
      autoInitialize &&
      !isLoadingConfigStore
    ) {
      initializeChatConfig();
    } else if (sessionStatus === 'unauthenticated' && !initializedRef.current) {
      // logger.warn (`${LOG_PREFIX} Session unauthenticated in main useEffect...`); // Redundant if setErrorStore is called
      if (!configErrorStore) setErrorStore(new Error('User unauthenticated.'));
      initializedRef.current = true;
    } else if (
      initAttemptsRef.current >= maxInitAttempts &&
      !initializedRef.current &&
      !configErrorStore
    ) {
      logger.warn(
        `[ChatProvider] Main useEffect: Max init attempts reached (${initAttemptsRef.current}) before allDataLoaded. Halting.`,
      );
      setErrorStore(
        new Error('ChatProvider: Max init attempts (main useEffect).'),
      );
      initializedRef.current = true;
    }
    // Removed the verbose logging for !allDataLoaded states to reduce noise; crucial paths are covered.
  }, [
    allDataLoaded,
    sessionStatus,
    autoInitialize,
    isLoadingConfigStore,
    initializeChatConfig,
    configErrorStore,
    setErrorStore,
    maxInitAttempts, // Added maxInitAttempts
    // The extensive list of individual data pieces and their loading flags is implicitly covered by `allDataLoaded`.
    // If `allDataLoaded` is constructed correctly and stable, this dependency list is sufficient.
  ]);

  return <>{children}</>;
}
