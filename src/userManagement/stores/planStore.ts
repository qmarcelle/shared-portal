// src/stores/planStore.ts
import { logger } from '@/utils/logger'; // Assuming logger is available
import { createWithEqualityFn } from 'zustand/traditional';
import { MemberPlan } from '../models/plan';

const LOG_PREFIX_STORE = '[PlanStore]';

export type PlanStore = {
  // == Existing ==
  plans: MemberPlan[];
  selectedPlanId: string;
  isLoading: boolean;
  error: string | null;
  setPlans: (plans: MemberPlan[]) => void;
  setSelectedPlanId: (id: string) => void;
  setError: (error: string | null) => void;

  // == New: plan-switch locking ==
  isPlanSwitcherLocked: boolean;
  planSwitcherTooltip: string;
  setLocked: (locked: boolean) => void;
  showHover: (message: string) => void;
  hideHover: () => void;
  openPlanSwitcher: () => void;
};

export const usePlanStore = createWithEqualityFn<PlanStore>((set) => {
  logger.info(
    `${LOG_PREFIX_STORE} Initializing. Initial isLoading state: false`,
  );
  return {
    // == Existing initial state ==
    plans: [],
    selectedPlanId: '',
    isLoading: false, // Initial state
    error: null,

    // == Existing actions ==
    setPlans: (plans) => {
      logger.info(
        `${LOG_PREFIX_STORE} setPlans called. Number of plans: ${plans?.length}. First plan ID (if any): ${plans?.[0]?.id}`,
      );
      set({ plans });
    },
    setSelectedPlanId: (id) => {
      logger.info(`${LOG_PREFIX_STORE} setSelectedPlanId called. ID: ${id}`);
      set({ selectedPlanId: id });
    },
    setError: (error) => {
      logger.info(`${LOG_PREFIX_STORE} setError called. Error: ${error}`);
      set({ error });
    },

    // == New initial state ==
    isPlanSwitcherLocked: false,
    planSwitcherTooltip: '',

    // == New actions ==
    setLocked: (locked) => set({ isPlanSwitcherLocked: locked }),
    showHover: (message) => set({ planSwitcherTooltip: message }),
    hideHover: () => set({ planSwitcherTooltip: '' }),
    openPlanSwitcher: () => {
      // e.g. focus your plan dropdown or open a modal:
      const el = document.getElementById('plan-select');
      if (el) el.focus();
    },
  };
});
