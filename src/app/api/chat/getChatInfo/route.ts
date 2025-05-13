'use server';

import { getAuthToken } from '@/utils/api/getToken';
import { serverConfig } from '@/utils/env-config';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route handler for the /api/chat/getChatInfo endpoint
 *
 * This endpoint proxies requests to the member service API to retrieve chat configuration
 * information for a specific member.
 */
export async function GET(request: NextRequest) {
  const memberId = request.nextUrl.searchParams.get('memberId');
  const memberType = request.nextUrl.searchParams.get('memberType');
  const planId = request.nextUrl.searchParams.get('planId');
  const correlationId =
    request.headers.get('x-correlation-id') || Date.now().toString();

  logger.info('[API:chat/getChatInfo] Incoming request', {
    correlationId,
    memberId,
    memberType,
    planId,
  });
  // eslint-disable-next-line no-console
  console.log('[API:chat/getChatInfo] Incoming request', {
    correlationId,
    memberId,
    memberType,
    planId,
  });

  if (!memberId || !memberType) {
    return NextResponse.json(
      { message: 'Missing required parameters' },
      { status: 400 },
    );
  }

  try {
    const token = await getAuthToken();

    const baseURL =
      serverConfig.PORTAL_SERVICES_URL +
      serverConfig.MEMBERSERVICE_CONTEXT_ROOT;

    logger.info('[API:chat/getChatInfo] Member service configuration', {
      correlationId,
      baseURL,
      portalServicesUrl: serverConfig.PORTAL_SERVICES_URL,
      memberServiceContext: serverConfig.MEMBERSERVICE_CONTEXT_ROOT,
    });
    // eslint-disable-next-line no-console
    console.log('[API:chat/getChatInfo] Member service configuration', {
      correlationId,
      baseURL,
      portalServicesUrl: serverConfig.PORTAL_SERVICES_URL,
      memberServiceContext: serverConfig.MEMBERSERVICE_CONTEXT_ROOT,
    });

    // Build the URL
    const url = `${baseURL}/api/member/v1/members/${memberType}/${memberId}/chat/getChatInfo${planId ? `?planId=${planId}` : ''}`;

    logger.info('[API:chat/getChatInfo] Calling member service API', {
      correlationId,
      url,
    });
    // eslint-disable-next-line no-console
    console.log('[API:chat/getChatInfo] Calling member service API', {
      correlationId,
      url,
    });

    // Make the request with the auth token
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      cache: 'no-store',
    });

    const data = await response.json();

    logger.info(
      '[API:chat/getChatInfo] Response received from member service',
      {
        correlationId,
        status: response.status,
        dataKeys: data ? Object.keys(data) : [],
      },
    );
    // eslint-disable-next-line no-console
    console.log(
      '[API:chat/getChatInfo] Response received from member service',
      {
        correlationId,
        status: response.status,
        dataKeys: data ? Object.keys(data) : [],
      },
    );

    // Transform the data if needed
    const transformedData = {
      // Ensure we include all relevant fields from the response
      cloudChatEligible: data.cloudChatEligible || false,
      chatGroup: data.chatGroup || '',
      chatAvailable: true, // Force to true for testing
      isEligible: true, // Force eligibility for testing
      workingHours: data.workingHours || 'S_S_24', // Set to 24/7 for testing
      chatIDChatBotName: data.chatIDChatBotName || '',
      chatBotEligibility: data.chatBotEligibility || false,
      routingChatBotEligibility: data.routingChatBotEligibility || false,
    };

    logger.info('[API:chat/getChatInfo] Returning transformed chat info', {
      correlationId,
      cloudChatEligible: transformedData.cloudChatEligible,
      chatGroup: transformedData.chatGroup,
      chatAvailable: transformedData.chatAvailable,
    });
    // eslint-disable-next-line no-console
    console.log('[API:chat/getChatInfo] Returning transformed chat info', {
      correlationId,
      cloudChatEligible: transformedData.cloudChatEligible,
      chatGroup: transformedData.chatGroup,
      chatAvailable: transformedData.chatAvailable,
    });

    return NextResponse.json(transformedData);
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
    // eslint-disable-next-line no-console
    console.error('[API:chat/getChatInfo] Error calling member service', {
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
        headers: error.response?.headers,
        data: error.response?.data,
      };

      logger.error('[API:chat/getChatInfo] Detailed error information', {
        correlationId,
        errorDetails,
      });
      // eslint-disable-next-line no-console
      console.error('[API:chat/getChatInfo] Detailed error information', {
        correlationId,
        errorDetails,
      });

      return NextResponse.json(
        { message: 'Error calling member service', errorDetails },
        { status: 500 },
      );
    } catch (logError) {
      logger.error('[API:chat/getChatInfo] Error logging failure', {
        correlationId,
        logError,
      });
      // eslint-disable-next-line no-console
      console.error('[API:chat/getChatInfo] Error logging failure', {
        correlationId,
        logError,
      });

      return NextResponse.json(
        { message: 'Error calling member service' },
        { status: 500 },
      );
    }
  }
}
