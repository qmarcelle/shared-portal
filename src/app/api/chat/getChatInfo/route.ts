'use server';

import { getChatInfo } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route handler for /api/chat/getChatInfo endpoint
 *
 * This proxies and centralizes calls to the member service chat/getChatInfo endpoint
 * and ensures all member service API calls are made server-side only.
 *
 * Core API: GET /members/{type}/{id}/chat/getChatInfo
 *
 * @returns ChatInfo object with all chat-related properties including:
 * - chatGroup: The group identifier for the chat
 * - workingHours: Available hours for the chat service
 * - chatIDChatBotName: Chat bot name identifier
 * - chatBotEligibility: Boolean indicating if chatbot is eligible
 * - routingChatBotEligibility: Boolean for routing chatbot eligibility
 * - cloudEligibility: Boolean indicating cloud chat eligibility
 * - chatAvailable: Boolean indicating if chat is currently available
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const memberId = searchParams.get('memberId');
  const memberType = searchParams.get('memberType') || 'byMemberCk';
  const planId = searchParams.get('planId');

  // Generate a correlation ID for tracing this request through logs
  const correlationId =
    request.headers.get('x-correlation-id') || Date.now().toString();

  logger.info('[API:chat/getChatInfo] Incoming request', {
    correlationId,
    memberId,
    memberType,
    planId,
  });

  if (!memberId) {
    logger.error('[API:chat/getChatInfo] Missing memberId parameter', {
      correlationId,
    });
    return NextResponse.json(
      { error: 'Missing required parameter: memberId' },
      { status: 400 },
    );
  }

  try {
    logger.info('[API:chat/getChatInfo] Calling memberService.getChatInfo', {
      correlationId,
      memberId,
      memberType,
      planId,
      url: `/members/${memberType}/${memberId}/chat/getChatInfo`,
    });

    // Call the core MemberAPI endpoint with all required parameters
    const response = await getChatInfo(memberType, memberId.toString());

    // If planId is provided, we should pass it in the params
    // const response = await memberService.get(
    //   `/members/${memberType}/${memberId}/chat/getChatInfo`,
    //   planId ? { params: { planId } } : undefined
    // );

    logger.info('[API:chat/getChatInfo] Response received from memberService', {
      correlationId,
      status: response.status,
      data: {
        isEligible: response.data.isEligible,
        cloudChatEligible: response.data.cloudChatEligible,
        chatGroup: response.data.chatGroup,
        workingHours: response.data.workingHours,
        chatBotEligibility: response.data.chatBotEligibility,
        routingChatBotEligibility: response.data.routingChatBotEligibility,
        hasBusinessHours: !!response.data.businessHours,
      },
    });

    // Transform the response if needed to match expected ChatInfo interface
    const chatInfo = {
      ...response.data,
      // Ensure consistency with the ChatInfo interface
      chatGroup: response.data.chatGroup,
      workingHours:
        response.data.workingHours || response.data.businessHours?.text,
      // Map existing fields to those expected in ChatInfo if necessary
      chatAvailable: response.data.isChatAvailable || response.data.isEligible,
      cloudEligibility: response.data.cloudChatEligible,
    };

    return NextResponse.json(chatInfo);
  } catch (error) {
    // Detailed error logging
    logger.error('[API:chat/getChatInfo] Error calling memberService', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      memberId,
      memberType,
      planId,
    });

    // Return a proper error response to the client
    return NextResponse.json(
      { error: 'Failed to fetch chat info' },
      { status: 500 },
    );
  }
}
