'use server';

import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { getServerSideUserId } from '@/utils/server_session';
import { AxiosError } from 'axios';
import { PutMfaToggle } from '../models/put_mfa_toggle';
import { PutMfaToggleRequest } from '../models/put_mfa_toggle_request';

export async function callToggleMfa(
  mfaState: boolean,
): Promise<ESResponse<PutMfaToggle>> {
  let userId: string | null = null;
  try {
    userId = await getServerSideUserId();
    const req: PutMfaToggleRequest = {
      userId: await getServerSideUserId(),
      mfaEnabled: mfaState ? 'true' : 'false',
    };
    const resp = await esApi.put<ESResponse<PutMfaToggle>>(
      '/mfAuthentication/mfaEnableDisable',
      req,
    );
    logger.info('Toggle MFA API - Success', resp, userId);
    return resp.data;
  } catch (err) {
    logger.error('Toggle MFA API - Failure', err, userId);
    if (err instanceof AxiosError) {
      return {
        errorCode: err.response?.status.toString(),
      };
    } else {
      return {
        errorCode: '500',
      };
    }
  }
}
