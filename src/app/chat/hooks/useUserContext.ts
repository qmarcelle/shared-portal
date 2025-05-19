'use client';

import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UserContext {
  memberId: string;
  firstName?: string;
  lastName?: string;
  subscriberId?: string;
  suffix?: string;
  memberType?: string;
  userID?: string;
  memberFirstname?: string;
  memberLastName?: string;
  formattedFirstName?: string;
  subscriberID?: string;
  sfx?: string;
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_RETRIES = 3;

  // Extract user context from session data
  const extractUserContext = useCallback((session: ExtendedSession | null) => {
    if (!session?.user?.currUsr) return null;

    const { umpi, role, firstName, lastName, subscriberId, suffix, plan } =
      session.user.currUsr;
    const memberId = plan?.memCk;

    if (!memberId || !role || !umpi) return null;

    return {
      memberId,
      firstName,
      lastName,
      subscriberId,
      suffix,
      memberType: role,
      userID: umpi,
      memberFirstname: firstName,
      memberLastName: lastName,
      formattedFirstName: firstName,
      subscriberID: subscriberId,
      sfx: suffix,
    };
  }, []);

  // Process session data and set state accordingly
  const processSessionData = useCallback(() => {
    // If session is loading, keep the loading state true
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    try {
      // Handle unauthenticated state
      if (status === 'unauthenticated') {
        setContext(null);
        setLoading(false);
        retryCount.current = MAX_RETRIES; // Prevent retries
        return;
      }

      // Try to extract user context
      const userContextData = extractUserContext(session);

      if (userContextData) {
        // Successfully extracted data
        setContext(userContextData);
        setLoading(false);
        retryCount.current = 0; // Reset retry count on success
      } else if (
        retryCount.current < MAX_RETRIES &&
        status === 'authenticated'
      ) {
        // Retry logic for authenticated session with missing data
        const timeoutDuration = Math.pow(2, retryCount.current) * 1000; // Exponential backoff

        // Clear any existing timer
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        // Set new timer for retry
        timerRef.current = setTimeout(() => {
          retryCount.current += 1;
          // Toggle loading state to trigger re-evaluation
          setLoading((prev) => !prev);
          timerRef.current = null;
        }, timeoutDuration);
      } else if (status === 'authenticated') {
        // Max retries reached
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
  }, [status, session, extractUserContext]);

  // Run the session data processor when dependencies change
  useEffect(() => {
    processSessionData();

    // Cleanup function to clear any timers
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [processSessionData]);

  // Memoize the loading state
  const isLoading = useMemo(
    () => status === 'loading' || loading,
    [status, loading],
  );

  // Optional debug logging for important state changes
  useEffect(() => {
    logger.info(`${LOG_PREFIX} Context or loading state changed:`, {
      contextAvailable: !!context,
      status,
      internalLoading: loading,
      isLoading,
    });
  }, [context, status, loading, isLoading]);

  // Return a memoized object to prevent unnecessary re-renders in consumers
  return useMemo(
    () => ({
      userContext: context,
      isUserContextLoading: isLoading,
    }),
    [context, isLoading],
  );
}
