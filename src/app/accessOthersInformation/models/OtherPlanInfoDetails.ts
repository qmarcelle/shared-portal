import { PlanDetails } from '@/models/plan_details';
import { UserProfile } from '@/models/user_profile';
import { VisibilityRules } from '@/visibilityEngine/rules';

export type OtherPlansData = {
  memberDetails?: OtherMemberDetails | null;
  profiles?: UserProfile[];
  visibilityRules?: VisibilityRules;
  loggedInMemberRole?: string | null;
};

export interface OtherMemberDetails {
  firstName?: string;
  lastName?: string;
  planName?: string;
  DOB?: string;
  coverageType?: string[];
  subscriberId?: string;
  groupId?: string;
  plans?: PlanDetails[];
  memberData?: OtherPlanDetails[] | null;
  selectedPlan?: PlanDetails;
}

export interface OtherPlanDetails {
  memberName: string;
  DOB: string;
  memberCk: string;
  roleType: string;
}
