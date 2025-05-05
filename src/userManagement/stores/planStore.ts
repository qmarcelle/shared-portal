// src/stores/planStore.ts
import { createWithEqualityFn } from 'zustand/traditional';
import { MemberPlan } from '../models/plan';

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

export const usePlanStore = createWithEqualityFn<PlanStore>((set) => ({
  // == Existing initial state ==
  plans: [],
  selectedPlanId: '',
  isLoading: false,
  error: null,

  // == Existing actions ==
  setPlans: (plans) => set({ plans }),
  setSelectedPlanId: (id) => set({ selectedPlanId: id }),
  setError: (error) => set({ error }),

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
}));
