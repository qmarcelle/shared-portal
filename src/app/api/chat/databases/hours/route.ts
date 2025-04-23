import { NextResponse } from 'next/server';

// Mock database for testing
// Format: "day": "start-end" (24-hour format)
const mockHoursDB = {
  '0': '9-17', // Sunday
  '1': '9-17', // Monday
  '2': '9-17', // Tuesday
  '3': '9-17', // Wednesday
  '4': '9-17', // Thursday
  '5': '9-17', // Friday
  '6': '9-17', // Saturday
};

export async function GET() {
  return NextResponse.json(mockHoursDB);
}
