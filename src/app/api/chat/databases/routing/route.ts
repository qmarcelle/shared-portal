import { NextResponse } from 'next/server';

// Mock database for testing
const mockRoutingDB = [
  '123456789_support_queue',
  '987654321_sales_queue',
  '456789123_service_queue',
];

export async function GET() {
  return NextResponse.json(mockRoutingDB);
}
