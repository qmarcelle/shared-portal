'use server';
import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { MemberBenefitsBean } from '../models/member_benefits_bean';
import { PlanDetailsInfo } from './loadBenefits';

export default async function callBenefitService(
  memberCk: number,
  listOfPlansToQuery: PlanDetailsInfo[],
) {
  const benefitsData: MemberBenefitsBean = { memberCk: memberCk };
  for (const plan of listOfPlansToQuery) {
    const resp = await memberService.get<BenefitDetailsBean>(
      `/api/member/v1/members/byMemberCk/${memberCk}/benefits/planDetails/${plan.productCategory}/${plan.planID}?displayMode=6&indicator=W`,
    );

    if (resp.status !== 200) {
      logger.info(`Error fetching benefits data for planType: ${plan.planID}`);
      continue;
    }

    if (plan.productCategory == 'M') benefitsData.medicalBenefits = resp.data;
    if (plan.productCategory == 'D') benefitsData.dentalBenefits = resp.data;
  }
  logger.info(`Benefits for member: ${memberCk} loaded successfully`);
  logger.info(JSON.stringify(benefitsData));
  return benefitsData;
}
