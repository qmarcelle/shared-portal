import { NextResponse } from 'next/server';

// Mock database for testing
const mockBotDB = [
  '123456789_SupportBot',
  '987654321_SalesBot',
  '456789123_ServiceBot',
];

export async function GET() {
  return NextResponse.json(mockBotDB);
}
