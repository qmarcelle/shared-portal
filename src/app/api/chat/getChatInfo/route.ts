'use server';

import {
  markApiCallStarted,
  updateApiState,
} from '@/app/chat/utils/chatSequentialLoader';
import { getAuthToken } from '@/utils/api/getToken';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Generates mock chat configuration data for development/testing
 * This is used when the real API is unavailable or there's an error
 */
function generateMockChatConfig(
  memberId: string | null, // memeck is passed here
  planId: string | null,
) {
  return {
    cloudChatEligible: false, // Use legacy chat by default
    chatGroup: 'General',
    chatAvailable: true,
    isEligible: true,
    workingHours: 'M-F 8am-5pm EST',
    chatIDChatBotName: 'IDCard_Bot',
    chatBotEligibility: true,
    routingChatBotEligibility: false,
    isChatEligibleMember: true,
    isChatAvailable: true,
    chatHours: 'M-F 8am-5pm EST',
    rawChatHrs: '8_17',
    clickToChatToken: 'mock-token-for-testing-purposes',
    clickToChatEndpoint:
      process.env.NEXT_PUBLIC_GENESYS_LEGACY_ENDPOINT ||
      'https://members.bcbst.com/test/soa/api/cci/genesyschat',
    gmsChatUrl:
      process.env.NEXT_PUBLIC_GMS_CHAT_URL ||
      process.env.NEXT_PUBLIC_GENESYS_LEGACY_ENDPOINT || // Fallback to main legacy endpoint if GMS_CHAT_URL is not set
      'https://members.bcbst.com/test/soa/api/cci/genesyschat',
    widgetUrl:
      process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL ||
      '/assets/genesys/plugins/widgets.min.js',
    clickToChatJs: '/assets/genesys/click_to_chat.js',
    genesysCloudConfig: {
      deploymentId:
        process.env.NEXT_PUBLIC_GENESYS_CLOUD_DEPLOYMENT_ID ||
        'mock-deployment-id',
      environment:
        process.env.NEXT_PUBLIC_GENESYS_CLOUD_ENVIRONMENT || 'prod-usw2',
      orgId: process.env.NEXT_PUBLIC_GENESYS_CLOUD_ORG_ID || 'mock-org-id', // Ensured fallback
    },
    _mockData: true,
    _timestamp: new Date().toISOString(),
    _memberId: memberId,
    _planId: planId,
  };
}

/**
 * Helper function to generate and return a fallback mock data response.
 */
function createFallbackResponse(
  memeck: string | null,
  planId: string | null,
  reason: string,
  correlationId: string,
  status: number = 200, // Mock data can still be a 200 if it's an intentional fallback
): NextResponse {
  logger.info(`[API:chat/getChatInfo] Returning mock data. Reason: ${reason}`, {
    correlationId,
  });
  const mockData = generateMockChatConfig(memeck, planId);
  // Note: generateMockChatConfig already includes fallbacks for orgId, clickToChatEndpoint, and gmsChatUrl
  updateApiState(
    mockData.isEligible,
    mockData.cloudChatEligible ? 'cloud' : 'legacy',
  );
  return NextResponse.json(mockData, { status });
}

/**
 * API Route handler for the /api/chat/getChatInfo endpoint
 *
 * This endpoint proxies requests to the member service API to retrieve chat configuration
 * information for a specific member.
 */
