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
  memberType?: string;
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

const LOG_PREFIX = '[useUserContext]';

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
    logger.info(
      `${LOG_PREFIX} useEffect triggered. Session status: ${status}, Internal loading: ${loading}, Retry count: ${retryCount.current}`,
    );
    let timer: NodeJS.Timeout | null = null;
    try {
      if (status === 'loading') {
        logger.info(
          `${LOG_PREFIX} Session status is 'loading'. Waiting for session...`,
        );
        setLoading(true); // Ensure internal loading reflects session loading
        return;
      }

      if (status !== 'authenticated' || !session?.user?.currUsr) {
        logger.warn(
          `${LOG_PREFIX} Session not authenticated or currUsr not available.`,
          {
            status,
            sessionAvailable: !!session,
            currUsrAvailable: !!session?.user?.currUsr,
          },
        );
        // If unauthenticated, we might not want to retry, or handle differently
        if (status === 'unauthenticated') {
          setContext(null);
          setLoading(false);
          retryCount.current = MAX_RETRIES; // Prevent retries if unauthenticated
          logger.warn(
            `${LOG_PREFIX} Session is unauthenticated. User context will be null.`,
          );
          return;
        }
        // For other non-ideal states where currUsr might be missing but session is technically authenticated
        setLoading(true); // Keep loading true to allow for retries if applicable
        // Fall through to retry logic if applicable (e.g. session authenticated but currUsr temporarily missing)
      }

      const memberId = session?.user?.currUsr?.plan?.memCk;
      const firstName = session?.user?.currUsr?.firstName;
      const lastName = session?.user?.currUsr?.lastName;
      const subscriberId = session?.user?.currUsr?.subscriberId;
      const suffix = session?.user?.currUsr?.suffix;
      const role = session?.user?.currUsr?.role;

      if (memberId) {
        logger.info(
          `${LOG_PREFIX} User data (memberId) found in session. Setting userContext.`,
          { memberId: memberId?.substring(0, 3) + '...', role },
        );
        setContext({
          memberId: memberId,
          firstName: firstName,
          lastName: lastName,
          subscriberId: subscriberId,
          suffix: suffix,
          memberType: role,
        });
        setLoading(false);
        retryCount.current = 0; // Reset retry count on success
      } else if (
        retryCount.current < MAX_RETRIES &&
        status === 'authenticated'
      ) {
        // Only retry if authenticated
        const timeoutDuration = Math.pow(2, retryCount.current) * 1000; // Exponential backoff
        logger.warn(
          `${LOG_PREFIX} User data (memberId) not available in session. Will retry (${retryCount.current + 1}/${MAX_RETRIES}) in ${timeoutDuration}ms.`,
          { sessionData: session }, // Log available session data for debugging
        );
        timer = setTimeout(() => {
          retryCount.current += 1;
          // We don't call setLoading(true) here if status is authenticated but data is missing.
          // Instead, we rely on the session object changing or the next execution of useEffect.
          // Forcing a re-render if session object itself hasn't changed might not be effective.
          // The original setLoading(true) was removed from here; if a re-check is needed, it should be based on session/status dependency.
          // To force re-evaluation, one might need to manipulate a dummy state or rely on session object reference change.
          // For now, simple retry count increment and timeout.
          logger.info(
            `${LOG_PREFIX} Retrying fetch for user context. Attempt ${retryCount.current}`,
          );
          // Forcing a re-render by toggling loading state if it was false
          if (!loading) setLoading(true);
          else setLoading(false); //This is a bit hacky, ideally session object change drives this.
        }, timeoutDuration);
      } else if (status === 'authenticated') {
        // Max retries reached while authenticated
        logger.error(
          `${LOG_PREFIX} Failed to load user data (memberId) after ${MAX_RETRIES} retries, despite session being authenticated. User context will be null.`,
          { sessionData: session },
        );
        setContext(null); // Set context to null after max retries
        setLoading(false);
      } else {
        // Covers cases like unauthenticated and max retries (already handled above but as a fallback)
        logger.info(`${LOG_PREFIX} User data not loaded. Final state check.`, {
          status,
          retries: retryCount.current,
        });
        setContext(null);
        setLoading(false);
      }
    } catch (error) {
      logger.error(
        `${LOG_PREFIX} Exception while getting user context:`,
        error,
      );
      setContext(null);
      setLoading(false);
    }
    return () => {
      if (timer) {
        logger.info(`${LOG_PREFIX} Clearing retry timer on unmount/re-effect.`);
        clearTimeout(timer);
      }
    };
    // Dependency array: re-run if session object reference, its status, or our internal loading state changes.
  }, [session, status, loading]);

  // isLoading is true if session is loading OR our internal loading logic is active.
  const finalLoadingState = status === 'loading' || loading;
  logger.info(
    `${LOG_PREFIX} Hook returning. isUserContextLoading: ${finalLoadingState}`,
    { contextAvailable: !!context, status, internalLoading: loading },
  );

  return {
    userContext: context,
    isUserContextLoading: finalLoadingState,
  };
}
