import { createWithEqualityFn } from 'zustand/traditional';
import { MemberPlan } from '../models/plan';

//TODO: Sample Store created to be implemented when we do plan switching
type PlanStore = {
  plans: MemberPlan[];
  selectedPlanId: string;
  isLoading: boolean;
  error: string | null;
  setPlans: (plans: MemberPlan[]) => void;
  setSelectedPlanId: (id: string) => void;
  setError: (error: string | null) => void;
};

export const usePlanStore = createWithEqualityFn<PlanStore>((set) => ({
  plans: [],
  selectedPlanId: '',
  isLoading: false,
  error: null,

  setPlans: (plans) => set({ plans }),
  setSelectedPlanId: (id) => set({ selectedPlanId: id }),
  setError: (error) => set({ error }),
}));
