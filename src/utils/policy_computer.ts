import { PolicyInfo } from '@/models/policy_info_details';
import { CoverageTypes } from '@/userManagement/models/coverageType';

export const computePolicyName = (policyTypes: string[]): string => {
  const policies = policyTypes
    .map((policy) => CoverageTypes.get(policy))
    .join(', ');
  return policies;
};

export const transformPolicyToPlans = (policyInfo: PolicyInfo) => {
  return policyInfo.policyInfo.map((item) => ({
    id: item.memberId,
    planName: item.groupName,
    policies: computePolicyName(item.activePlanTypes),
    subscriberName: item.subscriberName,
    memeCk: item.memberCk,
  }));
};
