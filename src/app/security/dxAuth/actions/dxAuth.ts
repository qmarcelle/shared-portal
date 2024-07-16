'use server';

import { signIn } from '@/auth';
import { DXAuthToken } from '@/models/auth/dx_auth_token';
import { createDecipheriv } from 'crypto';
import { redirect } from 'next/navigation';

const DX_AUTH_EXPIRY_SEC = 600; //TODO This value is set high for dev testing. It should be set to 10 seconds or less in prod.

export const dxAuth = async (token): Promise<void> => {
  console.log(`DX AUTH ${token}`);
  let authUser = '';
  try {
    if (!token) {
      throw 'Bad request!';
    }

    const utf8Token = Buffer.from(token, 'base64').toString();
    const [userData, iv] = utf8Token.split(';');

    if (!userData || !iv) {
      throw 'Invalid token!';
    }

    console.log(`[DEBUG] enc=${userData} iv=${iv}`);
    let sessionJson = decrypt(userData, process.env.DX_AUTH_SECRET, iv);

    console.log(`[DEBUG] session=${sessionJson}`);

    const session: DXAuthToken = JSON.parse(sessionJson);

    const currentTimeSec = Math.floor(new Date().getTime() / 1000);
    if (session.time + DX_AUTH_EXPIRY_SEC <= currentTimeSec) {
      throw 'Token is expired!';
    }
    console.log(`Authenticating HCL Portal Session: ${session.user}`);

    authUser = session.user;
  } catch (err) {
    console.log(`Error authenticating DX session`);
    console.log(err);
  } finally {
    //signIn invokes a redirect. Calling redirect() within a try/catch results in an infinite loop due to the way it works internally, so this must be done in the finally block
    if (authUser) {
      await signIn('credentials', {
        userId: authUser,
      });
    } else {
      redirect('/login');
    }
  }
};

const decrypt = (encrypted, key, iv) => {
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  return decipher.update(encrypted, 'base64', 'utf8') + decipher.final('utf8');
};
