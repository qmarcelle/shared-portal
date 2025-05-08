'use server';

import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route handler for /api/chat/isChatAvailable endpoint
 *
 * This proxies and centralizes calls to the member service chat/isChatAvailable endpoint
 * and ensures all member service API calls are made server-side only.
 *
 * Core API: GET /members/{type}/{id}/chat/isChatAvailable
 *
 * @returns Boolean indicating if chat is currently available for the member
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const memberId = searchParams.get('memberId');
  const memberType = searchParams.get('memberType') || 'byMemberCk';
  const planId = searchParams.get('planId');

  // Generate a correlation ID for tracing this request through logs
  const correlationId =
    request.headers.get('x-correlation-id') || Date.now().toString();

  logger.info('[API:chat/isChatAvailable] Incoming request', {
    correlationId,
    memberId,
    memberType,
    planId,
  });

  if (!memberId) {
    logger.error('[API:chat/isChatAvailable] Missing memberId parameter', {
      correlationId,
    });
    return NextResponse.json(
      { error: 'Missing required parameter: memberId' },
      { status: 400 },
    );
  }

  try {
    const endpoint = `/api/member/v1/members/${memberType}/${memberId}/chat/isChatAvailable`;
    
    logger.info('[API:chat/isChatAvailable] Calling memberService', {
      correlationId,
      memberId,
      memberType,
      planId,
      endpoint,
    });

    const response = await memberService.get(endpoint, {
      params: planId ? { planId } : undefined,
      headers: {
        'x-correlation-id': correlationId,
      }
    });

    logger.info('[API:chat/isChatAvailable] Response received from memberService', {
      correlationId,
      status: response.status,
      data: response.data,
    });

    // The backend returns a MessageResponse with the boolean as a string in the message
    let isAvailable = false;
    if (response.data && response.data.message) {
      isAvailable = response.data.message.toLowerCase() === 'true';
    }

    return NextResponse.json({ isChatAvailable: isAvailable });
  } catch (error: any) {
    logger.error('[API:chat/isChatAvailable] Error calling memberService', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : 'No response',
    });

    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || 'Failed to check chat availability';

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
