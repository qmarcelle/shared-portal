'use server';

import { signIn } from '@/app/(system)/auth';
import { DXAuthToken } from '@/models/auth/dx_auth_token';
import { UNIXTimeSeconds } from '@/utils/date_formatter';
import { decrypt } from '@/utils/encryption';
import { redirect } from 'next/navigation';

const DX_AUTH_EXPIRY_SEC = 600; //TODO This value is set high for dev testing. It should be set to 10 seconds or less in prod.

export const dxAuth = async (token: string | null): Promise<void> => {
  console.log(`DX AUTH ${token}`);
  let authUser = '';
  try {
    if (!token) {
      throw 'Bad request!';
    }

    const sessionJson = decrypt(token);

    console.log(`[DEBUG] session=${sessionJson}`);

    const session: DXAuthToken = JSON.parse(sessionJson);

    if (session.time + DX_AUTH_EXPIRY_SEC <= UNIXTimeSeconds()) {
      throw 'Token is expired!';
    }
    console.log(`Authenticating HCL Portal Session: ${session.user}`);

    authUser = session.user;
  } catch (err) {
    console.log('Error authenticating DX session');
    console.log(err);
  } finally {
    //signIn invokes a redirect. Calling redirect() within a try/catch results in an infinite loop due to the way it works internally, so this must be done in the finally block
    if (authUser) {
      await signIn('credentials', {
        userId: authUser,
        redirect: false,
      });
    } else {
      redirect('/error');
    }
  }
};
