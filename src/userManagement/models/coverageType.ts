import { PlanType } from '@/models/plan_type';

export const CoverageTypes = new Map<string, PlanType>([
  ['M', 'Medical'],
  ['D', 'Dental'],
  ['V', 'Vision'],
  ['R', 'Pharmacy'],
  ['S', 'Wellness'],
]);
