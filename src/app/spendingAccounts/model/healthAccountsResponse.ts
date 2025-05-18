export type HealthAccountsResponse = {
  data: HealthAccountsData;
};

export type HealthAccountsData = {
  banks: Bank[];
};

export type Bank = {
  accountStatusMessage: string;
  bankName: string;
  accounts: Account[];
};

export type Account = {
  bankName: string;
  accountName: string;
  accountType: string;
  accountDesc: string;
  bcbstAccountType: string;
  accountBalance: number;
  accountYear: string;
  accountYearName: string;
  accountStatus: string;
  contributions: string;
  contributionAmount: string;
  distributions: string;
  distributionAmount: string;
  investments: string;
  elections: number;
  carryOverBalance: number;
  claimsYearToDate: number | 0;
  yearToDateClaimsAllowed: number | 0;
  yearToDateClaimsDenied: number | 0;
  yearToDateClaimsPaid: number | 0;
  yearToDateClaimsWaitingPayment: number | 0;
  transactions: TransactionList;
};

export type Transaction = {
  transactionDate: string;
  transactionMethod: string;
  transactionDescription: string;
  transactionType: string;
  transactionAmount: number;
  receiptStatus: string;
  claimStatus: string;
  transactions: TransactionList;
};

export type TransactionList = {
  transactionStatusMessage: string;
  transaction: Transaction[];
};
