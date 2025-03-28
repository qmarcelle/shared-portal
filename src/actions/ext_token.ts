'use server';

import { auth } from '@/auth';
import { DXAuthToken } from '@/models/auth/dx_auth_token';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { UNIXTimeSeconds } from '../utils/date_formatter';
import { encrypt } from '../utils/encryption';

export async function setExternalSessionToken() {
  console.log('Setting external token');

  const session = await auth();
  const user = session?.user;

  if (!user) {
    console.error('Tried to set external session token but user is undefined!');
    return;
  }
  const expirySec = parseInt(process.env.JWT_SESSION_EXPIRY_SECONDS || '1800');
  const now = UNIXTimeSeconds();
  const tokenObj: DXAuthToken = {
    user: user.id,
    time: now,
    memberCk: user.currUsr.plan?.memCk,
    subscriberId: user.currUsr.plan?.subId,
    constituent: 'member',
  };
  const token = encrypt(JSON.stringify(tokenObj));
  const extTokenOptions: Partial<ResponseCookie> = {
    domain: '.bcbst.com',
    sameSite: 'none',
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: expirySec,
    expires: new Date((now + expirySec) * 1000),
  };
  cookies().set('MPExternalSession', token, extTokenOptions);
}
