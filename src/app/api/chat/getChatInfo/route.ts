'use server';

import { getAuthToken } from '@/utils/api/getToken';
import { serverConfig } from '@/utils/env-config';
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
    // Construct the base URL from serverConfig
    const portalServicesUrl = serverConfig.PORTAL_SERVICES_URL || '';
    const memberServiceContext = serverConfig.MEMBERSERVICE_CONTEXT_ROOT || '';
    const baseURL = `${portalServicesUrl}${memberServiceContext}`;

    logger.info('[API:chat/getChatInfo] Member service configuration', {
      correlationId,
      baseURL,
      portalServicesUrl,
      memberServiceContext,
    });

    // Get authentication token
    const token = await getAuthToken();
    if (!token) {
      logger.error(
        '[API:chat/getChatInfo] Failed to get authentication token',
        {
          correlationId,
        },
      );
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 },
      );
    }

    // Construct the endpoint URL
    const endpoint = `/api/member/v1/members/${memberType}/${memberId}/chat/getChatInfo`;
    const url = `${baseURL}${endpoint}${planId ? `?planId=${planId}` : ''}`;

    logger.info('[API:chat/getChatInfo] Calling member service API', {
      correlationId,
      url,
    });

    // Make direct fetch request instead of using memberService
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      cache: 'no-store', // Ensures fresh data for each request
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    logger.info(
      '[API:chat/getChatInfo] Response received from member service',
      {
        correlationId,
        status: response.status,
        dataKeys: Object.keys(data),
      },
    );

    // Transform the response if needed to match expected ChatInfo interface
    const chatInfo = {
      ...data,
      // Ensure consistency with the ChatInfo interface
      chatGroup: data.chatGroup,
      workingHours: data.workingHours || data.businessHours?.text,
      // Map existing fields to those expected in ChatInfo if necessary
      chatAvailable: data.isChatAvailable || data.isEligible,
      cloudEligibility: data.cloudChatEligible,
    };

    logger.info('[API:chat/getChatInfo] Returning transformed chat info', {
      correlationId,
      isEligible: chatInfo.isEligible,
      cloudChatEligible: chatInfo.cloudChatEligible,
      chatGroup: chatInfo.chatGroup,
    });

    return NextResponse.json(chatInfo);
  } catch (error: any) {
    // Detailed error logging with additional context
    logger.error('[API:chat/getChatInfo] Error calling member service', {
      correlationId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      memberId,
      memberType,
      planId,
      statusCode: error.response?.status,
      responseData: error.response?.data,
    });

    try {
      // Attempt to capture more details about the error response
      const errorDetails = {
        message: error.message,
        status: error.response?.status || 500,
        statusText: error.response?.statusText || 'Internal Server Error',
        headers: error.response?.headers
          ? Object.fromEntries(Object.entries(error.response.headers))
          : {},
        data: error.response?.data || {},
      };

      logger.error('[API:chat/getChatInfo] Detailed error information', {
        correlationId,
        errorDetails,
      });

      // Return a proper error response to the client with as much detail as possible
      return NextResponse.json(
        {
          error: errorDetails.message || 'Failed to fetch chat info',
          status: errorDetails.status,
          details: errorDetails.data,
        },
        { status: errorDetails.status },
      );
    } catch (logError) {
      // If enhanced error logging fails, fall back to basic error response
      logger.error(
        '[API:chat/getChatInfo] Error during enhanced error logging',
        {
          correlationId,
          logError:
            logError instanceof Error ? logError.message : 'Unknown error',
        },
      );

      // Return a basic error response
      return NextResponse.json(
        { error: 'Failed to fetch chat info' },
        { status: 500 },
      );
    }
  }
}
