import { UserRole } from '@/userManagement/models/sessionUser';
import { VisibilityRules } from '@/visibilityEngine/rules';

export type DashboardData = {
  memberDetails: DashboardMemberDetails | null;
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
