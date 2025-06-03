'use server';

import { signIn } from '@/auth';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { setSTAndInteractionDataCookies } from '@/utils/ping_cookies';
import { AccountDeactivationRequest } from '../models/api/account_deactivation_request';

export async function callAccountDeactivation(
  request: AccountDeactivationRequest,
): Promise<string> {
  let authUser: string | null = null;

  try {
    const resp = await esApi.get(
      `/accountCredentials/accountDisable?primaryUserName=${request.primaryUserName}&umpiId=${request.umpiId}`,
    );
    if (resp?.data?.data?.status === 'OK') {
      authUser = request.userName;
      await setSTAndInteractionDataCookies({
        ...request.interactionData,
      });
      return resp?.data?.data?.status;
    } else {
      return '';
    }
  } catch (error) {
    logger.error(
      'account Deactivation Failure API - Failure',
      error,
      request.primaryUserName,
    );
    throw error;
  } finally {
    if (authUser) {
      //signIn calls redirect() so it must be done in the finally block.
      await signIn('credentials', {
        userId: authUser,
        impersonator: null,
        redirect: false,
      });
    }
  }
}
