import { getAuthToken } from '@/utils/api/getToken';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Generate a correlation ID for tracing this request through logs
  const correlationId =
    request.headers.get('x-correlation-id') || Date.now().toString();

  logger.info('[API:chat/token] Token request received', {
    correlationId,
    timestamp: new Date().toISOString(),
  });

  try {
    const token = await getAuthToken();

    if (!token) {
      logger.error('[API:chat/token] Failed to retrieve token', {
        correlationId,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { error: 'Failed to retrieve authentication token' },
        { status: 401 },
      );
    }

    logger.info('[API:chat/token] Token retrieved successfully', {
      correlationId,
      hasToken: !!token,
      tokenLength: token?.length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ token });
  } catch (error) {
    logger.error('[API:chat/token] Error retrieving token', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: 'Failed to retrieve authentication token' },
      { status: 500 },
    );
  }
}
