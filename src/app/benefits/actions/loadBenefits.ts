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

const serverCache = new Map<number, MemberBenefitsBean>();

export default async function loadBenefits(
  member: Member,
): Promise<ActionResponse<number, MemberBenefitsBean>> {
  if (!member) {
    return { status: 400, data: { memberCk: 0 } };
  }

  // Check server cache first
  if (serverCache.has(member.memberCk)) {
    logger.info(
      `Returning cached benefits data from server for member: ${member.memberCk}`,
    );
    return { status: 200, data: serverCache.get(member.memberCk) };
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
    serverCache.set(member.memberCk, benefitsInfo);
    return { status: 200, data: benefitsInfo };
  } catch (error) {
    logger.error(`Error fetching benefits data: ${error}`);
    return { status: 400, data: { memberCk: 0 } };
  }
}

// function mapResponseToBenefitsDetailsBean(data: any): BenefitDetailsBean {
//   // Implement the mapping logic here
//   logger.info('Mapping response to MyBenefitsDetailsBean');
//   logger.info(data);
//   return {
//     // ...map the data to MyBenefitsDetailsBean properties
//     planId: '',
//     productType: '',
//     productPrefix: '',
//     planType: '',
//     planStartDate: '',
//     planEffectiveDate: '',
//     planTermDate: '',
//     eligibilityStatus: '',
//     coverageLevelCode: '',
//     coverageLevelDescription: '',
//     subscriberOnly: false,
//     planDetailAvailable: false,
//     carveOutInfo: [],
//     rateSchedule: [],
//     networkTiers: [],
//     serviceCategories: [],
//     coveredServices: [],
//   };
// }
