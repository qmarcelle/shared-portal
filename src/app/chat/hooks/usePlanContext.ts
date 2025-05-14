'use client';

import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

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
  const [loading, setLoading] = useState(true);
  const retryCount = useRef(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    setError(null);
    try {
      if (status !== 'authenticated' || !session) {
        logger.info('[usePlanContext] Session not authenticated yet', {
          status,
        });
        setLoading(true);
        return;
      }
      const planData = session?.user?.currUsr?.plan;
      if (planData && planData.grpId) {
        logger.info('[usePlanContext] Successfully loaded plan data');
        setPlanContext({
          planId: planData.grpId,
          groupId: planData.grpId,
        });
        setLoading(false);
        retryCount.current = 0;
      } else if (retryCount.current < MAX_RETRIES) {
        // Retry logic with exponential backoff
        const timeout = Math.pow(2, retryCount.current) * 1000;
        logger.warn(
          `[usePlanContext] Plan data not available, retry ${retryCount.current + 1}/${MAX_RETRIES} in ${timeout}ms`,
        );
        timer = setTimeout(() => {
          retryCount.current += 1;
          setLoading(true); // Force re-render to trigger another check
        }, timeout);
      } else {
        logger.error(
          '[usePlanContext] Failed to load plan data after maximum retries',
        );
        setLoading(false);
      }
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error('Failed to get plan context');
      logger.error('[usePlanContext] Error getting plan context', errorObj);
      setError(errorObj);
      setPlanContext(null);
      setLoading(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [session, status, loading]);

  return {
    planContext,
    error,
    isPlanContextLoading: status === 'loading' || loading,
  };
}
