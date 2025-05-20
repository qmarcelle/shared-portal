import { BalanceData } from '@/app/benefits/balances/models/app/balancesData';
import { PrimaryCareProviderDetails } from '@/app/findcare/primaryCareOptions/model/api/primary_care_provider';
import { ClaimDetails } from '@/models/claim_details';
import { PlanDetails } from '@/models/plan_details';
import { UserProfile } from '@/models/user_profile';
import { UserRole } from '@/userManagement/models/sessionUser';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { BenefitsProviderInfo } from './BenefitsProviderInfo';
import { DashboardPriorAuthDetails } from './priorAuth_details';

export type DashboardData = {
  memberDetails: DashboardMemberDetails | null;
  primaryCareProvider?: PrimaryCareProviderDetails | null;
  role: UserRole | null;
  profiles?: UserProfile[];
  visibilityRules?: VisibilityRules;
  employerProvidedBenefits?: BenefitsProviderInfo[] | null;
  priorAuthDetail?: DashboardPriorAuthDetails | null;
  memberClaims?: ClaimDetails[];
  balanceData?: BalanceData;
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
