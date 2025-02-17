'use server';

import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';
import { Session } from 'next-auth';

export async function invokeIDCardData(
  svgCardType: string,
  imageExtension: string,
  memberDetailsData?: LoggedInMember | null,
  sessionDetailsData?: Session | null,
): Promise<string> {
  try {
    let idCardImageResponse;
    let session;
    let memberDetails;
    if (!sessionDetailsData && !memberDetailsData) {
      session = await auth();
      memberDetails = await getLoggedInMember(session);
    } else {
      memberDetails = memberDetailsData;
      session = sessionDetailsData;
    }

    const effectiveIdCardDate = memberDetails?.futureEffective
      ? memberDetails.effectiveStartDate
      : new Date().toLocaleDateString();

    if (memberDetails?.memRelation == 'M') {
      idCardImageResponse = await portalSvcsApi.get(
        `/IDCardService/Image?subscriberCk=${session?.user.currUsr?.plan!.sbsbCk}&cardType=${svgCardType}&groupId=${session?.user.currUsr?.plan!.grpId}&effectiveDate=${effectiveIdCardDate}&fileExtension=${imageExtension}`,
      );
    } else {
      idCardImageResponse = await portalSvcsApi.get(
        `/IDCardService/Image?memberCk=${session?.user.currUsr?.plan!.memCk}&cardType=${svgCardType}&groupId=${session?.user.currUsr?.plan!.grpId}&effectiveDate=${effectiveIdCardDate}&fileExtension=${imageExtension}`,
      );
    }

    return idCardImageResponse?.data;
  } catch (error) {
    logger.error(
      'Error Response from  ID Card ' + svgCardType + ' Image API',
      error,
    );
    throw error;
  }
}
