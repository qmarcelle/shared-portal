import { getMemberDetails } from '@/actions/memberDetails';

import { logger } from '@/utils/logger';
import { AccessCodeType } from '../models/access_code_details';
import { AccessCodeResourcesDetails } from '../models/access_code_resources';

export async function getAccessCodeDetails(): Promise<string> {
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
    const memberDetails = await getMemberDetails();
    const accessCodeList = memberDetails.isAmplifyMem
      ? ampAccessCodeList
      : btnAccessCodeList;

    return accessCodeEvaluation(memberDetails.cmCondtion, accessCodeList);
  } catch (error) {
    logger.error('CareTN Access Code error ', error);
    return '';
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
