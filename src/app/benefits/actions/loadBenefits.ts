'use server';
import { ActionResponse } from '@/models/app/actionResponse';
import { Member } from '@/models/member/api/loggedInUserInfo';
import { logger } from '@/utils/logger';
import { MemberBenefitsBean } from '../models/member_benefits_bean';
import getStubbedBenefits from './benefitServiceStub';

export interface PlanDetailsInfo {
  productCategory: string;
  planID: string;
}

export default async function loadBenefits(
  member: Member,
  benefitType: string,
): Promise<ActionResponse<number, MemberBenefitsBean>> {
  // Call the API to get benefits data based on member and benefitType

  logger.info(`Loading benefits data for member: ${member.memberCk}`);
  const listOfPlansToQuery: PlanDetailsInfo[] = [];
  logger.info(`Benefit type: ${benefitType}`);
  if (benefitType == 'A') {
    member.planDetails.flatMap((item) => {
      listOfPlansToQuery.push({
        productCategory: item.productCategory,
        planID: item.planID,
      });
    });
  } else {
    const searchBenefitType = benefitType == 'R' ? 'M' : benefitType; //RX info is under Medical
    const planInfo = member.planDetails.find(
      (item) => item.productCategory == searchBenefitType,
    );
    if (planInfo) {
      listOfPlansToQuery.push({
        productCategory: planInfo.productCategory,
        planID: planInfo.planID,
      });
    } else {
      logger.info(
        `No plan found for the given benefit type: ${searchBenefitType}`,
      );
    }
  }

  logger.info(
    `List of plans to query: ${listOfPlansToQuery.flatMap((item) => item.planID)}`,
  );
  const benefitsInfo = await getStubbedBenefits(
    member.memberCk,
    listOfPlansToQuery,
  );
  return { status: 200, data: benefitsInfo };
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
