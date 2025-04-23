import { NextResponse } from 'next/server';

// Mock database for testing
const mockGlobalDB = {
  '123456789': '127600', // Our test user ID
  '987654321': '127600',
  '456789123': '127601',
};

export async function GET() {
  return NextResponse.json(mockGlobalDB);
}
