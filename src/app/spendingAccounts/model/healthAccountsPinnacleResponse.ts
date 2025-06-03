export type HealthAccountsPinnacleResponse = {
  data: HealthPlan[];
};

export type HealthPlan = {
  planName: string;
  balanceType: PinnacleBankBalanceType[];
  investmentAccountInformations: InvestmentAccountInformation[];
  transcationInformations: TransactionInformation[];
  planYearName: string;
  planYearStartDate: string;
  accountStatus: string;
  bcbstAccountType: string;
};

export type PinnacleBankBalanceType = {
  type: string;
  balanceAmount: string;
  isNotionalPlan: boolean;
};

export type InvestmentAccountInformation = {
  investmentAccountName: string;
  investmentAccountStatus: string;
  investmentAsOfDate: boolean;
  investmentFairMarketValue: string;
};

export type TransactionInformation = {
  date: string;
  method: string;
  description: string;
  type: string;
  amount: number;
  receiptStatus: string;
  claimsStatus: string;
  status: string;
};
