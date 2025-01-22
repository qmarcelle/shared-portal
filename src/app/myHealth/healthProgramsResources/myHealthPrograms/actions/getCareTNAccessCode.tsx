import { getLoggedInMember } from '@/actions/memberDetails';

import { logger } from '@/utils/logger';
import { AccessCodeType } from '../models/access_code_details';
import { AccessCodeResourcesDetails } from '../models/access_code_resources';
import { auth } from '@/auth';
import { MyHealthProgramsData } from '../models/my_Health_Programs_Data';
import { ActionResponse } from '@/models/app/actionResponse';

export async function getAccessCodeDetails(): Promise<
  ActionResponse<number, MyHealthProgramsData>
> {
  const btnAccessCodeList = [
    AccessCodeType.BtnBlueWell,
    AccessCodeType.BtnBlueChat,
    AccessCodeType.BtnBlueHere,
  ];
  const ampAccessCodeList = [
    AccessCodeType.AmpBlueWell,
    AccessCodeType.AmpBlueChat,
    AccessCodeType.AmpBlueHere,
  ];
  try {
    const session = await auth();
    const memberDetails = await getLoggedInMember();
    const accessCodeList = session?.user.vRules?.isAmplifyMem
      ? ampAccessCodeList
      : btnAccessCodeList;
    return {
      status: 200,
      data: {
        careTNAccessCode: accessCodeEvaluation(
          memberDetails.cmCondition,
          accessCodeList,
        ),
        sessionData: session,
      },
    };
  } catch (error) {
    logger.error('CareTN Access Code error ', error);
    return {
      status: 400,
      data: {
        careTNAccessCode: '',
        sessionData: null,
      },
    };
  }
}

function accessCodeEvaluation(
  cmCondtion: string,
  accessCodeList: AccessCodeType[],
) {
  let accessCodeRendered = '';

  for (let i = 0; i < accessCodeList.length; i++) {
    accessCodeRendered = calculateAccessCode(cmCondtion, accessCodeList[i]);

    if (accessCodeRendered) {
      break;
    }
  }

  return accessCodeRendered;
}

function calculateAccessCode(cmCondtion: string, arg1: AccessCodeType) {
  const accessCodeDetails = AccessCodeResourcesDetails.get(arg1);
  const memberConditions = cmCondtion.split(',');

  const conditions = accessCodeDetails?.get('conditions') ?? '';
  const nonConditions = accessCodeDetails?.get('withoutConditions') ?? '';

  let hasListedCondition = false;
  let hasWithoutCondition = false;

  const numConditionsToCheck = memberConditions.length;

  for (let i = 0; i < numConditionsToCheck; i++) {
    if (conditions != '' && conditions.includes(memberConditions[i])) {
      hasListedCondition = true;
    }
    if (nonConditions != '' && nonConditions.includes(memberConditions[i])) {
      hasWithoutCondition = true;
      break;
    }
  }

  if (
    !hasListedCondition &&
    conditions[0] === 'None' &&
    memberConditions[0] === ''
  )
    hasListedCondition = true;

  return hasListedCondition && !hasWithoutCondition ? arg1 : '';
}
