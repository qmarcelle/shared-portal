'use server';

import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';
import { OrderIdCardResponse } from '../model/api/order_id_card';

export async function orderIdCard(
  noOfCards: number,
): Promise<OrderIdCardResponse> {
  try {
    const session = await auth();
    const memberDetails = await getLoggedInMember(session);

    const effectiveIdCardDate = new Date().toLocaleDateString();

    if (memberDetails.memRelation == 'M') {
      const response = await portalSvcsApi.post(
        `/IDCardService/Order?subscriberCk=${session?.user.currUsr?.plan.sbsbCk}&groupId=${session?.user.currUsr?.plan.grpId}&effectiveDate=${effectiveIdCardDate}&numOfCards=${noOfCards}`,
      );
      return response.data;
    } else {
      const response = await portalSvcsApi.post(
        `/IDCardService/Order?memberCk=${session?.user.currUsr?.plan.memCk}&groupId=${session?.user.currUsr?.plan.grpId}&effectiveDate=${effectiveIdCardDate}&numOfCards=${noOfCards}`,
      );
      return response.data;
    }
  } catch (error) {
    logger.error('Order Id Card API Failure', error);
    throw error;
  }
}
