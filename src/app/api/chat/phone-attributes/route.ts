import { NextResponse } from 'next/server';

export async function GET() {
  // In a real implementation, this would fetch from the member's profile
  return NextResponse.json({
    phoneNumber: '+1234567890',
    isVerified: true,
    lastVerified: new Date().toISOString(),
  });
}
