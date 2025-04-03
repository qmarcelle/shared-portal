'use server';

import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { PBEData, RelationshipInfo } from '@/models/member/api/pbeData';
import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { formatDateToLocale } from '@/utils/date_formatter';
import { logger } from '@/utils/logger';
import {
  RepresentativeData,
  RepresentativeViewDetails,
} from '../models/representativeDetails';

export const getPersonalRepresentativeData = async (): Promise<
  ActionResponse<number, RepresentativeViewDetails>
> => {
  try {
    const session = await auth();
    const pbeResponse = await getPersonBusinessEntity(session!.user!.id);
    const selectedPlan = pbeResponse.getPBEDetails[0].relationshipInfo.find(
      (item) => item.memeCk === session?.user.currUsr?.plan?.memCk,
    );
    return {
      status: 200,
      data: {
        representativeData: computePRProfile(pbeResponse, selectedPlan),
        visibilityRules: session?.user.vRules,
        isRepresentativeLoggedIn: selectedPlan?.personRoleType === 'PR',
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
      fullAccess: false,
    }),
  );
  return representativesData;
};
