export type HealthAccountsRequest = {
  socialSecurityNumber: string;
  groupIdentifier: string;
  groupEmployerIdentificationNumber: string;
  subscriberIdentifier: string;
  planYearName: string;
  planYearStartDate: string;
  transactionStartDate: string;
  transactionEndDate: string;
  maximumTransaction: string;
  bankNameFlag: number;
  accountTypeFlag: number;
  balanceTypeFlag: number;
};
