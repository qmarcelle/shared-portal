import { PolicyInfo } from '@/models/policy_info_details';

export const policyInfoMock = {
  currentPolicies: [
    {
      memberCk: 54363202,
      subscriberName: 'DOUGLAS CATT',
      groupName: 'TLD Logistics Services Inc',
      memberId: '90196616100',
      planTypes: ['S', 'M'],
      amplifyMember: false,
    },
  ],
  pastPolicies: [
    {
      memberCk: 147235702,
      subscriberName: 'DOUGLAS CATT',
      groupName: 'TLD Logistics Services Inc',
      memberId: '90196616101',
      planTypes: ['S', 'D', 'M'],
      amplifyMember: false,
    },
  ],
} as PolicyInfo;
