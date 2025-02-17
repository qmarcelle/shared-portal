import { PolicyInfo } from '@/models/policy_info_details';

export const policyInfoMock = {
  policyInfo: [
    {
      memberCk: '502622001',
      subscriberName: 'REBEKAH WILSON',
      groupName: 'Radio Systems Corporation',
      memberId: '90447969100',
      activePlanTypes: ['M', 'R', 'S'],
    },
    {
      memberCk: '846239401',
      subscriberName: 'JOHNATHAN ANDERL',
      groupName: 'Ruby Tuesday Operations LLC',
      memberId: '90865577900',
      activePlanTypes: ['D', 'R', 'S', 'M', 'V'],
    },
  ],
} as PolicyInfo;
