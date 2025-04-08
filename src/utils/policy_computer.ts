import { PlanDetails } from '@/models/plan_details';
import { PolicyInfo } from '@/models/policy_info_details';
import { CoverageTypes } from '@/userManagement/models/coverageType';

export const computePolicyName = (policyTypes: string[]): string => {
  const policies = policyTypes
    .map((policy) => CoverageTypes.get(policy))
    .join(', ');
  return policies;
};

export const transformPolicyToPlans = (policyInfo: PolicyInfo) => {
  const planDetails: PlanDetails[] = [];
  policyInfo.currentPolicies?.map((item) =>
    planDetails.push({
      id: item.memberId,
      planName: item.groupName,
      policies: computePolicyName(item.planTypes),
      subscriberName: item.subscriberName,
      memeCk: item.memberCk?.toString(),
      termedPlan: false,
    }),
  );
  policyInfo.pastPolicies?.map((item) =>
    planDetails.push({
      id: item.memberId,
      planName: item.groupName,
      policies: computePolicyName(item.planTypes),
      subscriberName: item.subscriberName,
      memeCk: item.memberCk?.toString(),
      termedPlan: true,
      endedOn: item.termDate?.split('-')[2],
    }),
  );
  return planDetails;
};
