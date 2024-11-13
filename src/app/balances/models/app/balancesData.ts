export type BalanceData = {
  medical: ProductBalance | undefined;
  dental: ProductBalance | undefined;
};

export type ProductBalance = {
  balances: BalancePerUser[];
  serviceLimitDetails: ServiceLimitDetailInfo[];
};

export type BalancePerUser = {
  id: string;
  name: string;
  inNetOOPMax?: number;
  inNetOOPMet?: number;
  inNetDedMax?: number;
  inNetDedMet?: number;
  outOfNetOOPMax?: number;
  outOfNetOOPMet?: number;
  outOfNetDedMax?: number;
  outOfNetDedMet?: number;
  serviceLimits: ServiceLimit[];
};

type ServiceLimit = {
  accumCode: number;
  value: number;
};

export type ServiceLimitDetailInfo = {
  code: number;
  desc: string;
  isDollar: boolean;
  isDays: boolean;
  maxValue: number | undefined;
};
