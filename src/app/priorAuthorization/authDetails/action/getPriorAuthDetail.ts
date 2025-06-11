'use server';
import { auth } from '@/auth';
import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { esApi } from '@/utils/api/esApi';
import { ALLOWED_PBE_SEARCH_PARAM } from '@/utils/constants';
import { logger } from '@/utils/logger';
import { getDateRange } from '../../actions/memberPriorAuthorization';
import { MemberPriorAuthDetail } from '../../models/priorAuthData';

export async function populatePriorAuthDetails(
  referenceId: string,
): Promise<MemberPriorAuthDetail | null> {
  try {
    const session = await auth();
    const memberList: string[] = [];
    const pbeResponse = await getPersonBusinessEntity(
      ALLOWED_PBE_SEARCH_PARAM.UserName,
      session!.user!.id,
    );
    const selectedPlan = pbeResponse.getPBEDetails[0].relationshipInfo.find(
      (item) => item?.memeCk === session?.user.currUsr?.plan?.memCk,
    );
    memberList.push(session?.user.currUsr?.plan?.memCk ?? '');
    selectedPlan?.relatedPersons.forEach((item) => {
      memberList.push(item.relatedPersonMemeCk.toString());
    });
    const dateRange = await getDateRange(
      process.env.NEXT_PUBLIC_DEFAULT_PRIOR_AUTH_SEARCH_RANGE ?? 'A',
    );
    let priorAuthDetail;
    for (const memberData of memberList) {
      const apiResponse = await esApi.get(
        `/memberPriorAuthDetails?memberKey=${memberData}&fromDate=${dateRange.fromDate}&toDate=${dateRange.toDate}`, // froDate and toDate is dependant on filter integration
      );
      if (
        apiResponse?.data?.data?.memberPriorAuthDetails
          ?.memberPriorAuthDetail != null
      ) {
        priorAuthDetail =
          apiResponse?.data?.data?.memberPriorAuthDetails?.memberPriorAuthDetail.find(
            (item: { referenceId: string }) => item.referenceId === referenceId,
          );
        if (priorAuthDetail != null) return priorAuthDetail;
      }
    }
    return priorAuthDetail ?? null;
  } catch (error) {
    logger.error('Error Response from  memberPriorAuthDetails', error);
    return null;
  }
}
