'use client';

import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

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
  const [loading, setLoading] = useState(true);
  const retryCount = useRef(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    try {
      if (status !== 'authenticated' || !session) {
        logger.info('[useUserContext] Session not authenticated yet', {
          status,
        });
        setLoading(true);
        return;
      }
      const userData = session?.user?.currUsr?.plan?.memCk;
      if (userData) {
        logger.info('[useUserContext] Successfully loaded member data');
        setContext({
          memberId: userData,
          firstName: session.user.currUsr?.firstName,
          lastName: session.user.currUsr?.lastName,
          subscriberId: session.user.currUsr?.subscriberId,
          suffix: session.user.currUsr?.suffix,
        });
        setLoading(false);
        retryCount.current = 0;
      } else if (retryCount.current < MAX_RETRIES) {
        // Retry logic with exponential backoff
        const timeout = Math.pow(2, retryCount.current) * 1000;
        logger.warn(
          `[useUserContext] Member data not available, retry ${retryCount.current + 1}/${MAX_RETRIES} in ${timeout}ms`,
        );
        timer = setTimeout(() => {
          retryCount.current += 1;
          setLoading(true); // Force re-render to trigger another check
        }, timeout);
      } else {
        logger.error(
          '[useUserContext] Failed to load member data after maximum retries',
        );
        setLoading(false);
      }
    } catch (error) {
      logger.error('[useUserContext] Error getting user context', error);
      setContext(null);
      setLoading(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [session, status, loading]);

  return {
    userContext: context,
    isUserContextLoading: status === 'loading' || loading,
  };
}
