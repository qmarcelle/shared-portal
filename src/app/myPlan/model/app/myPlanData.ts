import { VisibilityRules } from '@/visibilityEngine/rules';

export type MyPlanData = {
  idCardSvgFrontData: string | null;
  planType: string | null;
  visibilityRules?: VisibilityRules;
};
