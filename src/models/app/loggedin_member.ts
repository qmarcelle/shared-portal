import { Address, PlanDetail } from '../member/api/loggedInUserInfo';

export interface LoggedInMember {
  subscriberId: string;
  suffix: number;
  memRelation: string;
  planDetails: PlanDetail[] | undefined;
  futureEffective: boolean;
  effectiveStartDate: string;
  firstName: string;
  lastName: string;
  noOfDependents: number;
  contact: Address;
  homeAddress: Address;
  dateOfBirth: string;
  groupId: string;
}
