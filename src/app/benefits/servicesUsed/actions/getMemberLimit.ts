'use server';

import { memberLimitService } from '@/utils/api/memberLimitService';
import { logger } from '@/utils/logger';
import { MemberLimitResponse } from '../models/api/memberLimitResponse';

export async function getMemberLimit({
  lookUpType = 'byMemberCk',
  memberId,
  productTypes,
}: {
  lookUpType?: 'byMemberCk' | 'bySubscriberCk';
  memberId: string;
  productTypes: string;
}) {
  try {
    logger.info('Calling Member Limit Service');
    const resp = await memberLimitService.get<MemberLimitResponse>(
      `/api/member/v1/members/${lookUpType}/${memberId}/limitInfo/${productTypes}`,
    );
    return resp.data;
  } catch (err) {
    logger.error('Member Limit Api Failed', err);
    throw err;
  }
}
