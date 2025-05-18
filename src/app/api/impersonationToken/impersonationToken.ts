import { DXAuthToken } from '@/models/auth/dx_auth_token';
import { UNIXTimeSeconds } from '@/utils/date_formatter';
import { encrypt } from '@/utils/encryption';
import { NextResponse } from 'next/server';
import { checkForValidUser } from './checkForValidUser';
import { getImpersonationAccess } from './getImpersonationAccess';

const getImpersonationRequest = async (
  userId: string,
  adminId: string,
  req: Request, // Add the Request object as a parameter
): Promise<NextResponse> => {
  try {
    const hasImpersonationAccess = await getImpersonationAccess(adminId);
    if (!hasImpersonationAccess) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return new NextResponse(err.message, { status: 500 });
    } else
      return new NextResponse('An Unexpected Error Occurred', { status: 400 });
  }

  try {
    await checkForValidUser(userId);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return new NextResponse(err.message, { status: 400 });
    } else
      return new NextResponse('An Unexpected Error Occurred', { status: 400 });
  }

  const token: DXAuthToken = {
    user: userId,
    admin: adminId,
    time: UNIXTimeSeconds(),
  };
  const encryptedToken = encrypt(JSON.stringify(token));

  // Retrieve the host from the request headers
  const host = req.headers.get('host');
  const protocol = req.headers.get('x-forwarded-proto') || 'http'; // Handle HTTPS if behind a proxy
  const currentDomain = `${protocol}://${host}`;
  return new NextResponse(
    `${currentDomain}/sso/impersonate?req=${encryptedToken}`,
    { status: 200 },
  );
};

export default getImpersonationRequest;
