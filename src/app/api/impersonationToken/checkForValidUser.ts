import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { memberService } from '@/utils/api/memberService';
import { ALLOWED_PBE_SEARCH_PARAM } from '@/utils/constants';
import { logger } from '@/utils/logger';

export const checkForValidUser = async (userId: string) => {
  try {
    const pbe = await getPersonBusinessEntity(
      ALLOWED_PBE_SEARCH_PARAM.UserName,
      userId,
    );
    if (!pbe.getPBEDetails) {
      logger.error('No PBE details found for user:', userId);
      throw new Error('No PBE details found');
    }
    const memberCks = pbe.getPBEDetails
      .map((detail) => detail.relationshipInfo)
      .flat()
      .map((rel) => rel.memeCk);
    if (memberCks.length === 0) {
      throw new Error(`No member Ck found for user: ${userId}`);
    }
    for (const memberCk of memberCks) {
      const response = await memberService.get(
        `api/member/v1/members/byMemberCk/${memberCk}/personalInfo`,
      );
      if (response.data.memberData.groupId === '109844') {
        logger.warn(`User ID ${userId} contains G44 Data`);
        throw new Error('This user cannot be impersonated');
      }
    }
    return true;
  } catch (error) {
    console.error(
      'Error fetching identity information from memberServices:',
      error,
    );
    throw error;
  }
};
