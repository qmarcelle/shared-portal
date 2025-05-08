'use server';

import { memberService } from '@/utils/api/memberService';
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
    // Log the base URL and full endpoint URL for debugging
    logger.info('[API:chat/getChatInfo] Member service configuration', {
      correlationId,
      baseURL: memberService.defaults.baseURL,
    });

    const endpoint = `/api/member/v1/members/${memberType}/${memberId}/chat/getChatInfo`;
    
    logger.info('[API:chat/getChatInfo] Calling memberService', {
      correlationId,
      memberId,
      memberType,
      planId,
      endpoint,
    });

    // Direct call using memberService
    const response = await memberService.get(endpoint, {
      params: planId ? { planId } : undefined,
      headers: {
        'x-correlation-id': correlationId,
      }
    });

    logger.info('[API:chat/getChatInfo] Response received from memberService', {
      correlationId,
      status: response.status,
      data: response.data,
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
  } catch (error: any) {
    // Detailed error logging with additional context
    logger.error('[API:chat/getChatInfo] Error calling memberService', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      } : 'No response',
      request: error.request ? 'Request was made but no response received' : 'Request setup error',
      memberId,
      memberType,
      planId,
    });

    // Return appropriate status code based on the error
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || 'Failed to fetch chat info';

    // Return a proper error response to the client
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
