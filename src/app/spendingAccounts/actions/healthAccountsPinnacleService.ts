'use server';

import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { HealthCareAccount } from '@/models/member/api/loggedInUserInfo';
import { esApi } from '@/utils/api/esApi';
import {
  EXT_ACCT_FSA,
  EXT_ACCT_HRA,
  EXT_ACCT_HSA,
  PINNACLE_ACCOUNT_DCFSA,
  PINNACLE_ACCOUNT_LFSA,
  PINNACLE_ACCOUNT_MFSA,
} from '@/utils/constants';
import { logger } from '@/utils/logger';
import { HealthAccountsPinnacleResponse } from '../model/healthAccountsPinnacleResponse';

export async function getHealthAccountPinnacle(): Promise<HealthAccountsPinnacleResponse> {
  try {
    const session = await auth();
    const memberDetails = await getLoggedInMember(session);
    const formatedEmpCode = padLeftZeros(memberDetails?.groupId, 6);
    const planName = getPlanName(memberDetails?.healthCareAccounts ?? []);
    const response = await esApi.get(
      `/healthAccount/pinnacle?employerCode=${formatedEmpCode}&consumerIdentifier=${memberDetails?.ssn}&planName=${planName}`,
    );
    return response?.data?.data;
  } catch (error) {
    logger.error('Error Response from healthAcccount/pinnacle API', error);
    throw error;
  }
}

function padLeftZeros(str: string, length: number) {
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}

function getPlanName(acctList: HealthCareAccount[]) {
  let planName = '';
  if (acctList !== null && acctList !== undefined) {
    acctList.forEach((acct) => {
      if (planName.length > 0) {
        planName += ',';
      }
      if (acct.accountType === EXT_ACCT_HSA) {
        planName += EXT_ACCT_HSA;
        //accountsEligibility.setExHSAEligible(true);
      } else if (acct.accountType === EXT_ACCT_HRA) {
        planName += EXT_ACCT_HRA;
        //accountsEligibility.setExHRAEligible(true);
      } else if (acct.accountType === EXT_ACCT_FSA) {
        planName += PINNACLE_ACCOUNT_DCFSA;
        planName += ',';
        planName += PINNACLE_ACCOUNT_LFSA;
        planName += ',';
        planName += PINNACLE_ACCOUNT_MFSA;
        //accountsEligibility.setExFSAEligible(true);
      }
    });
  }
  return planName;
}
