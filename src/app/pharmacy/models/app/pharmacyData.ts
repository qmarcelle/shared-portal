import { VisibilityRules } from '@/visibilityEngine/rules';

export type PharmacyData = {
  formularyURL: string | null;
  visibilityRules?: VisibilityRules;
};
