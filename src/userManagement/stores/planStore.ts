import { createWithEqualityFn } from 'zustand/traditional';
import { MemberPlan } from '../models/plan';

//TODO: Sample Store created to be implemented when we do plan switching
type PlanStore = {
  plans: MemberPlan[];
  selectedPlanId: string;
  selectPlanId: (id: string) => void;
};

export const usePlanStore = createWithEqualityFn<PlanStore>(() => ({
  plans: [],
  selectedPlanId: '',
  selectPlanId: (planId) => {},
}));
