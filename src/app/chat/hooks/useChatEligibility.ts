import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/auth';
import { useChatStore } from '@/chat/hooks/useChatStore';
import { mapUserInfoToChatPayload } from '@/utils/chatUtils';
import { useEffect, useState } from 'react';
import { ChatPayload } from '../models/session';

export const useChatEligibility = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatPayload, setChatPayload] = useState<ChatPayload | null>(null);
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
          currentPlan?.planId || null,
        );

        setChatPayload(payload);
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
    isEligible: !!chatPayload, // Consider adding more specific eligibility checks if needed
  };
};
