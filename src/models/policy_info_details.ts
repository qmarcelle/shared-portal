export interface PolicyInfoDetail {
  memberCk: number;
  subscriberName: string;
  groupName: string;
  memberId: string;
  planTypes: string[];
  amplifyMember: boolean;
  termDate?: string;
}
export interface PolicyInfo {
  currentPolicies: PolicyInfoDetail[];
  pastPolicies: PolicyInfoDetail[];
}
