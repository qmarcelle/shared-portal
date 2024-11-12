export type DedAndOOPBalanceResponse = {
  accumulatorsDetails: AccumulatorsDetail[];
};

export type AccumulatorsDetail = {
  productType: string;
  inNetFamilyOOPMax?: number;
  outOfNetFamilyOOPMax?: number;
  inNetFamilyOOPMet?: number;
  outOfNetFamilyOOPMet?: number;
  inNetFamilyDedMax?: number;
  outOfNetFamilyDedMax?: number;
  inNetFamilyDedMet?: number;
  outOfNetFamilyDedMet?: number;
  isOOPCombined?: boolean;
  members: DedAndOOPMember[];
  serviceLimitDetails: ServiceLimitDetail[];
};

export type DedAndOOPMember = {
  memberCK: number;
  inNetOOPMax?: number;
  inNetOOPMet?: number;
  inNetDedMax?: number;
  inNetDedMet?: number;
  outOfNetOOPMax?: number;
  outOfNetOOPMet?: number;
  outOfNetDedMax?: number;
  outOfNetDedMet?: number;
  listofSerLimitMetDetails: ListofSerLimitMetDetail[];
};

export type ListofSerLimitMetDetail = {
  accumNum: number;
  usedVisits?: number;
  metAmount?: number;
};

export type ServiceLimitDetail = {
  accumNum: number;
  serviceDesc: string;
  isDollarLimit: boolean;
  isDays: boolean;
  maxAllowedVisits?: number;
  maxAllowedAmount?: number;
};
