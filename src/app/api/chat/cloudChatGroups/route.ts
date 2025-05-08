'use server';

import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route handler for /api/chat/cloudChatGroups endpoint
 *
 * This proxies and centralizes calls to the member service chat/cloudChatGroups endpoint
 * and ensures all member service API calls are made server-side only.
 *
 * Core API: GET /members/chat/cloudChatGroups
 *
 * @returns List of group IDs that are eligible for cloud chat
 */
export async function GET(request: NextRequest) {
  // Generate a correlation ID for tracing this request through logs
  const correlationId =
    request.headers.get('x-correlation-id') || Date.now().toString();

  logger.info('[API:chat/cloudChatGroups] Incoming request', {
    correlationId,
  });

  try {
    const endpoint = `/api/member/v1/members/chat/cloudChatGroups`;
    
    logger.info('[API:chat/cloudChatGroups] Calling memberService', {
      correlationId,
      endpoint,
    });

    const response = await memberService.get(endpoint, {
      headers: {
        'x-correlation-id': correlationId,
      }
    });

    logger.info('[API:chat/cloudChatGroups] Response received from memberService', {
      correlationId,
      status: response.status,
      groupCount: Array.isArray(response.data) ? response.data.length : 0,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    logger.error('[API:chat/cloudChatGroups] Error calling memberService', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : 'No response',
    });

    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || 'Failed to fetch cloud chat groups';

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
