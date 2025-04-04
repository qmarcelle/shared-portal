import { useCallback, useEffect, useState } from 'react';
import { PlanService } from '../services';
import { ChatPlan, ChatPlanStatus } from '../types';

export const usePlanSwitcher = () => {
  const [plans, setPlans] = useState<ChatPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ChatPlan | null>(null);
  const [status, setStatus] = useState<ChatPlanStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      setStatus('loading');
      const availablePlans = await PlanService.getAvailablePlans();
      setPlans(availablePlans);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch plans');
      setStatus('error');
    }
  }, []);

  const switchPlan = useCallback(
    async (planId: string) => {
      try {
        setStatus('switching');
        await PlanService.switchPlan(planId);
        const newPlan = plans.find((p) => p.id === planId);
        setSelectedPlan(newPlan || null);
        setStatus('success');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to switch plan');
        setStatus('error');
      }
    },
    [plans],
  );

  const validatePlanEligibility = useCallback(async (planId: string) => {
    try {
      return await PlanService.validatePlanEligibility(planId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate plan');
      return false;
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return {
    plans,
    selectedPlan,
    status,
    error,
    switchPlan,
    validatePlanEligibility,
  };
};
