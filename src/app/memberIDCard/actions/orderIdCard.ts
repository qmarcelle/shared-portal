'use server';

import { getMemberDetails } from '@/actions/memberDetails';
import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';
import { OrderIdCardResponse } from '../model/api/order_id_card';

export async function orderIdCard(
  noOfCards: number,
): Promise<OrderIdCardResponse> {
  try {
    const memberDetails = await getMemberDetails();

    const effectiveIdCardDate = new Date().toLocaleDateString();

    if (memberDetails.memberRelation == 'M') {
      const response = await portalSvcsApi.post(
        `/IDCardService/Order?subscriberCk=${memberDetails.subscriber_ck}&groupId=${memberDetails.groupID}&effectiveDate=${effectiveIdCardDate}&numOfCards=${noOfCards}`,
      );
      return response.data;
    } else {
      const response = await portalSvcsApi.post(
        `/IDCardService/Order?memberCk=${memberDetails.member_ck}&groupId=${memberDetails.groupID}&effectiveDate=${effectiveIdCardDate}&numOfCards=${noOfCards}`,
      );
      return response.data;
    }
  } catch (error) {
    logger.error('Order Id Card API Failure', error);
    throw error;
  }
}
