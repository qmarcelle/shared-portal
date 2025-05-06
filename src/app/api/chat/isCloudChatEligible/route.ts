'use server';

import { isCloudChatEligible } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route handler for /api/chat/isCloudChatEligible endpoint
 *
 * Calls the core MemberAPI endpoint: GET /members/{type}/{id}/chat/isCloudChatEligible
 * from the server to determine if a member is eligible for cloud chat.
 *
 * @returns Boolean indicating if member is eligible for cloud chat
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const memberId = searchParams.get('memberId');
  const memberType = searchParams.get('memberType') || 'byMemberCk';
  const groupId = searchParams.get('groupId'); // Optional: If checking by group

  // Generate a correlation ID for tracing this request through logs
  const correlationId =
    request.headers.get('x-correlation-id') || Date.now().toString();

  logger.info('[API:chat/isCloudChatEligible] Incoming request', {
    correlationId,
    memberId,
    memberType,
    groupId,
  });

  if (!memberId && !groupId) {
    logger.error('[API:chat/isCloudChatEligible] Missing required parameters', {
      correlationId,
    });
    return NextResponse.json(
      { error: 'Missing required parameter: memberId or groupId' },
      { status: 400 },
    );
  }

  try {
    logger.info('[API:chat/isCloudChatEligible] Calling memberService', {
      correlationId,
      memberId,
      memberType,
      url: `/members/${memberType}/${memberId}/chat/isCloudChatEligible`,
    });

    // Call core service endpoint - ensure memberId is not null
    if (!memberId) {
      throw new Error('Missing required parameter: memberId');
    }

    const response = await isCloudChatEligible(memberType, memberId.toString());

    logger.info('[API:chat/isCloudChatEligible] Response received', {
      correlationId,
      status: response.status,
      isEligible: !!response.data,
    });

    return NextResponse.json({
      cloudEligible: !!response.data,
    });
  } catch (error) {
    // Detailed error logging
    logger.error('[API:chat/isCloudChatEligible] Error calling service', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      memberId,
      memberType,
    });

    // Return a proper error response to the client
    return NextResponse.json(
      { error: 'Failed to check cloud chat eligibility' },
      { status: 500 },
    );
  }
}
