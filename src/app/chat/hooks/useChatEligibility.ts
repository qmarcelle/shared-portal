// Comment out external imports and use mock implementations
// import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
// import { auth } from '@/auth';
import { useCallback, useEffect, useState } from 'react';
import { ChatInfoResponse } from '../schemas/user';
import { chatAPI } from '../services/api';
import { formatBusinessHours } from '../services/utils/chatHours';
import { useChatStore } from '../stores/chatStore';
import { BusinessHours, ChatSession, UserEligibility } from '../types/types';
import { mapUserInfoToChatPayload } from '../utils/chatUtils';
import { auth, getLoggedInUserInfo } from './mocks';

/**
 * Hook for checking chat eligibility
 * This hook checks if the current user is eligible for chat services
 * and fetches the necessary data for chat initialization
 */
export function useChatEligibility() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eligibility, setEligibility] = useState<UserEligibility | null>(null);
  const [chatPayload, setChatPayload] = useState<any>(null);
  const [isEligible, setIsEligible] = useState(false);
  const [isBusinessHoursOpen, setIsBusinessHoursOpen] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHours | null>(
    null,
  );
  const [isLocked, setIsLocked] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null,
  );
  const [chatInfo, setChatInfo] = useState<ChatInfoResponse | null>(null);
  const [isCloudChatEligible, setIsCloudChatEligible] = useState(false);

  // Get current plan from chat store
  const {
    currentPlan,
    lockPlanSwitcher: storeLockPlanSwitcher,
    unlockPlanSwitcher: storeUnlockPlanSwitcher,
  } = useChatStore((state) => ({
    currentPlan: state.currentPlan,
    lockPlanSwitcher: state.lockPlanSwitcher,
    unlockPlanSwitcher: state.unlockPlanSwitcher,
  }));

  /**
   * Lock the plan switcher when a chat session starts
   */
  const lockPlanSwitcher = useCallback(() => {
    setIsLocked(true);
    storeLockPlanSwitcher();
  }, [storeLockPlanSwitcher]);

  /**
   * Unlock the plan switcher when a chat session ends
   */
  const unlockPlanSwitcher = useCallback(() => {
    setIsLocked(false);
    storeUnlockPlanSwitcher();
  }, [storeUnlockPlanSwitcher]);

  /**
   * Start a new chat session
   */
  const startChatSession = useCallback(async () => {
    if (!eligibility || !currentPlan || !chatPayload) {
      setError('Unable to start chat: missing required information');
      return null;
    }

    if (!isBusinessHoursOpen) {
      setError('Chat is currently outside business hours');
      return null;
    }

    try {
      const userInfo = {
        firstName: eligibility.memberFirstname,
        lastName: eligibility.memberLastName,
        email: chatPayload.email,
      };

      // Prepare chat data payload based on BCBST requirements
      const chatData = {
        SERV_Type: 'MemberPortal',
        firstname: eligibility.memberFirstname,
        lastname: eligibility.memberLastName,
        PLAN_ID: currentPlan.id,
        GROUP_ID: eligibility.groupId,
        IDCardBotName: chatInfo?.chatIDChatBotName || '',
        IsVisionEligible: eligibility.isVision,
        MEMBER_ID: eligibility.userID,
        coverage_eligibility: true,
        INQ_TYPE: 'MEM',
        IsDentalEligible: eligibility.isDental,
        MEMBER_DOB: eligibility.memberDOB,
        LOB: chatPayload.lob || '',
        lob_group: chatPayload.lobGroup || '',
        IsMedicalEligibile: eligibility.isMedical,
        Origin: 'MemberPortal' as const,
        Source: 'Web' as const,
        RoutingChatbotInteractionId: chatInfo?.chatGroup || '',
      };

      const session = await chatAPI.startSession(
        currentPlan.id,
        userInfo,
        chatData,
      );
      setCurrentSession(session);
      lockPlanSwitcher();
      return session;
    } catch (err) {
      setError(
        'There was an issue starting your chat session. Please verify your connection and that you submitted all required information properly, then try again.',
      );
      return null;
    }
  }, [
    eligibility,
    currentPlan,
    chatPayload,
    isBusinessHoursOpen,
    lockPlanSwitcher,
    chatInfo,
  ]);

  /**
   * End the current chat session
   */
  const endChatSession = useCallback(async () => {
    if (!currentSession) return;

    try {
      await chatAPI.endSession(currentSession.id);
      setCurrentSession(null);
      unlockPlanSwitcher();
    } catch (err) {
      setError('Failed to end chat session');
    }
  }, [currentSession, unlockPlanSwitcher]);

  /**
   * Check business hours for the current plan
   */
  const checkBusinessHours = useCallback(async (memberId: string) => {
    try {
      // Now we get business hours directly from the getChatInfo endpoint
      const chatInfoResponse = await chatAPI.getChatInfo(memberId);
      setChatInfo(chatInfoResponse);

      // Check if cloud chat is eligible
      setIsCloudChatEligible(chatInfoResponse.cloudChatEligible);

      // Get business hours from the API
      const hours = await chatAPI.getBusinessHours(memberId);
      setBusinessHours(hours);
      setIsBusinessHoursOpen(hours.isCurrentlyOpen);

      return hours;
    } catch (err) {
      setError('Failed to check business hours');
      setIsBusinessHoursOpen(false);
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Get user session data
        const session = await auth();
        const memCk = session?.user?.currUsr?.plan?.memCk;

        if (!memCk) {
          throw new Error('Member ID not found');
        }

        const userInfo = await getLoggedInUserInfo(memCk);
        const payload = mapUserInfoToChatPayload(userInfo);

        if (!mounted) return;

        // Get business hours for current member
        if (memCk) {
          await checkBusinessHours(memCk);
        }

        // Process eligibility information
        const eligibilityData: UserEligibility = {
          isChatEligibleMember: chatInfo?.chatBotEligibility || false,
          isDemoMember: false,
          isAmplifyMem: false,
          groupId: userInfo.groupData?.groupID || '',
          memberClientID: userInfo.subscriberID || '',
          getGroupType: userInfo.groupData?.policyType || '',
          isBlueEliteGroup: (userInfo.groupData?.groupName || '').includes(
            'Blue Elite',
          ),
          isMedical:
            userInfo.coverageTypes?.some((t) => t.productType === 'M') || false,
          isDental:
            userInfo.coverageTypes?.some((t) => t.productType === 'D') || false,
          isVision:
            userInfo.coverageTypes?.some((t) => t.productType === 'V') || false,
          isWellnessOnly: false,
          isCobraEligible:
            userInfo.authFunctions?.some(
              (f) => f.functionName === 'COBRAELIGIBLE' && f.available,
            ) || false,
          chatHours: businessHours ? formatBusinessHours(businessHours) : '',
          rawChatHours: businessHours ? JSON.stringify(businessHours) : '',
          isChatbotEligible: chatInfo?.chatBotEligibility || false,
          memberMedicalPlanID:
            userInfo.members?.[0]?.planDetails?.find(
              (p) => p.productCategory === 'M',
            )?.planID || '',
          isIDCardEligible:
            userInfo.authFunctions?.some(
              (f) => f.functionName === 'IDPROTECTELIGIBLE' && f.available,
            ) || false,
          // Fix for type issue - ensure DOB is always a string using type assertion
          memberDOB: userInfo.subscriberDateOfBirth
            ? String(userInfo.subscriberDateOfBirth as string | number)
            : '',
          subscriberID: userInfo.subscriberID || '',
          sfx: String(userInfo.members?.[0]?.memberSuffix || ''),
          memberFirstname: userInfo.subscriberFirstName || '',
          memberLastName: userInfo.subscriberLastName || '',
          userID: userInfo.subscriberID || '',
          isChatAvailable: chatInfo?.chatAvailable || false,
          routingchatbotEligible: chatInfo?.routingChatBotEligibility || false,
        };

        setChatPayload(payload);
        setEligibility(eligibilityData);
        setIsEligible(
          eligibilityData.isChatEligibleMember && isBusinessHoursOpen,
        );
        setError(null);
        setIsLoading(false);
      } catch (err) {
        if (!mounted) return;

        setError('Failed to fetch user eligibility information');
        setEligibility(null);
        setChatPayload(null);
        setIsEligible(false);
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [currentPlan, checkBusinessHours, isBusinessHoursOpen, chatInfo]); // Re-fetch when plan changes

  /**
   * Handle events from the chat widget - required for locking/unlocking plan switcher
   */
  useEffect(() => {
    const handleChatStart = () => {
      lockPlanSwitcher();
    };

    const handleChatEnd = () => {
      unlockPlanSwitcher();
      setCurrentSession(null);
    };

    // Add event listeners for chat start/end (these would connect to Genesys events)
    window.addEventListener('chat:started', handleChatStart);
    window.addEventListener('chat:ended', handleChatEnd);

    return () => {
      window.removeEventListener('chat:started', handleChatStart);
      window.removeEventListener('chat:ended', handleChatEnd);
    };
  }, [lockPlanSwitcher, unlockPlanSwitcher]);

  return {
    isLoading,
    error,
    eligibility,
    chatPayload,
    isEligible,
    isBusinessHoursOpen,
    businessHours,
    isLocked,
    currentSession,
    startChatSession,
    endChatSession,
    lockPlanSwitcher,
    unlockPlanSwitcher,
    isCloudChatEligible,
    chatInfo,
  };
}

/**
 * Mock implementation for testing
 */
export function useChatEligibilityMock() {
  return {
    isLoading: false,
    error: null,
    eligibility: null as UserEligibility | null,
    chatPayload: null,
    isEligible: false,
    isBusinessHoursOpen: true,
    businessHours: null,
    isLocked: false,
    currentSession: null,
    startChatSession: async () => null,
    endChatSession: async () => {},
    lockPlanSwitcher: () => {},
    unlockPlanSwitcher: () => {},
    isCloudChatEligible: false,
    chatInfo: null,
  };
}
