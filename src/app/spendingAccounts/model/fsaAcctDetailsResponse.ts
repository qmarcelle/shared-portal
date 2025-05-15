export interface FsaAcctDetailsList {
  fsaAcctDetails: FsaAcctDetailsInfo[];
}

export interface FsaAcctDetailsInfo {
  accountBalance: number;
  effectiveDate: string;
  employeePledgeAmount: number;
  employerPledgeAmount: number;
  fsaTypeInd: string;
  paidAmountYTD: number;
  planYearStartDate: string;
  subscriberCK: number;
  termDate: string;
}
