import 'server-only';

import { logger } from '@/utils/logger';
import { ESHealthAccountRequest } from '../../model/ESHealthAccountRequest';
import { getHealthAcctData } from '../getHealthAcctData';

export enum AccountType {
  HSA = 1,
  DCFSA = 2,
  FSA = 3,
}

export const getHEAcctData = async <HealthEquityESResponse>(
  fromDate: string,
  toDate: string,
  accountType: AccountType,
): Promise<HealthEquityESResponse> => {
  try {
    // const session = await auth();
    // const memberData = await getLoggedInMember();

    const request: ESHealthAccountRequest = {
      socialSecurityNumber: '123-45-6789',
      groupIdentifier: 'GROUP123',
      groupEmployerIdentificationNumber: 'EIN987654321',
      subscriberIdentifier: 'SUBSCRIBER456',
      planYearName: new Date(fromDate).getFullYear().toString(),
      maximumTransaction: '10000',
      bankNameFlag: 1,
      accountTypeFlag: accountType,
      balanceTypeFlag: 3,
    };
    return getHealthAcctData<HealthEquityESResponse>(request);
  } catch (error) {
    logger.error('Failed Retrieving HE Data');
    return {} as HealthEquityESResponse;
  }
};
