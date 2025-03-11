import { DXAuthToken } from '@/models/auth/dx_auth_token';
import { SessionUser } from '@/userManagement/models/sessionUser';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { UNIXTimeSeconds } from './date_formatter';
import { encrypt } from './encryption';

export async function setExternalSessionToken(user: SessionUser) {
  const expirySec = parseInt(process.env.JWT_SESSION_EXPIRY_SECONDS || '1800');
  const now = UNIXTimeSeconds();
  const tokenObj: DXAuthToken = {
    user: user.id,
    time: now,
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
