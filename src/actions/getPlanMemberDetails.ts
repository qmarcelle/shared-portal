'use server';

import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import {
  AccessStatus,
  ShareMyPlanDetails,
  SharePlanInformationDetails,
} from '@/models/app/getSharePlanDetails';
import { PBEData, RelationshipInfo } from '@/models/member/api/pbeData';
import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { calculateAge } from '@/utils/api/date';
import { formatDateToLocale } from '@/utils/date_formatter';
import { logger } from '@/utils/logger';

export const getPlanInformationData = async (): Promise<
  ActionResponse<number, SharePlanInformationDetails>
> => {
  try {
    const session = await auth();
    const pbeResponse = await getPersonBusinessEntity(session!.user!.id);
    logger.info('Success Response from PBE API', pbeResponse);
    const selectedPlan = pbeResponse.getPBEDetails[0].relationshipInfo.find(
      (item) => item.memeCk === session?.user.currUsr?.plan?.memCk,
    );
    return {
      status: 200,
      data: {
        memberData: computeMemberDetails(pbeResponse, selectedPlan),
        loggedInMemberRole: selectedPlan?.personRoleType,
      },
    };
  } catch (error) {
    logger.error('Error in getAccessOtherInformationData {}', error);
    return {
      status: 400,
      data: {
        memberData: null,
        loggedInMemberRole: null,
      },
    };
  }
};

const computeMemberDetails = (
  pbeResponse: PBEData,
  selectedPlan: RelationshipInfo | undefined,
): ShareMyPlanDetails[] => {
  const memberDetails: ShareMyPlanDetails[] = [];

  selectedPlan?.relatedPersons
    ?.filter((item) => item.relatedPersonRoleType != 'PR')
    .map((item) => {
      const age = calculateAge(new Date(item.relatedPersonDob));
      const isMatureMinor = age >= 13 && age <= 17;
      const isMinor = age <= 12;
      memberDetails.push({
        memberName:
          item.relatedPersonFirstName + ' ' + item.relatedPersonLastName,
        DOB: formatDateToLocale(new Date(item.relatedPersonDob)),
        isOnline: true,
        requesteeFHRID: item.relatedPersonPatientFHIRID,
        requesteeUMPID: item.relatedPersonUMPID,
        accessStatus: item.name ? item.name : AccessStatus.NoAccess,
        memberCk: item.relatedPersonMemeCk,
        accessStatusIsPending: false,
        isMatureMinor: isMatureMinor,
        isMinor: isMinor,
        roleType: item.relatedPersonRoleType.toLowerCase(),
      });
    });

  return memberDetails;
};
