import { logger } from '@/utils/logger';
import { useEffect, useState } from 'react';

interface PlanContext {
  planId: string;
  groupId?: string;
  clientId?: string;
  groupType?: string;
}

interface AppSession {
  isAuthenticated: boolean;
  user: string;
  plan: {
    memCk: string;
    grpId: string;
  };
  timestamp: string;
}

declare global {
  interface Window {
    __APP_SESSION__?: AppSession;
  }
}

export function usePlanContext() {
  const [planContext, setPlanContext] = useState<PlanContext | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPlanContext() {
      try {
        // Get session data from global state
        const session =
          typeof window !== 'undefined' ? window.__APP_SESSION__ : undefined;

        if (!session?.isAuthenticated || !session?.plan?.grpId) {
          logger.warn('[usePlanContext] No valid session or group ID found', {
            session,
          });
          setPlanContext(null);
          return;
        }

        // Use the group ID from session as the plan ID
        const context: PlanContext = {
          planId: session.plan.grpId,
          groupId: session.plan.grpId,
        };

        setPlanContext(context);
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error('Failed to fetch plan context');
        logger.error('[usePlanContext] Error getting plan context', error);
        setError(error);
        setPlanContext(null);
      }
    }

    fetchPlanContext();
  }, []); // Only run once on mount since we're reading from global state

  return { planContext, error };
}
