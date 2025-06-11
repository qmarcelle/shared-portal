'use server';

import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import {
  ShareMyPlanDetails,
  ShareOutsideMyPlanDetails,
  SharePlanInformationDetails,
} from '@/models/app/getSharePlanDetails';
import { PBEData, RelationshipInfo } from '@/models/member/api/pbeData';
import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { calculateAge } from '@/utils/api/date';
import { ALLOWED_PBE_SEARCH_PARAM } from '@/utils/constants';
import { formatDateToLocale } from '@/utils/date_formatter';
import { logger } from '@/utils/logger';

export const getShareMyPlanInformation = async (): Promise<
  ActionResponse<number, SharePlanInformationDetails>
> => {
  try {
    const session = await auth();
    const pbeResponse = await getPersonBusinessEntity(
      ALLOWED_PBE_SEARCH_PARAM.UserName,
      session!.user!.id,
    );

    const selectedPlan = pbeResponse.getPBEDetails[0].relationshipInfo.find(
      (item) => item.memeCk === session?.user.currUsr?.plan?.memCk,
    );
    const memberAge = calculateAge(new Date(pbeResponse.getPBEDetails[0].dob));
    const isMatureMinorMember = memberAge >= 13 && memberAge <= 17;
    const personRoleType = selectedPlan?.personRoleType;
    const isMinorMember = memberAge <= 12;
    return {
      status: 200,
      data: {
        memberData: computeMemberDetails(pbeResponse, selectedPlan),
        isMatureMinorMember,
        personRoleType,
        isMinorMember,
        outsideMyPlanData: outsideMyPlanDetails(pbeResponse, selectedPlan),
      },
    };
  } catch (error) {
    logger.info('Error in getAccessOtherInformationData {}', error);
    return {
      status: 400,
      data: {
        memberData: null,
        isMatureMinorMember: false,
        personRoleType: undefined,
        isMinorMember: false,
        outsideMyPlanData: null,
      },
    };
  }
};

const computeMemberDetails = (
  pbeResponse: PBEData,
  selectedPlan: RelationshipInfo | undefined,
): ShareMyPlanDetails[] => {
  const memberDetails: ShareMyPlanDetails[] = [];

  selectedPlan?.relatedPersons.map((item) => {
    const age = calculateAge(new Date(item.relatedPersonDob));
    const isMinor = age >= 13 && age <= 17;
    const isAdult = age >= 18;
    memberDetails.push({
      memberName:
        item.relatedPersonFirstName + ' ' + item.relatedPersonLastName,
      DOB: formatDateToLocale(new Date(item.relatedPersonDob)),
      isOnline: true,
      requesteeFHRID: item.relatedPersonPatientFHIRID,
      requesteeUMPID: item.relatedPersonUMPID,
      accessStatus: item.name,
      memberCk: item.relatedPersonMemeCk,
      accessStatusIsPending: false,
      isMinor: isMinor,
      roleType: item.relatedPersonRoleType.toLowerCase(),
      performer: item.performer,
      requester: item.requester,
      requestees: item.requestees,
      policyBusinessIdentifier: item.policyBusinessIdentifier,
      type: item.type,
      effectiveOn: item.effectiveOn,
      expiresOn: item.expiresOn,
      firstName: item.firstName,
      lastName: item.lastName,
      status: item.status,
      implicit: item.implicit,
      isAdult: isAdult,
      isMatureMinor: isMinor,
    });
  });

  return memberDetails;
};
const outsideMyPlanDetails = (
  pbeResponse: PBEData,
  selectedPlan: RelationshipInfo | undefined,
): ShareOutsideMyPlanDetails[] => {
  const memberDetails: ShareOutsideMyPlanDetails[] = [];
  selectedPlan?.relatedPersons.map((item) => {
    if (item.relatedPersonRoleType !== 'AU') return null;
    const dob = new Date(item.relatedPersonDob);

    memberDetails.push({
      memberName: `${item.relatedPersonFirstName}  ${item.relatedPersonLastName}`,
      DOB: formatDateToLocale(dob),
      accessStatus: item.name ?? 'Full Sharing',
    });
  });

  return memberDetails;
};
