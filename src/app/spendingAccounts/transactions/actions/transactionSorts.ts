import { compareStatusLabels } from '@/components/foundation/StatusLabel';
import type { TransactionDetails } from '@/models/transaction_details';

export function sortByStatus(a: TransactionDetails, b: TransactionDetails) {
  return compareStatusLabels(a.transactionStatus, b.transactionStatus);
}

export function sortByDateHighToLow(
  a: TransactionDetails,
  b: TransactionDetails,
) {
  return new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime();
}
export function sortByDateLowToHigh(
  a: TransactionDetails,
  b: TransactionDetails,
) {
  return new Date(a.serviceDate).getTime() - new Date(b.serviceDate).getTime();
}
export function sortByTransactionTotalHighToLow(
  a: TransactionDetails,
  b: TransactionDetails,
) {
  return a.transactionTotal - b.transactionTotal;
}
export function sortByTransactionTotalLowToHigh(
  a: TransactionDetails,
  b: TransactionDetails,
) {
  return b.transactionTotal - a.transactionTotal;
}
