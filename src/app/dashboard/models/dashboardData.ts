import { VisibilityRules } from '@/visibilityEngine/rules';

export type DashboardData = {
  memberDetails: DashboardMemberDetails | null;
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
