'use client';

import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface PlanContext {
  planId: string;
  groupId?: string;
  clientId?: string;
  groupType?: string;
}

// Define the expected session structure based on what we see in the logs
interface ExtendedSession {
  user: {
    currUsr?: {
      umpi: string;
      fhirId: string;
      role: string;
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

interface PlanContextReturn {
  planContext: PlanContext | null;
  error: Error | null;
  isPlanContextLoading: boolean;
}

export function usePlanContext(): PlanContextReturn {
  // Cast the session to our extended type
  const { data: session, status } = useSession() as {
    data: ExtendedSession | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
  };
  const [planContext, setPlanContext] = useState<PlanContext | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset error on new effect call
    setError(null);

    try {
      // Only process when session is fully authenticated
      if (status !== 'authenticated' || !session) {
        logger.info('[usePlanContext] Session not authenticated yet', {
          status,
        });
        return;
      }

      // Check if session and necessary nested properties exist
      if (!session?.user?.currUsr?.plan?.grpId) {
        logger.warn('[usePlanContext] No plan data found in session', {
          sessionExists: !!session,
          userExists: !!session?.user,
          currUserExists: !!session?.user?.currUsr,
          planExists: !!session?.user?.currUsr?.plan,
          grpIdExists: !!session?.user?.currUsr?.plan?.grpId,
        });
        setPlanContext(null);
        return;
      }

      // Access plan data from the correct nested structure
      const planData = session.user.currUsr.plan;

      // Validate critical fields
      if (!planData.grpId) {
        logger.warn('[usePlanContext] grpId is required but missing');
        setPlanContext(null);
        return;
      }

      const context: PlanContext = {
        planId: planData.grpId, // Group ID is the plan ID
        groupId: planData.grpId,
        // Note: clientId and groupType not available in the current session structure
      };

      logger.info('[usePlanContext] Successfully retrieved plan context', {
        planId: context.planId,
        groupId: context.groupId,
      });

      setPlanContext(context);
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error('Failed to get plan context');
      logger.error('[usePlanContext] Error getting plan context', errorObj);
      setError(errorObj);
      setPlanContext(null);
    }
  }, [session, status]);

  // Consider loading if:
  // 1. Session is still loading OR
  // 2. Session is authenticated but context isn't set yet (critical data not available)
  const isPlanContextLoading =
    status === 'loading' || (status === 'authenticated' && !planContext);

  return { planContext, error, isPlanContextLoading };
}
