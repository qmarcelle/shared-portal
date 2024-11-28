import { PrimaryCareProviderDetails } from '@/app/findcare/primaryCareOptions/model/api/primary_care_provider';
import { VisibilityRules } from '@/visibilityEngine/rules';

export interface MyHealthData {
  primaryCareProvider: PrimaryCareProviderDetails | null;
  visibilityRules?: VisibilityRules;
}
