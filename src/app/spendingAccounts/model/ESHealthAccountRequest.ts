export interface ESHealthAccountRequest {
  socialSecurityNumber: string;
  groupIdentifier: string;
  groupEmployerIdentificationNumber: string;
  subscriberIdentifier: string;
  planYearName: string;
  maximumTransaction: string;
  bankNameFlag: number;
  accountTypeFlag: number;
  balanceTypeFlag: number;
}
