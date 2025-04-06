import {
  Address,
  AuthFunction,
  CoverageType,
  GroupData,
  PlanDetail,
} from '../member/api/loggedInUserInfo';

export interface LoggedInMember {
  subscriberLoggedIn: boolean;
  subscriberId: string;
  subscriberCk: string;
  suffix: number;
  memRelation: string;
  planDetails: PlanDetail[] | undefined;
  futureEffective: boolean;
  effectiveStartDate: string;
  firstName: string;
  middleIntital: string;
  lastName: string;
  noOfDependents: number;
  contact: Address;
  homeAddress: Address;
  memeCk: number;
  gender: string;
  lob: string;
  networkPrefix: string;
  groupDetails: GroupData;
  authFunctions: AuthFunction[] | undefined;
  groupId: string;
  ssn: string;
  groupEIN: string;
  coverageTypes: CoverageType[];
  groupName: string;
  userId: string;
  mpdpdId?: string;
  dpdpdId?: string;
  vpdpdId?: string;
  spdpdId?: string;
  isMedical: boolean;
  isDental: boolean;
  isVision: boolean;
  dateOfBirth: string;
  isAmplifyMem?: boolean;
  cmCondition: string;
  groupKey: string;
  lineOfBusiness: string;
}
