import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/auth';
import { useEffect, useState } from 'react';
import { formatBusinessHours } from '../services/utils/chatHours';
import { useChatStore } from '../stores/chatStore';
import { ChatPayload, UserEligibility } from '../types';
import { mapUserInfoToChatPayload } from '../utils/chatUtils';

export const useChatEligibility = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatPayload, setChatPayload] = useState<ChatPayload | null>(null);
  const [eligibility, setEligibility] = useState<UserEligibility | null>(null);
  const { currentPlan } = useChatStore();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        const session = await auth();
        const memberCk = session?.user.currUsr?.plan?.memCk;

        if (!memberCk) {
          throw new Error('No member CK found');
        }

        const userInfo = await getLoggedInUserInfo(memberCk);

        // Map user info to chat payload, considering selected member and plan
        const payload = mapUserInfoToChatPayload(
          userInfo,
          null, // We'll get the selected member from the store if needed
          currentPlan?.id || null,
        );

        // Map user info to eligibility
        const eligibilityInfo: UserEligibility = {
          isChatEligibleMember: !!payload,
          isDemoMember: false, // Default to false if not available
          isAmplifyMem: false, // Default to false if not available
          groupId: userInfo.groupData.groupID,
          memberClientID: userInfo.subscriberID,
          getGroupType: userInfo.groupData.policyType,
          isBlueEliteGroup: userInfo.groupData.groupName.includes('Blue Elite'),
          isMedical: userInfo.coverageTypes.some(
            (ct) => ct.productType === 'M',
          ),
          isDental: userInfo.coverageTypes.some((ct) => ct.productType === 'D'),
          isVision: userInfo.coverageTypes.some((ct) => ct.productType === 'V'),
          isWellnessOnly: userInfo.coverageTypes.every(
            (ct) => ct.productType === 'S',
          ),
          isCobraEligible: userInfo.authFunctions.some(
            (af) => af.functionName === 'COBRAELIGIBLE' && af.available,
          ),
          chatHours: currentPlan?.businessHours
            ? formatBusinessHours(currentPlan.businessHours)
            : '',
          rawChatHours: currentPlan?.businessHours
            ? JSON.stringify(currentPlan.businessHours)
            : '',
          isChatbotEligible: userInfo.authFunctions.some(
            (af) => af.functionName === 'CHAT_ELIGIBLE' && af.available,
          ),
          memberMedicalPlanID:
            userInfo.members[0]?.planDetails.find(
              (pd) => pd.productCategory === 'M',
            )?.planID || '',
          isIDCardEligible: userInfo.authFunctions.some(
            (af) => af.functionName === 'IDPROTECTELIGIBLE' && af.available,
          ),
          memberDOB: userInfo.subscriberDateOfBirth,
          subscriberID: userInfo.subscriberID,
          sfx: userInfo.members[0]?.memberSuffix?.toString() || '',
          memberFirstname: userInfo.subscriberFirstName,
          memberLastName: userInfo.subscriberLastName,
          userID: userInfo.subscriberID,
          isChatAvailable: userInfo.authFunctions.some(
            (af) => af.functionName === 'CHAT_ELIGIBLE' && af.available,
          ),
          routingchatbotEligible: userInfo.authFunctions.some(
            (af) => af.functionName === 'CHAT_ELIGIBLE' && af.available,
          ),
        };

        setChatPayload(payload);
        setEligibility(eligibilityInfo);
        setError(null);
      } catch (err) {
        setError('Failed to fetch user eligibility information');
        console.error('Error fetching user info:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [currentPlan]); // Re-run when plan changes

  return {
    isLoading,
    error,
    chatPayload,
    eligibility,
    isEligible: !!chatPayload, // Consider adding more specific eligibility checks if needed
  };
};
