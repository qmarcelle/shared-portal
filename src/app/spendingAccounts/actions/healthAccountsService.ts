'use server';
import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { HealthCareAccount } from '@/models/member/api/loggedInUserInfo';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';

import {
  EXT_ACCT_FSA,
  EXT_ACCT_HRA,
  EXT_ACCT_HSA,
  PINNACLE_ACCOUNT_DCFSA,
  PINNACLE_ACCOUNT_LFSA,
  PINNACLE_ACCOUNT_MFSA,
} from '@/utils/constants';
import { HealthAccountsRequest } from '../model/healthAccountsRequest';
import { HealthAccountsResponse } from '../model/healthAccountsResponse';

export async function getHealthAccount(): Promise<HealthAccountsResponse> {
  try {
    const session = await auth();
    const memberDetails = await getLoggedInMember(session);
    const apiRequest: HealthAccountsRequest = {} as HealthAccountsRequest;

    // this api call needs to be updated appropriately when we being with ES integration
    apiRequest.socialSecurityNumber = memberDetails.ssn;
    apiRequest.groupIdentifier = memberDetails.groupId;
    apiRequest.groupEmployerIdentificationNumber = memberDetails.groupEIN;
    apiRequest.subscriberIdentifier = memberDetails.subscriberId;
    const formatedEmpCode = null;
    const planName = null;
    const response = await esApi.get(
      `/healthAccount?employerCode=${formatedEmpCode}&consumerIdentifier=${memberDetails?.ssn}&planName=${planName}`,
    );
    return response?.data?.data;
  } catch (error) {
    logger.error('Error Response from healthAcccount/pinnacle API', error);
    throw error;
  }
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
