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
import { SessionContextValue, useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const LOG_PREFIX = '[usePlanContext]';

// Align with PlanConfig expected by buildGenesysChatConfig
interface PlanContextForChat {
  memberMedicalPlanID?: string; // From session.user.currUsr.plan.subId
  planId?: string; // From session.user.currUsr.plan.grpId
  groupId?: string; // From session.user.currUsr.plan.grpId
  memberClientID?: string; // Potentially from session.user.currUsr.plan.ntwkId or other plan field
  groupType?: string; // If available in session.user.currUsr.plan
  memberDOB?: string; // From session.user.currUsr.dob (from UserProfile mapping)
}

// Reflects the populated session.user.currUsr.plan structure
interface SessionPlanData {
  grpId: string;
  subId: string;
  memCk: string; // Available, not directly in PlanContextForChat but good to acknowledge
  ntwkId?: string; // Potential source for memberClientID
  // Add other fields like groupType if they exist in the session plan data
  // e.g., groupType?: string;
}

// Reflects the populated session.user.currUsr structure relevant for DOB
interface SessionCurrentUserForPlan {
  dob?: string; // From UserProfile.dob mapped to session.user.currUsr
  plan?: SessionPlanData;
  // other currUsr fields
}

// Define ExtendedSession to properly type the return of useSession()
interface ExtendedSession {
  user?: {
    currUsr?: SessionCurrentUserForPlan;
  };
  expires: string;
}

// This type represents the object returned by useSession()
interface UseSessionReturn {
  data: ExtendedSession | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  update: SessionContextValue['update'];
}

interface PlanContextReturn {
  planContext: PlanContextForChat | null;
  error: Error | null;
  isPlanContextLoading: boolean;
}

export function usePlanContext(): PlanContextReturn {
  const { data: session, status } = useSession() as UseSessionReturn;

  const [planContext, setPlanContext] = useState<PlanContextForChat | null>(
    null,
  );
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const retryCount = useRef(0);
  const MAX_RETRIES = 3;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const extractData = useCallback(
    (currentSession: ExtendedSession | null): PlanContextForChat | null => {
      const currentPlan = currentSession?.user?.currUsr?.plan;
      const currentUser = currentSession?.user?.currUsr;

      if (!currentPlan) {
        logger.info(`${LOG_PREFIX} currentPlan not found in session.`);
        return null;
      }

      const { grpId, subId, ntwkId } = currentPlan;
      // Assuming groupType might be added to SessionPlanData if available
      // const groupType = currentPlan.groupType;

      if (!grpId || !subId) {
        logger.warn(
          `${LOG_PREFIX} Missing essential fields (grpId, subId) in currentPlan.`,
        );
        return null;
      }

      logger.info(`${LOG_PREFIX} Extracted data for PlanContext:`, {
        grpId,
        subId,
        ntwkId,
        dob: currentUser?.dob,
      });

      return {
        planId: grpId,
        groupId: grpId,
        memberMedicalPlanID: subId,
        memberClientID: ntwkId, // Or map from another source if ntwkId is not memberClientID
        // groupType: groupType, // Uncomment if groupType is available
        memberDOB: currentUser?.dob, // DOB from user part of session
      };
    },
    [],
  );

  const processSessionData = useCallback(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    setError(null);

    try {
      if (status !== 'authenticated') {
        setPlanContext(null);
        setLoading(false);
        if (status === 'unauthenticated') {
          logger.warn(`${LOG_PREFIX} User is unauthenticated.`);
          setError(new Error('User is unauthenticated.'));
          retryCount.current = MAX_RETRIES;
        }
        return;
      }

      if (!session?.user?.currUsr?.plan) {
        logger.warn(
          `${LOG_PREFIX} Session authenticated, but session.user.currUsr.plan is not yet populated.`,
        );
      }

      const extractedContext = extractData(session);

      if (extractedContext) {
        logger.info(`${LOG_PREFIX} Successfully extracted plan context.`);
        setPlanContext(extractedContext);
        setLoading(false);
        retryCount.current = 0;
        if (timerRef.current) clearTimeout(timerRef.current);
      } else if (retryCount.current < MAX_RETRIES) {
        const timeoutDuration = Math.pow(2, retryCount.current) * 1000;
        logger.warn(
          `${LOG_PREFIX} Data not available or incomplete in session.user.currUsr.plan. Retrying (${retryCount.current + 1}/${MAX_RETRIES}) in ${timeoutDuration}ms.`,
        );

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
          retryCount.current += 1;
          setLoading(true);
          processSessionData();
        }, timeoutDuration);
      } else {
        const errMsg = `Failed to load plan context from session.user.currUsr.plan after ${MAX_RETRIES} retries.`;
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
        `${LOG_PREFIX} Exception while processing session data:`,
        errorObj,
      );
      setError(errorObj);
      setPlanContext(null);
      setLoading(false);
    }
  }, [status, session, extractData]);

  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} Initializing or session/status changed. Status: ${status}`,
    );
    processSessionData();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        logger.info(`${LOG_PREFIX} Cleared timer on unmount/re-effect.`);
      }
    };
  }, [processSessionData]);

  const isPlanContextLoading = useMemo(
    () => status === 'loading' || loading,
    [status, loading],
  );

  useEffect(() => {
    logger.info(`${LOG_PREFIX} State update:`, {
      planContext: planContext ? 'Available' : 'Null',
      error: error?.message || null,
      isPlanContextLoading,
      sessionStatus: status,
      internalLoading: loading,
      retryCount: retryCount.current,
    });
  }, [planContext, error, isPlanContextLoading, status, loading]);

  return useMemo(
    () => ({
      planContext,
      error,
      isPlanContextLoading,
    }),
    [planContext, error, isPlanContextLoading],
  );
}
