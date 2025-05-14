'use client';

import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface UserContext {
  memberId: string;
  firstName?: string;
  lastName?: string;
  subscriberId?: string;
  suffix?: string;
}

// Define the expected session structure based on what we see in the logs
interface ExtendedSession {
  user: {
    currUsr?: {
      umpi: string;
      fhirId: string;
      role: string;
      firstName?: string;
      lastName?: string;
      subscriberId?: string;
      suffix?: string;
      plan?: {
        memCk: string;
        sbsbCk: string;
        grgrCk: string;
        grpId: string;
        subId: string;
        fhirId: string;
        ntwkId: string;
      };
    };
  };
}

interface UserContextReturn {
  userContext: UserContext | null;
  isUserContextLoading: boolean;
}

export function useUserContext(): UserContextReturn {
  // Cast the session to our extended type
  const { data: session, status } = useSession() as {
    data: ExtendedSession | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
  };

  const [context, setContext] = useState<UserContext | null>(null);

  useEffect(() => {
    try {
      // Only process when session is fully authenticated
      if (status !== 'authenticated' || !session) {
        logger.info('[useUserContext] Session not authenticated yet', {
          status,
        });
        return;
      }

      // Only set context when critical data is available
      if (!session?.user?.currUsr?.plan?.memCk) {
        logger.warn('[useUserContext] No member ID found in session', {
          sessionExists: !!session,
          userExists: !!session?.user,
          currUserExists: !!session?.user?.currUsr,
          planExists: !!session?.user?.currUsr?.plan,
          memCkExists: !!session?.user?.currUsr?.plan?.memCk,
        });
        return;
      }

      // Access member data from the correct nested structure
      const memberData = session.user.currUsr;
      const planData = memberData.plan!; // We've already checked it exists

      const newContext: UserContext = {
        memberId: planData.memCk, // Member check ID is the member ID
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        subscriberId: memberData.subscriberId,
        suffix: memberData.suffix,
      };

      logger.info('[useUserContext] Successfully retrieved user context', {
        memberId: newContext.memberId,
        hasFirstName: !!newContext.firstName,
        hasLastName: !!newContext.lastName,
      });

      setContext(newContext);
    } catch (error) {
      logger.error('[useUserContext] Error getting user context', error);
      setContext(null);
    }
  }, [session, status]);

  // Consider loading if:
  // 1. Session is still loading OR
  // 2. Session is authenticated but context isn't set yet (critical data not available)
  const isUserContextLoading =
    status === 'loading' || (status === 'authenticated' && !context);

  return {
    userContext: context,
    isUserContextLoading,
  };
}
