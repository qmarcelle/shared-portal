'use server';

import { ESResponse } from '@/models/enterprise/esResponse';
import {
  MemberNetworkIdResponse,
  MemberNetworkSetting,
} from '@/models/enterprise/memberNetworkIdResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';

export async function getMemberNetworkId(
  networkPrefix: string,
): Promise<MemberNetworkSetting[]> {
  try {
    const resp = await esApi.get<ESResponse<MemberNetworkIdResponse>>(
      '/memberInfo/memberNetworkId',
      {
        params: {
          memberNetwork: networkPrefix,
        },
      },
    );

    return resp.data.data!.settings;
  } catch (err) {
    logger.error('Member Network Api Error', err);
    throw err;
  }
}
