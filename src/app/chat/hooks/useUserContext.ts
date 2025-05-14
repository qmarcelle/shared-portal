'use client';

import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';

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

declare global {
  interface Window {
    __APP_SESSION__?: AppSession;
  }
}

export function useUserContext(): UserContext | null {
  // Cast the session to our extended type
  const { data: session } = useSession() as { data: ExtendedSession | null };

  try {
    // Check if session and necessary nested properties exist
    if (!session?.user?.currUsr?.plan?.memCk) {
      logger.warn('[useUserContext] No member ID found in session', {
        sessionExists: !!session,
        userExists: !!session?.user,
        currUserExists: !!session?.user?.currUsr,
        planExists: !!session?.user?.currUsr?.plan,
      });
      return null;
    }

    // Access member data from the correct nested structure
    const memberData = session.user.currUsr;
    const planData = memberData.plan!; // We've already checked it exists

    const context: UserContext = {
      memberId: planData.memCk, // Member check ID is the member ID
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      subscriberId: memberData.subscriberId,
      suffix: memberData.suffix,
    };

    logger.info('[useUserContext] Successfully retrieved user context', {
      memberId: context.memberId,
      hasFirstName: !!context.firstName,
      hasLastName: !!context.lastName,
    });

    return context;
  } catch (error) {
    logger.error('[useUserContext] Error getting user context', error);
    return null;
  }
}
