'use client';

/**
 * @file usePlanContext.ts
 * @description Custom React hook to extract and provide essential plan context information
 * derived from the NextAuth session.
 * As per README.md: "Session-based plan context hook."
 * It specifically extracts `planId` (from `session.user.currUsr.plan.grpId`) and `groupId`.
 * Handles loading states, includes retry logic if session data is not immediately available,
 * and exposes an error state if fetching fails.
 * This context is crucial for the `loadChatConfiguration` action in `chatStore.ts`.
 */

import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const LOG_PREFIX = '[usePlanContext]';

interface PlanContext {
  planId: string;
  groupId?: string; // Typically same as planId from grpId in current structure
  memberMedicalPlanID?: string; // Added memberMedicalPlanID
  // Add other plan-specific fields if needed, e.g., clientId, groupType
}

interface ExtendedSession {
  user: {
    currUsr?: {
      plan?: {
        grpId: string; // This is used as planId
        subId?: string; // Added subId for memberMedicalPlanID
        // Other plan fields if available and needed by chat
      };
    };
  };
}

interface PlanContextReturn {
  planContext: PlanContext | null;
  error: Error | null;
  isPlanContextLoading: boolean;
}

export function usePlanContext(): PlanContextReturn {
  const { data: session, status } = useSession() as {
    data: ExtendedSession | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
  };

  const [planContext, setPlanContext] = useState<PlanContext | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true); // Internal loading state

  // Use refs for values that shouldn't trigger re-renders
  const retryCount = useRef(0);
  const MAX_RETRIES = 3; // Maximum number of retries
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Create a memoized function to extract plan context from session
  const extractPlanContext = useCallback((session: ExtendedSession | null) => {
    if (!session?.user?.currUsr?.plan) return null;

    const planId = session.user.currUsr.plan.grpId;
    const subId = session.user.currUsr.plan.subId;

    if (!planId || !subId) return null;

    return {
      planId,
      groupId: planId, // Assuming groupId is same as planId from grpId
      memberMedicalPlanID: subId,
    };
  }, []);

  // Process the session data and update state
  const processSessionData = useCallback(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    // Clear errors on each new attempt
    setError(null);

    try {
      if (status !== 'authenticated') {
        setPlanContext(null);
        setLoading(false);
        if (status === 'unauthenticated') {
          setError(new Error('User is unauthenticated.'));
          retryCount.current = MAX_RETRIES; // Prevent retries
        }
        return;
      }

      // Extract plan context
      const extractedContext = extractPlanContext(session);

      if (extractedContext) {
        logger.info(
          `${LOG_PREFIX} Plan data found in session. Setting planContext.`,
        );
        setPlanContext(extractedContext);
        setLoading(false);
        retryCount.current = 0; // Reset retry count on success
      } else if (retryCount.current < MAX_RETRIES) {
        // Only retry if authenticated and data not found
        const timeoutDuration = Math.pow(2, retryCount.current) * 1000;
        logger.warn(
          `${LOG_PREFIX} Essential plan data not available. Will retry (${retryCount.current + 1}/${MAX_RETRIES}) in ${timeoutDuration}ms.`,
        );

        // Clear any existing timer
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        // Set new timer
        timerRef.current = setTimeout(() => {
          retryCount.current += 1;
          // Force re-evaluation by toggling loading state
          setLoading((prev) => !prev);
          timerRef.current = null;
        }, timeoutDuration);
      } else {
        // Max retries reached
        const errMsg = `Failed to load essential plan data after ${MAX_RETRIES} retries.`;
        logger.error(`${LOG_PREFIX} ${errMsg}`);
        setPlanContext(null);
        setError(new Error(errMsg));
        setLoading(false);
      }
    } catch (err: any) {
      const errorObj =
        err instanceof Error
          ? err
          : new Error(
              String(err?.message || 'Unknown error getting plan context'),
            );

      logger.error(
        `${LOG_PREFIX} Exception while getting plan context:`,
        errorObj,
      );
      setError(errorObj);
      setPlanContext(null);
      setLoading(false);
    }
  }, [status, session, extractPlanContext]);

  // Watch for session changes and process data
  useEffect(() => {
    processSessionData();

    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [processSessionData]);

  // Memoize the final loading state to maintain a stable reference
  const finalLoadingState = useMemo(
    () => status === 'loading' || loading,
    [status, loading],
  );

  // Log only on context or loading changes to reduce noise
  useEffect(() => {
    logger.info(`${LOG_PREFIX} Context or loading state changed:`, {
      planContextAvailable: !!planContext,
      error: error?.message,
      status,
      internalLoading: loading,
      isLoading: finalLoadingState,
    });
  }, [planContext, error, status, loading, finalLoadingState]);

  // Return a memoized value to prevent unnecessary re-renders in consumers
  return useMemo(
    () => ({
      planContext,
      error,
      isPlanContextLoading: finalLoadingState,
    }),
    [planContext, error, finalLoadingState],
  );
}
