'use server';

import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { ESResponse } from '@/models/enterprise/esResponse';
import {
  PBEData,
  RelatedPerson,
  RelationshipInfo,
} from '@/models/member/api/pbeData';
import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { esApi } from '@/utils/api/esApi';
import { formatDateToLocale } from '@/utils/date_formatter';
import { logger } from '@/utils/logger';
import {
  RepresentativeData,
  RepresentativeViewDetails,
} from '../models/representativeDetails';
import { UpdateConsentRequest } from '../models/updateConsentRequest';
import { UpdateConsentResponse } from '../models/updateConsentResponse';

export const getPersonalRepresentativeData = async (): Promise<
  ActionResponse<number, RepresentativeViewDetails>
> => {
  try {
    const session = await auth();
    const pbeResponse = await getPersonBusinessEntity(session!.user!.id);
    const selectedPlan = pbeResponse.getPBEDetails[0].relationshipInfo.find(
      (item) => item?.memeCk === session?.user.currUsr?.plan?.memCk,
    );
    const selectedPR = pbeResponse.getPBEDetails[0].relationshipInfo.filter(
      (item) => item.personRoleType === 'PR',
    );

    return {
      status: 200,
      data: {
        representativeData:
          session?.user.currUsr.role === 'PR'
            ? await computeMemberProfile(pbeResponse, selectedPR)
            : computePRProfile(pbeResponse, selectedPlan),
        visibilityRules: session?.user.vRules,
        isRepresentativeLoggedIn: session?.user.currUsr.role === 'PR',
      },
    };
  } catch (error) {
    logger.info('Error in getPersonalRepresentativeData {}', error);
    return {
      status: 400,
      data: {
        representativeData: null,
        visibilityRules: undefined,
        isRepresentativeLoggedIn: true,
      },
    };
  }
};

const computeMemberProfile = async (
  pbeResponse: PBEData,
  selectedPlan: RelationshipInfo[] | undefined,
): Promise<RepresentativeData[]> => {
  const membersData: Promise<RepresentativeData>[] = [];
  const relatedPersonDetails = selectedPlan?.map((item) => {
    return item.relatedPersons[0];
  });
  relatedPersonDetails?.forEach(async (item) =>
    membersData.push(computeMemberData(item)),
  );
  return await Promise.all(membersData);
};

const computeMemberData = async (item: RelatedPerson) => {
  return {
    memberName: item.relatedPersonFirstName + ' ' + item.relatedPersonLastName,
    DOB: formatDateToLocale(new Date(item.relatedPersonDob)),
    isOnline: await isAccountOnline(item.relatedPersonUMPID),
    fullAccess: item.name === 'Full Access' ? true : false,
    memeck: item.relatedPersonMemeCk,
    requesteeFHRID: item.relatedPersonFHIRID,
    requesteeUMPID: item.relatedPersonUMPID,
    accessStatus: item.name,
    accessStatusIsPending: false,
  };
};

const computePRProfile = (
  pbeResponse: PBEData,
  selectedPlan: RelationshipInfo | undefined,
): RepresentativeData[] => {
  const representativesData: RepresentativeData[] = [];
  const relatedPersonDetails = selectedPlan?.relatedPersons.filter(
    (item) => item.relatedPersonRoleType === 'PR',
  );
  relatedPersonDetails?.map((item) =>
    representativesData.push({
      memberName:
        item.relatedPersonFirstName + ' ' + item.relatedPersonLastName,
      DOB: formatDateToLocale(new Date(item.relatedPersonDob)),
      isOnline: true,
      fullAccess: item.name === 'Full Access' ? true : false,
      id: item.id,
      effectiveOn: item.effectiveOn,
      expiresOn: item.expiresOn,
      policyId: item.policyId,
      firstName: item.relatedPersonFirstName,
      lastName: item.relatedPersonLastName,
    }),
  );
  return representativesData;
};

const isAccountOnline = async (umpiID: string) => {
  const pbeResponse = await getPersonBusinessEntity(umpiID);
  return pbeResponse.getPBEDetails[0].hasAccount;
};

export async function updateConsentDataAction({
  request,
}: {
  request: UpdateConsentRequest;
}): Promise<ESResponse<UpdateConsentResponse> | undefined> {
  try {
    const response = await esApi.post<ESResponse<UpdateConsentResponse>>(
      `/consentOperations/updateConsent?consentId=${request.consentId}`,
      {
        policyId: request.policyId,
        effectiveOn: request.effectiveOn,
        expiresOn: request.expiresOn,
        requestType: 'update',
        firstName: request.firstName,
        lastName: request.lastName,
      },
    );
    return response?.data;
  } catch (error) {
    console.debug(error);
    logger.error('Update Data  - Failure' + error);
    return {
      data: {
        message: 'Failure',
      },
    };
  }
}
