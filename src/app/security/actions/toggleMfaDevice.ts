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
  try {
    const req: PutMfaToggleRequest = {
      userId: await getServerSideUserId(),
      mfaEnabled: mfaState ? 'true' : 'false',
    };
    console.log(req);
    const resp = await esApi.put<ESResponse<PutMfaToggle>>(
      '/mfAuthentication/mfaEnableDisable',
      req,
    );
    console.log(resp.data);
    return resp.data;
  } catch (err) {
    logger.error('Error in Toggle Mfa', err);
    if (err instanceof AxiosError) {
      console.log(err.response?.data);
      logger.error('Axios Error occurred');
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
