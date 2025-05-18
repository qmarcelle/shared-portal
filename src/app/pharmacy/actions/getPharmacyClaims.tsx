import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import { getCurrentDate, getDateTwoYearsAgo } from '@/utils/api/date';
import { esApi } from '@/utils/api/esApi';
import { formatDateString } from '@/utils/date_formatter';
import { logger } from '@/utils/logger';
import { SearchPharmacyClaimsMockResp } from '../mock/searchPharmacyClaimsMockResp';
import {
  PharmacyClaimsRequest,
  SearchPharmacyClaimsResponse,
} from '../models/pharmacy_claim';

export async function getPharmacyClaims(
  pharmacyClaimsReq?: PharmacyClaimsRequest,
): Promise<ActionResponse<number, SearchPharmacyClaimsResponse>> {
  try {
    const session = await auth();
    const loggedInMemberInfoReq: LoggedInUserInfo = await getLoggedInUserInfo(
      session!.user.currUsr!.plan!.memCk,
    );
    const request = {
      subscriberId: loggedInMemberInfoReq.subscriberID,
      patientFirstName: loggedInMemberInfoReq.subscriberFirstName,
      patientLastName: loggedInMemberInfoReq.subscriberLastName,
      patientDateOfBirth: formatDateString(
        loggedInMemberInfoReq.subscriberDateOfBirth,
        'mm/dd/yyyy',
        'yyyy-mm-dd',
      ),
      claimsStartDate: pharmacyClaimsReq?.startDate ?? getDateTwoYearsAgo(),
      claimsEndDate: pharmacyClaimsReq?.endDate ?? getCurrentDate(),
      memberSuffix: loggedInMemberInfoReq.members[0].memberSuffix
        .toString()
        .padStart(2, '0'),
      gender: loggedInMemberInfoReq.members[0].gender,
    };
    logger.info('Calling PharmacyClaims API - Request is :: ', request);
    const resp = await esApi.post('/searchPharmacyClaims', request);
    logger.info(`Response from PharmacyClaims API : ${resp}`);

    const pharmacyResp = resp?.data?.data?.pharmacyClaims?.pharmacyClaim || [];

    let claims = pharmacyResp ?? [];

    if (!Array.isArray(claims)) {
      // Extract claims array from the response
      claims = [claims];
    }

    return {
      status: 200,
      data: claims,
    };
  } catch (err) {
    logger.error('searchPharmacyClaims API Failed', err);
    return {
      status: 400,
      data: SearchPharmacyClaimsMockResp,
    };
  }
}
