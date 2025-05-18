import { NextRequest, NextResponse } from 'next/server';
import getImpersonationRequest from './impersonationToken';

export async function GET(request: NextRequest) {
  const user = request.nextUrl.searchParams.get('user');
  const admin = request.nextUrl.searchParams.get('admin');
  if (!user) {
    return new NextResponse('Must specify user', { status: 400 });
  }
  if (!admin) {
    return new NextResponse('Must specify admin', { status: 400 });
  }

  return await getImpersonationRequest(user, admin, request);
}
