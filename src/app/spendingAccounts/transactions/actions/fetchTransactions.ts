'use server';
import { auth } from '@/auth';
import { TransactionDetails } from '@/models/transaction_details';
import { formatDateToLocale } from '@/utils/date_formatter';
import { logger } from '@/utils/logger';
import { mapAccountInfo } from '../../actions/mapAccountInfo';
import { bankConfig } from '../../config/config';

export const fetchTransactions = async (
  accountType: string,
  fromDate: Date,
  toDate: Date,
): Promise<TransactionDetails[]> => {
  const session = await auth();
  const bankName = mapAccountInfo(session!.user!.vRules!).bankName;
  const config = bankConfig[bankName]?.[accountType];
  if (!config) {
    logger.error(
      `No configuration found for user bank: ${bankName} and account type: ${accountType}`,
    );
    return [];
  }
  const data = await config.fetchData(
    formatDateToLocale(fromDate),
    formatDateToLocale(toDate),
  );
  return config.mapToTransactionDetails(data);
};
