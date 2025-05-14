import { logger } from '@/utils/logger';
import { useEffect, useState } from 'react';
import { useUserContext } from './useUserContext';

interface PlanContext {
  planId: string;
  groupId?: string;
  clientId?: string;
  groupType?: string;
}

export function usePlanContext() {
  const userContext = useUserContext();
  const [planContext, setPlanContext] = useState<PlanContext | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPlanContext() {
      if (!userContext?.memberId) {
        logger.warn('[usePlanContext] No user context available');
        return;
      }

      try {
        const response = await fetch(
          `/api/chat/getChatInfo?memberId=${userContext.memberId}&memberType=byMemberCk`,
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch plan context: ${response.statusText}`,
          );
        }

        const data = await response.json();

        // Extract plan data from the API response
        const context: PlanContext = {
          planId: data.planId,
          groupId: data.groupId,
          clientId: data.clientId,
          groupType: data.groupType,
        };

        if (!context.planId) {
          logger.warn('[usePlanContext] No plan ID found in API response');
          setPlanContext(null);
          return;
        }

        setPlanContext(context);
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error('Failed to fetch plan context');
        logger.error('[usePlanContext] Error fetching plan context', error);
        setError(error);
        setPlanContext(null);
      }
    }

    fetchPlanContext();
  }, [userContext?.memberId]);

  return { planContext, error };
}
