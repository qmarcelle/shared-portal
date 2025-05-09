import { NextResponse } from 'next/server';
import { getAuthToken } from '@/utils/api/getToken';

export async function GET() {
  const token = await getAuthToken();
  if (token) {
    return NextResponse.json({ token });
  } else {
    return NextResponse.json({ error: 'Failed to get token' }, { status: 500 });
  }
}
