import { PrimaryCareProviderDetails } from '@/app/(protected)/(common)/member/findcare/primaryCareOptions/model/api/primary_care_provider';
import { PlanDetails } from '@/models/plan_details';
import { UserProfile } from '@/models/user_profile';
import { UserRole } from '@/userManagement/models/sessionUser';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { BenefitsProviderInfo } from './BenefitsProviderInfo';

export type DashboardData = {
  memberDetails: DashboardMemberDetails | null;
  primaryCareProvider?: PrimaryCareProviderDetails | null;
  role: UserRole | null;
  profiles?: UserProfile[];
  visibilityRules?: VisibilityRules;
  employerProvidedBenefits?: BenefitsProviderInfo[] | null;
};

export interface DashboardMemberDetails {
  firstName: string;
  lastName: string;
  planName?: string;
  coverageType?: string[];
  subscriberId?: string;
  groupId?: string;
  plans?: PlanDetails[];
  selectedPlan?: PlanDetails;
}
