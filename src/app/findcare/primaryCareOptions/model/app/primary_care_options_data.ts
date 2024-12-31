import { VisibilityRules } from '@/visibilityEngine/rules';
import { PrimaryCareProviderDetails } from '../api/primary_care_provider';

export type PrimaryCareOptionsData = {
  primaryCareProvider: PrimaryCareProviderDetails | null;
  visibilityRules?: VisibilityRules;
};
