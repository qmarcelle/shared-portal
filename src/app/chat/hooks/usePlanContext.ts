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
import { useEffect, useRef, useState } from 'react';

const LOG_PREFIX = '[usePlanContext]';

interface PlanContext {
  planId: string;
  groupId?: string; // Typically same as planId from grpId in current structure
  memberMedicalPlanID?: string; // Added memberMedicalPlanID
  memberClientID?: string; // Added for client ID
  memberDOB?: string; // Added for DOB
  groupType?: string; // Added for group type
  // Add other plan-specific fields if needed, e.g., clientId, groupType
}

interface ExtendedSession {
  user: {
    currUsr?: {
      memberDOB?: string; // Added DOB at user level
      plan?: {
        grpId: string; // This is used as planId
        subId?: string; // Added subId for memberMedicalPlanID
        clientId?: string; // Added clientId
        groupType?: string; // Added groupType
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
  const retryCount = useRef(0);
  const MAX_RETRIES = 3; // Maximum number of retries

  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} useEffect triggered. Session status: ${status}, Internal loading: ${loading}, Retry count: ${retryCount.current}`,
    );
    let timer: NodeJS.Timeout | null = null;
    setError(null); // Clear previous errors on new attempt

    try {
      if (status === 'loading') {
        logger.info(
          `${LOG_PREFIX} Session status is 'loading'. Waiting for session...`,
        );
        setLoading(true); // Ensure internal loading reflects session loading
        return;
      }

      if (status !== 'authenticated' || !session?.user?.currUsr?.plan) {
        logger.warn(
          `${LOG_PREFIX} Session not authenticated or plan data path not available.`,
          {
            status,
            sessionAvailable: !!session,
            currUsrAvailable: !!session?.user?.currUsr,
            planPathAvailable: !!session?.user?.currUsr?.plan,
          },
        );
        if (status === 'unauthenticated') {
          setPlanContext(null);
          setLoading(false);
          setError(new Error('User is unauthenticated.'));
          retryCount.current = MAX_RETRIES; // Prevent retries
          logger.warn(
            `${LOG_PREFIX} Session is unauthenticated. Plan context will be null.`,
          );
          return;
        }
        // If authenticated but plan path is missing, keep loading to allow for retries
        setLoading(true);
      }

      const planId = session?.user?.currUsr?.plan?.grpId;
      const subId = session?.user?.currUsr?.plan?.subId; // Extracted subId
      const clientId = session?.user?.currUsr?.plan?.clientId; // Extract clientId
      const groupType = session?.user?.currUsr?.plan?.groupType; // Extract groupType
      const memberDOB = session?.user?.currUsr?.memberDOB; // Extract DOB from user level

      if (planId && subId) {
        // Still gate by planId as primary identifier for context validity
        logger.info(
          `${LOG_PREFIX} Plan data (planId, subId) found in session. Setting planContext.`,
          {
            planId: planId?.substring(0, 3) + '...',
            memberMedicalPlanID: subId,
            memberClientID: clientId,
            groupType: groupType,
            memberDOB: memberDOB,
          },
        );
        setPlanContext({
          planId: planId,
          groupId: planId, // Assuming groupId is the same as planId from grpId
          memberMedicalPlanID: subId, // Set memberMedicalPlanID from subId
          memberClientID: clientId, // Set memberClientID from clientId
          groupType: groupType, // Set groupType from session
          memberDOB: memberDOB, // Set memberDOB from user level
        });
        setLoading(false);
        setError(null); // Clear error on success
        retryCount.current = 0; // Reset retry count
      } else if (
        retryCount.current < MAX_RETRIES &&
        status === 'authenticated'
      ) {
        // Only retry if authenticated and planId is still not found
        const timeoutDuration = Math.pow(2, retryCount.current) * 1000;
        logger.warn(
          `${LOG_PREFIX} Essential plan data (planId, subId) not available in authenticated session. Will retry (${retryCount.current + 1}/${MAX_RETRIES}) in ${timeoutDuration}ms.`,
          {
            currentPlanDataInSession: session?.user?.currUsr?.plan,
            expected: { planId: !!planId, subId: !!subId },
          },
        );
        timer = setTimeout(() => {
          retryCount.current += 1;
          logger.info(
            `${LOG_PREFIX} Retrying fetch for plan context. Attempt ${retryCount.current}`,
          );
          // Force re-evaluation by toggling loading state
          // This is a common pattern to trigger useEffect re-run when dependencies might not change reference
          setLoading((prev) => !prev);
        }, timeoutDuration);
      } else if (status === 'authenticated') {
        // Max retries reached while authenticated but planId not found
        const errMsg = `Failed to load essential plan data (planId, subId) after ${MAX_RETRIES} retries, despite session being authenticated.`;
        logger.error(`${LOG_PREFIX} ${errMsg}`, {
          sessionPlanData: session?.user?.currUsr?.plan,
          expected: { planId: !!planId, subId: !!subId },
        });
        setPlanContext(null);
        setError(new Error(errMsg));
        setLoading(false);
      } else {
        // Covers other cases like unauthenticated and max retries already attempted, or other non-loading statuses
        logger.info(
          `${LOG_PREFIX} Plan data not loaded. Final state check before returning null context.`,
          { status, retries: retryCount.current },
        );
        setPlanContext(null);
        if (!error && status === 'unauthenticated') {
          setError(new Error('User is unauthenticated.')); // Ensure error is set if somehow missed
        }
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

    return () => {
      if (timer) {
        logger.info(`${LOG_PREFIX} Clearing retry timer on unmount/re-effect.`);
        clearTimeout(timer);
      }
    };
    // Add error to dependency array so if it's set externally or by a previous run, it can be cleared if conditions change.
  }, [session, status, loading, error]);

  const finalLoadingState = status === 'loading' || loading;
  logger.info(
    `${LOG_PREFIX} Hook returning. isPlanContextLoading: ${finalLoadingState}`,
    {
      planContextAvailable: !!planContext,
      error: error?.message,
      status,
      internalLoading: loading,
    },
  );

  return {
    planContext,
    error,
    isPlanContextLoading: finalLoadingState,
  };
}
