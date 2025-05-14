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

export function usePlanContext() {
  // Cast the session to our extended type
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const [planContext, setPlanContext] = useState<PlanContext | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Check if session and necessary nested properties exist
      if (!session?.user?.currUsr?.plan?.grpId) {
        logger.warn('[usePlanContext] No plan data found in session', {
          sessionExists: !!session,
          userExists: !!session?.user,
          currUserExists: !!session?.user?.currUsr,
          planExists: !!session?.user?.currUsr?.plan,
        });
        setPlanContext(null);
        return;
      }

      // Access plan data from the correct nested structure
      const planData = session.user.currUsr.plan;

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
      const error =
        err instanceof Error ? err : new Error('Failed to get plan context');
      logger.error('[usePlanContext] Error getting plan context', error);
      setError(error);
      setPlanContext(null);
    }
  }, [session]);

  return { planContext, error };
}
