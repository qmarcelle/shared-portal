export type MemberLimitResponse = {
  listofOufOfPocketDetails: ServiceDetail[];
  listofLifeTimeLimitDetails: ServiceDetail[];
  listofServiceLimitDetails: ServiceDetail[];
  isOOPCombined: boolean;
};

type ServiceDetail = {
  serviceDesc: string;
  productId: string;
  memberCK: number;
  accumNum: number;
  policyType: string;
  firstName: string;
  lastName: string;
  exclusionCreditDays: number;
  maxAllowedAmount?: number;
  metAmount?: number;
  familyIndicator?: boolean;
  networkIndicator?: string;
  limitPeriodInd?: string;
  isDollarLimit?: boolean;
  maxAllowedVisits?: number;
  usedVisits?: number;
  days?: boolean;
};
