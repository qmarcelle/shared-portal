import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { ESHealthAccountRequest } from '../model/ESHealthAccountRequest';

export const getHealthAcctData = async <T>(
  request: ESHealthAccountRequest,
): Promise<T> => {
  try {
    const response = await esApi.post('/heathAccount', request);
    logger.info(
      'Spending Accounts getFSATransactions () :: ',
      JSON.stringify(response?.data),
    );
    const acctData = response?.data as ESResponse<T>;
    if (acctData?.details?.componentStatus != 'Success') {
      logger.error(
        'Error Response from Spending Accounts - getFSATransactions API',
        acctData,
      );
      throw new Error(acctData.details?.message);
    }
    return acctData.data as T;
  } catch (error) {
    logger.error(
      'Error Response from Spending Accounts - getFSATransactions API',
      error,
    );
    throw error;
  }
};
