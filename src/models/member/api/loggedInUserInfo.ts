export type LoggedInUserInfo = {
  isActive: boolean;
  subscriberLoggedIn: boolean;
  lob: string;
  groupData: GroupData;
  networkPrefix: string;
  subscriberID: string;
  subscriberCK: string;
  subscriberFirstName: string;
  subscriberLastName: string;
  subscriberTitle: string;
  subscriberDateOfBirth: string;
  subscriberOriginalEffectiveDate: string;
  members: Member[];
  coverageTypes: CoverageType[];
  addresses: Address[];
  authFunctions: AuthFunction[];
  healthCareAccounts: any[];
  esigroupNum: string;
  cmcondition: string[];
};

export type Address = {
  type: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  zipcode: string;
  county: string;
  phone: string;
  email: string;
};

export type AuthFunction = {
  functionName: string;
  available: boolean;
};

export type CoverageType = {
  productType: string;
  coverageLevel: string;
  exchange: boolean;
  indvGroupInd: string;
  pedAdultInd: string;
};

export type GroupData = {
  groupID: string;
  groupCK: string;
  groupName: string;
  parentGroupID: string;
  subGroupID: string;
  subGroupCK: number;
  subGroupName: string;
  clientID: string;
  policyType: string;
  groupEIN: string;
};

export type Member = {
  isActive: boolean;
  memberOrigEffDt: string;
  memberCk: number;
  firstName: string;
  middleInitial: string;
  lastName: string;
  title: string;
  memRelation: string;
  birthDate: string;
  gender: string;
  memberSuffix: number;
  mailAddressType: string;
  workPhone: string;
  otherInsurance: any[];
  coverageTypes: CoverageType[];
  planDetails: PlanDetail[];
  inXPermissions: boolean;
  futureEffective: boolean;
  loggedIn: boolean;
  hasSocial: boolean;
  esipharmacyEligible: boolean;
};

export type PlanDetail = {
  productCategory: string;
  planID: string;
  effectiveDate: number;
  planStartDate: number;
  planClassID: string;
  networkPlanName: string;
};
