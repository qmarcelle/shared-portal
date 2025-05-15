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

  console.log('⭐ [API:chat/getChatInfo] Endpoint CALLED ⭐', {
    correlationId,
    memberId,
    memberType,
    planId,
    timestamp: new Date().toISOString(),
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  });

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
    const url = `${baseURL}/api/member/v1/members/${memberType}/${memberId}/chat/getChatInfo`;

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

    // Try to parse JSON, but handle cases where it might not be JSON (e.g. plain text error)
    let data;
    try {
      data = await response.json();
    } catch (e) {
      // If response is not JSON, try to get text
      const textResponse = await response.text();
      logger.warn(
        '[API:chat/getChatInfo] Member service response was not JSON.',
        {
          correlationId,
          status: response.status,
          textResponse: textResponse.substring(0, 500), // Log first 500 chars
        },
      );
      // Construct a data object that mimics the error structure if possible
      data = {
        error: 'Non-JSON response from member service',
        description: textResponse.substring(0, 500),
        status: response.status,
      };
    }

    logger.info(
      '[API:chat/getChatInfo] Response received from member service',
      {
        correlationId,
        status: response.status,
        // Log the full data if status is not OK, otherwise just keys for brevity on success
        responseData: !response.ok
          ? data
          : data
            ? Object.keys(data)
            : 'no data object',
      },
    );
    // eslint-disable-next-line no-console
    console.log(
      '[API:chat/getChatInfo] Response received from member service',
      {
        correlationId,
        status: response.status,
        // Log the full data if status is not OK, otherwise just keys for brevity on success
        responseData: !response.ok
          ? data
          : data
            ? Object.keys(data)
            : 'no data object',
      },
    );

    // IMPORTANT: Check if the call to member service failed (e.g. 400, 500)
    if (!response.ok) {
      logger.error(
        '[API:chat/getChatInfo] Member service call failed. Returning error to client.',
        {
          correlationId,
          status: response.status,
          errorDataFromService: data, // This will now contain the detailed error from member service
        },
      );
      // Return an error response to the client, including details from member service if available
      return NextResponse.json(
        {
          message: `Failed to get chat info from member service. Status: ${response.status}`,
          serviceError: data,
        },
        { status: response.status }, // Propagate the error status
      );
    }

    // Transform the data if needed (only if response.ok)
    const transformedData = {
      // Existing mappings
      cloudChatEligible: data.cloudChatEligible || false,
      chatGroup: data.chatGroup || '',
      chatAvailable: data.chatAvailable ?? true,
      isEligible: data.isEligible ?? true,
      workingHours:
        data.workingHours ||
        process.env.NEXT_PUBLIC_CHAT_HOURS ||
        'M-F 8am-5pm',
      chatIDChatBotName: data.chatIDChatBotName || '',
      // Ensure chatBotEligibility is set to isEligible
      chatBotEligibility: data.isEligible ?? true,
      routingChatBotEligibility: data.routingChatBotEligibility || false,

      // Genesys config required fields
      isChatEligibleMember:
        data.isChatEligibleMember ?? data.isEligible ?? true,
      isChatAvailable: data.isChatAvailable ?? data.chatAvailable ?? true,
      chatHours:
        data.workingHours ||
        process.env.NEXT_PUBLIC_CHAT_HOURS ||
        'M-F 8am-5pm',
      rawChatHrs:
        data.rawChatHrs || process.env.NEXT_PUBLIC_RAW_CHAT_HRS || '8_17',
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
