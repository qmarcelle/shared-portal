import { Plan } from './benefits/plan';
import { MemberAddress } from './member_address';

export interface Member {
  relation: 'subscriber' | 'husband' | 'wife' | 'son' | 'daughter';
  status: 'active' | 'termed' | 'futureEffective' | 'delinquency';
  memberCk: number;
  subscriberCk: number;
  groupCk: number;
  subscriberId: string;
  suffix: number;
  groupId: string;
  parentGroupId: string;
  groupName: string;
  subGroupId: string;
  subGroupName: string;
  clientId: string;
  policyType: string;
  lineOfBusiness: string;
  originalEffectiveDate: Date;
  dateOfBirth: Date;
  firstName: string;
  lastName: string;
  middleInitial: string;
  title: string;
  gender: 'M' | 'F';
  mailingAddressType: string;
  plans: Plan[];
  addresses: MemberAddress[];
  authorization: object;
}
