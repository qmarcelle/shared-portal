'use server';

import { ActionResponse } from '@/models/app/actionResponse';
import { Member } from '@/models/member/api/loggedInUserInfo';
import { MemberBenefitsBean } from '../models/member_benefits_bean';
import loadBenefits from './loadBenefits';

export const getBenefitsData = async (
  member: Member,
  benefitType: string,
): Promise<ActionResponse<number, MemberBenefitsBean>> => {
  if (!member) {
    return { status: 400, data: { memberCk: 0 } };
  }

  const benefitsDetails = await loadBenefits(member, benefitType);
  try {
    return { status: 200, data: benefitsDetails.data };
  } catch (error) {
    return { status: 400, data: { memberCk: 0 } };
  }
};
