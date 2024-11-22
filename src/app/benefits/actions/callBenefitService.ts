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
    const url = `/api/member/v1/members/byMemberCk/${memberCk}/benefits/planDetails/${plan.productCategory}/${plan.planID}?displayMode=6&indicator=W`;
    logger.info(`Calling benefits at: ${url}`);
    const resp = await memberService.get<BenefitDetailsBean>(url);

    if (resp.status !== 200) {
      logger.info(`Error fetching benefits data for planType: ${plan.planID}`);
      continue;
    }

    logger.info(
      `Benefits for member: ${memberCk}-${plan.planID} loaded successfully`,
    );

    if (plan.productCategory == 'M') benefitsData.medicalBenefits = resp.data;
    if (plan.productCategory == 'D') benefitsData.dentalBenefits = resp.data;
  }
  logger.info(`Benefits for member: ${memberCk} loaded successfully`);
  return benefitsData;
}
