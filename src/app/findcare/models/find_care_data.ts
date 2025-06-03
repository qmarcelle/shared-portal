import { VisibilityRules } from '@/visibilityEngine/rules';
import { PrimaryCareProviderDetails } from '../primaryCareOptions/model/api/primary_care_provider';

export interface FindCareData {
  primaryCareProvider: PrimaryCareProviderDetails | null;
  visibilityRules?: VisibilityRules;
}
