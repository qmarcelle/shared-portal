'use server';

import { invokePriorAuthDetails } from '@/app/priorAuthorization/actions/memberPriorAuthorization';
import { PriorAuthDetails } from '@/app/priorAuthorization/models/priorAuthDetails';
import { PriorAuthType } from '@/app/priorAuthorization/models/priorAuthType';
import { logger } from '@/utils/logger';
import { DashboardPriorAuthDetails } from '../models/priorAuth_details';

export async function getDashboardPriorAuthData(): Promise<DashboardPriorAuthDetails | null> {
  try {
    const priorAuthResponse = await invokePriorAuthDetails();
    if (priorAuthResponse.length > 0)
      return computePriorAuthDetail(priorAuthResponse[0]);
    return null;
  } catch (error) {
    logger.error('Error in Prior Authorization Service - Dashboar{} ', error);
    return null;
  }
}

function computePriorAuthDetail(
  priorAuthDetails: PriorAuthDetails,
): DashboardPriorAuthDetails {
  return {
    priorAuthName: priorAuthDetails.issuer,
    priorAuthType: PriorAuthType.MEDICAL,
    dateOfVisit: priorAuthDetails.serviceDate,
    priorAuthStatus: priorAuthDetails.priorAuthStatus,
    member: priorAuthDetails.memberName,
    referenceId: priorAuthDetails.referenceId ?? '',
  };
}
