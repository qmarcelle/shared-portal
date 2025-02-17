export interface PolicyInfoDetail {
  memberCk: string;
  subscriberName: string;
  groupName: string;
  memberId: string;
  activePlanTypes: string[];
}
export interface PolicyInfo {
  policyInfo: PolicyInfoDetail[];
}
