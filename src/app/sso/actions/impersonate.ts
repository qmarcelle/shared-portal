'use server';

import { signIn } from '@/auth';
import { DXAuthToken } from '@/models/auth/dx_auth_token';
import { UNIXTimeSeconds } from '@/utils/date_formatter';
import { decrypt } from '@/utils/encryption';
import { redirect } from 'next/navigation';

const IMPERSONATION_REQUEST_MAX_AGE = 60; //This is the maximum age since the generation of the request token. It should be quite short as a safeguard against the token being compromised, as there is no idempotency check

export const impersonate = async (token: string | null): Promise<void> => {
  let authSession: DXAuthToken | null = null;
  try {
    if (!token) {
      throw 'Bad request!';
    }
    const impersonationRequest = decrypt(token);
    const session: DXAuthToken = JSON.parse(impersonationRequest);

    if (session.time + IMPERSONATION_REQUEST_MAX_AGE <= UNIXTimeSeconds()) {
      throw 'Impersonation request expired!';
    }
    if (!session.admin) {
      throw 'Admin ID not specified!';
    }

    console.log(`Impersonating user ${session.user}`);
    authSession = session;
  } catch (err) {
    console.log('Failed to start impersonated session');
    console.log(err);
  } finally {
    if (authSession) {
      await signIn('credentials', {
        userId: authSession.user,
        impersonator: authSession.admin,
        redirect: false,
      });
      //The redirect to target resource on success is done client side by react router. Doing it server side broke stuff.
    } else {
      redirect('/error');
    }
  }
};