export async function GET(request: NextRequest) {
  const memberIdQuery = request.nextUrl.searchParams.get('memberId');
  const memeck = request.nextUrl.searchParams.get('memeck') || memberIdQuery;
  const planId = request.nextUrl.searchParams.get('planId');
  const correlationId =
    request.headers.get('x-correlation-id') || Date.now().toString();

  markApiCallStarted();

  // Prominent entry log
  console.log('⭐ [API:chat/getChatInfo] Endpoint CALLED ⭐', {
    correlationId,
    memberIdQuery, // Log the original memberId from query
    memeck, // Log the derived memeck
    planId,
    timestamp: new Date().toISOString(),
    url: request.url,
    // headers: Object.fromEntries(request.headers.entries()), // Can be verbose
  });

  logger.info('[API:chat/getChatInfo] Incoming request', {
    correlationId,
    memberIdQuery,
    memeck,
    planId,
  });

  if (!memeck) {
    logger.warn(
      '[API:chat/getChatInfo] Missing required parameter: memeck or memberId',
      { correlationId },
    );
    return NextResponse.json(
      { message: 'Missing required parameter: memeck or memberId' },
      { status: 400 },
    );
  }

  try {
    const token = await getAuthToken();
    const portalServicesUrl = process.env.PORTAL_SERVICES_URL;
    const memberServiceRoot = process.env.MEMBERSERVICE_CONTEXT_ROOT;

    if (!portalServicesUrl || !memberServiceRoot) {
      logger.error(
        '[API:chat/getChatInfo] Missing required environment variables for backend API.',
        {
          correlationId,
          hasPortalServicesUrl: !!portalServicesUrl,
          hasMemberServiceRoot: !!memberServiceRoot,
        },
      );
      return createFallbackResponse(
        memeck,
        planId,
        'Missing environment variables',
        correlationId,
      );
    }

    const baseURL = `${portalServicesUrl}${memberServiceRoot}`;
    const url = `${baseURL}/api/member/v1/members/byMemberCk/${memeck}/chat/getChatInfo${planId ? `?planId=${planId}` : ''}`;

    logger.info('[API:chat/getChatInfo] Calling member service API', {
      correlationId,
      url,
    });

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      cache: 'no-store',
    });

    let data;
    let responseTextForError = ''; // To store text response in case of JSON parse error
    if (response.headers.get('content-type')?.includes('application/json')) {
      try {
        data = await response.json();
      } catch (e) {
        // Attempt to read text if JSON parsing failed, for better error info
        try {
          responseTextForError = await response.text();
        } catch (textErr) {
          // Ignore error from text reading if it also fails
        }
        logger.warn(
          '[API:chat/getChatInfo] Member service response was not valid JSON, despite content-type.',
          {
            correlationId,
            status: response.status,
            responseAttemptedText: responseTextForError.substring(0, 500),
            jsonParseError: e instanceof Error ? e.message : String(e),
          },
        );
        data = {
          // Construct an error-like object
          error: 'Invalid JSON response from member service',
          description: responseTextForError.substring(0, 500),
          status: response.status,
        };
        // Force treating this as a non-ok response if it wasn't already
        if (response.ok) {
          // This creates a synthetic non-ok scenario for our logic below
          return createFallbackResponse(
            memeck,
            planId,
            `Invalid JSON from upstream (status ${response.status})`,
            correlationId,
          );
        }
      }
    } else {
      // Handle non-JSON content types
      responseTextForError = await response.text();
      logger.warn(
        '[API:chat/getChatInfo] Member service response was not JSON (based on content-type header).',
        {
          correlationId,
          status: response.status,
          contentType: response.headers.get('content-type'),
          textResponse: responseTextForError.substring(0, 500),
        },
      );
      data = {
        error: 'Non-JSON content type from member service',
        description: responseTextForError.substring(0, 500),
        status: response.status,
      };
      // Force treating this as a non-ok response if it wasn't already
      if (response.ok) {
        return createFallbackResponse(
          memeck,
          planId,
          `Non-JSON content-type from upstream (status ${response.status})`,
          correlationId,
        );
      }
    }

    logger.info(
      '[API:chat/getChatInfo] Response received from member service',
      {
        correlationId,
        status: response.status,
        responseDataPreview: data
          ? response.ok
            ? Object.keys(data)
            : data
          : 'no data object',
      },
    );

    if (!response.ok) {
      logger.error(
        '[API:chat/getChatInfo] Member service call failed (non-OK status).',
        {
          correlationId,
          status: response.status,
          errorDataFromService: data, // Contains error info or parsed text
        },
      );
      return createFallbackResponse(
        memeck,
        planId,
        `Member service API error (status ${response.status})`,
        correlationId,
      );
    }

    const transformedData = {
      cloudChatEligible: data.cloudChatEligible || false,
      chatGroup: data.chatGroup || '',
      chatAvailable: data.chatAvailable ?? true,
      isEligible: data.isEligible ?? true,
      workingHours:
        data.workingHours ||
        process.env.NEXT_PUBLIC_CHAT_HOURS ||
        'M-F 8am-5pm',
      chatIDChatBotName: data.chatIDChatBotName || '',
      chatBotEligibility: data.isEligible ?? true, // Ensure chatBotEligibility defaults based on isEligible
      routingChatBotEligibility: data.routingChatBotEligibility || false,
      isChatEligibleMember:
        data.isChatEligibleMember ?? data.isEligible ?? true,
      isChatAvailable: data.isChatAvailable ?? data.chatAvailable ?? true,
      chatHours:
        data.workingHours ||
        process.env.NEXT_PUBLIC_CHAT_HOURS ||
        'M-F 8am-5pm',
      rawChatHrs:
        data.rawChatHrs || process.env.NEXT_PUBLIC_RAW_CHAT_HRS || '8_17',
      clickToChatToken: token || '',
      genesysCloudConfig: {
        deploymentId:
          (data.genesysCloudConfig as any)?.deploymentId ||
          process.env.NEXT_PUBLIC_GENESYS_CLOUD_DEPLOYMENT_ID ||
          '',
        environment:
          (data.genesysCloudConfig as any)?.environment ||
          process.env.NEXT_PUBLIC_GENESYS_CLOUD_ENVIRONMENT ||
          'prod-usw2',
        orgId:
          (data.genesysCloudConfig as any)?.orgId ||
          process.env.NEXT_PUBLIC_GENESYS_CLOUD_ORG_ID ||
          '',
      },
      clickToChatEndpoint: !(data.cloudChatEligible || false)
        ? process.env.NEXT_PUBLIC_GENESYS_LEGACY_ENDPOINT ||
          'https://members.bcbst.com/test/soa/api/cci/genesyschat'
        : undefined,
      gmsChatUrl: !(data.cloudChatEligible || false)
        ? process.env.NEXT_PUBLIC_GMS_CHAT_URL ||
          process.env.NEXT_PUBLIC_GENESYS_LEGACY_ENDPOINT ||
          'https://members.bcbst.com/test/soa/api/cci/genesyschat'
        : undefined,
    };

    if (request.nextUrl.searchParams.get('forceLegacy') === 'true') {
      (transformedData as any).cloudChatEligible = false;
      (transformedData as any).clickToChatEndpoint =
        process.env.NEXT_PUBLIC_GENESYS_LEGACY_ENDPOINT ||
        'forced-legacy-endpoint';
      (transformedData as any).gmsChatUrl =
        process.env.NEXT_PUBLIC_GMS_CHAT_URL ||
        process.env.NEXT_PUBLIC_GENESYS_LEGACY_ENDPOINT ||
        'forced-legacy-gms';
      logger.warn(
        '[API:chat/getChatInfo] Forcing legacy mode via query parameter.',
        { correlationId },
      );
    }

    updateApiState(
      transformedData.isEligible,
      transformedData.cloudChatEligible ? 'cloud' : 'legacy',
    );

    logger.info('[API:chat/getChatInfo] Returning transformed chat info', {
      correlationId,
      cloudChatEligible: transformedData.cloudChatEligible,
      chatAvailable: transformedData.chatAvailable,
      isEligible: transformedData.isEligible,
    });

    return NextResponse.json(transformedData);
  } catch (error: any) {
    logger.error('[API:chat/getChatInfo] Unhandled error in GET handler', {
      correlationId,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      memeck, // memeck was 'memberId' in the original error log here
      planId,
    });

    // Attempt to return mock data even for unexpected errors
    // The status code for the response itself might be 500 if we reach here due to an internal server error.
    // However, the mock data is still intended to allow the frontend to function in a degraded state.
    return createFallbackResponse(
      memeck,
      planId,
      'Unhandled exception in API handler',
      correlationId,
      500,
    );
  }
}
