'use server';

import { getCloudChatGroups } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route handler for /api/chat/cloudChatGroups endpoint
 *
 * Calls the core MemberAPI endpoint: GET /members/chat/cloudChatGroups
 * from the server to retrieve all cloud-eligible chat groups.
 *
 * @returns An object containing the chatGroupsMap with group mappings
 */
export async function GET(request: NextRequest) {
  // Generate a correlation ID for tracing this request through logs
  const correlationId =
    request.headers.get('x-correlation-id') || Date.now().toString();

  logger.info('[API:chat/cloudChatGroups] Incoming request', {
    correlationId,
  });

  try {
    logger.info('[API:chat/cloudChatGroups] Calling memberService', {
      correlationId,
      url: '/members/chat/cloudChatGroups',
    });

    const response = await getCloudChatGroups();

    logger.info('[API:chat/cloudChatGroups] Response received', {
      correlationId,
      status: response.status,
      groupCount: response.data?.chatGroupsMap
        ? Object.keys(response.data.chatGroupsMap).length
        : 0,
    });

    // Return the chat groups data, typically a map of group IDs to names
    return NextResponse.json({
      chatGroupsMap: response.data?.chatGroupsMap || {},
      groups: response.data?.groups || [],
    });
  } catch (error) {
    // Detailed error logging
    logger.error('[API:chat/cloudChatGroups] Error calling service', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Return a proper error response to the client
    return NextResponse.json(
      { error: 'Failed to fetch cloud chat groups' },
      { status: 500 },
    );
  }
}
