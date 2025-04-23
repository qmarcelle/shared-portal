import { NextResponse } from 'next/server';

export async function GET() {
  // In a real implementation, this would fetch from the member's preferences
  return NextResponse.json({
    preferredLanguage: 'en',
    notificationPreferences: {
      email: true,
      sms: false,
    },
  });
}
