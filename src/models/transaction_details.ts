import { StatusLabelStatus } from '@/components/foundation/StatusLabel';

export interface TransactionDetails {
  id: string;
  providerName: string;
  serviceDate: string;
  transactionTotal: number;
  transactionStatus: StatusLabelStatus;
  transactionStatusDescription: string;
  transactionId: string;
  disallowedAmount?: number;
  disallowedReason?: string | null;
  disallowedFlag: boolean;
  claimPaidAmt: number;
  formattedClaimPaidAmt: string;
  formattedDisallowedAmount?: string;
  formattedTransactionTotal: string;
  isWithdrawal?: boolean;
}
