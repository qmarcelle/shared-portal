'use server';

import { invokePriorAuthDetails } from '@/app/priorAuthorization/actions/memberPriorAuthorization';
import { PriorAuthDetails } from '@/app/priorAuthorization/models/priorAuthDetails';
import { logger } from '@/utils/logger';
import { DashboardPriorAuthDetails } from '../models/priorAuth_details';

export async function getDashboarPriorAuthData(): Promise<DashboardPriorAuthDetails | null> {
  try {
    const priorAuthresponse = await invokePriorAuthDetails();
    if (priorAuthresponse.length > 0)
      return computePriorAuthDetail(priorAuthresponse[0]);
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
    priorAuthType: 'Medical',
    dateOfVisit: priorAuthDetails.serviceDate,
    priorAuthStatus: priorAuthDetails.priorAuthStatus,
    member: priorAuthDetails.memberName,
    referenceId: priorAuthDetails.referenceId ?? '',
  };
}
