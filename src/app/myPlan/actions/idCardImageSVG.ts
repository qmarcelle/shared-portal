'use server';

import { getMemberDetails } from '@/actions/memberDetails';
import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';

export async function invokeIDCardData(
  svgCardType: string,
  imageExtension: string,
): Promise<string> {
  try {
    let idCardImageResponse;
    const memberDetails = await getMemberDetails();

    const effectiveIdCardDate = memberDetails.futureEffective
      ? memberDetails.effectiveStartDate
      : new Date().toLocaleDateString();

    if (memberDetails.memberRelation == 'M') {
      idCardImageResponse = await portalSvcsApi.get(
        `/IDCardService/Image?subscriberCk=${memberDetails.subscriber_ck}&cardType=${svgCardType}&groupId=${memberDetails.groupID}&effectiveDate=${effectiveIdCardDate}&fileExtension=${imageExtension}`,
      );
    } else {
      idCardImageResponse = await portalSvcsApi.get(
        `/IDCardService/Image?memberCk=${memberDetails.member_ck}&cardType=${svgCardType}&groupId=${memberDetails.groupID}&effectiveDate=${effectiveIdCardDate}&fileExtension=${imageExtension}`,
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
