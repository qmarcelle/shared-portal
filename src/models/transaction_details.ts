export interface TransactionDetails {
  id: string;
  memberName: string;
  serviceDate: string;
  transactionTotal: string | null;
  transactionStatus: string;
  transactionId: string;
  disallowedAmount?: string | null;
  disallowedReason?: string | null;
  disallowedFlag: boolean;
  transactionInfo: object;
}
