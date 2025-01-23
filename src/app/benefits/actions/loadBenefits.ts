'use server';
import { ActionResponse } from '@/models/app/actionResponse';
import { Member } from '@/models/member/api/loggedInUserInfo';
import { logger } from '@/utils/logger';
import { MemberBenefitsBean } from '../models/member_benefits_bean';
import callBenefitService from './callBenefitService';

export interface PlanDetailsInfo {
  productCategory: string;
  planID: string;
}

export default async function loadBenefits(
  member: Member,
): Promise<ActionResponse<number, MemberBenefitsBean>> {
  if (!member) {
    return { status: 400, data: { memberCk: 0 } };
  }

  // Call the API to get benefits data based on member and benefitType

  logger.info(`Loading benefits data for member: ${member.memberCk}`);
  logger.info(
    `List of plans to query: ${member.planDetails.flatMap((item) => item.planID)}`,
  );
  try {
    const benefitsInfo = await callBenefitService(
      member.memberCk,
      member.planDetails,
    );

    // Cache the benefits data on the server
    return { status: 200, data: benefitsInfo };
  } catch (error) {
    logger.error(`Error fetching benefits data: ${error}`);
    return { status: 400, data: { memberCk: 0 } };
  }
}
