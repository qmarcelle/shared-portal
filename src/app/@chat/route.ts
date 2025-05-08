import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  
  // If no session, don't render chat
  if (!session) {
    return new NextResponse(null, { status: 401 });
  }

  // Verify required session data is present
  if (!session.user?.currUsr?.plan?.memCk || !session.user?.currUsr?.plan?.grpId) {
    return new NextResponse(null, { status: 403 });
  }

  return NextResponse.json({
    memCk: session?.user.currUsr.plan.memCk,
    grpId: session?.user.currUsr.plan.grpId,
  });
}