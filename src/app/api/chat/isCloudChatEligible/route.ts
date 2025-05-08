'use server';

import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route handler for /api/chat/isCloudChatEligible endpoint
 *
 * This proxies and centralizes calls to the member service chat/isCloudChatEligible endpoint
 * and ensures all member service API calls are made server-side only.
 *
 * Core API: GET /members/{type}/{id}/chat/isCloudChatEligible
 *
 * @returns Boolean indicating if the member's group is eligible for cloud chat
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const memberId = searchParams.get('memberId');
  const memberType = searchParams.get('memberType') || 'byMemberCk';
  const planId = searchParams.get('planId');

  // Generate a correlation ID for tracing this request through logs
  const correlationId =
    request.headers.get('x-correlation-id') || Date.now().toString();

  logger.info('[API:chat/isCloudChatEligible] Incoming request', {
    correlationId,
    memberId,
    memberType,
    planId,
  });

  if (!memberId) {
    logger.error('[API:chat/isCloudChatEligible] Missing memberId parameter', {
      correlationId,
    });
    return NextResponse.json(
      { error: 'Missing required parameter: memberId' },
      { status: 400 },
    );
  }

  try {
    const endpoint = `/api/member/v1/members/${memberType}/${memberId}/chat/isCloudChatEligible`;
    
    logger.info('[API:chat/isCloudChatEligible] Calling memberService', {
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

    logger.info('[API:chat/isCloudChatEligible] Response received from memberService', {
      correlationId,
      status: response.status,
      data: response.data,
    });

    // The backend returns a MessageResponse with the boolean as a string in the message
    let isEligible = false;
    if (response.data && response.data.message) {
      isEligible = response.data.message.toLowerCase() === 'true';
    }

    return NextResponse.json({ isCloudChatEligible: isEligible });
  } catch (error: any) {
    logger.error('[API:chat/isCloudChatEligible] Error calling memberService', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : 'No response',
    });

    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || 'Failed to check cloud chat eligibility';

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
