import { PrimaryCareProviderDetails } from '@/app/findcare/primaryCareOptions/model/api/primary_care_provider';
import { UserRole } from '@/userManagement/models/sessionUser';
import { VisibilityRules } from '@/visibilityEngine/rules';

export type DashboardData = {
  memberDetails: DashboardMemberDetails | null;
  primaryCareProvider: PrimaryCareProviderDetails | null;
  role?: UserRole;
  visibilityRules?: VisibilityRules;
};

export interface DashboardMemberDetails {
  firstName: string;
  lastName: string;
  planName: string;
  coverageType: string[];
  subscriberId: string;
  groupId: string;
}
