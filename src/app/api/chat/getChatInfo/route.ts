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
      'https://api3.bcbst.com/stge/soa/api/cci/genesyschat',
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
// function createFallbackResponse( // Commenting out the old fallback
//   memeck: string | null,
//   planId: string | null,
//   reason: string,
//   correlationId: string,
//   status: number = 200, // Mock data can still be a 200 if it's an intentional fallback
// ): NextResponse {
//   logger.info(`[API:chat/getChatInfo] Returning mock data. Reason: ${reason}`, {
//     correlationId,
//   });
//   const mockData = generateMockChatConfig(memeck, planId);
//   // Note: generateMockChatConfig already includes fallbacks for orgId, clickToChatEndpoint, and gmsChatUrl
//   updateApiState(
//     mockData.isEligible,
//     mockData.cloudChatEligible ? 'cloud' : 'legacy',
//   );
//   return NextResponse.json(mockData, { status });
// }

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
      {
        message: 'Missing required parameter: memeck or memberId',
        error: 'ClientError',
      },
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
      // return createFallbackResponse( // MODIFIED
      //   memeck,
      //   planId,
      //   'Missing environment variables',
      //   correlationId,
      // );
      return NextResponse.json(
        {
          message:
            'Server configuration error: Missing backend API environment variables.',
          error: 'ServerError',
        },
        { status: 500 },
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
        // data = { // MODIFIED
        //   // Construct an error-like object
        //   error: 'Invalid JSON response from member service',
        //   description: responseTextForError.substring(0, 500),
        //   status: response.status,
        // };
        // Force treating this as a non-ok response if it wasn't already
        // if (response.ok) { // MODIFIED
        //   // This creates a synthetic non-ok scenario for our logic below
        //   return createFallbackResponse(
        //     memeck,
        //     planId,
        //     `Invalid JSON from upstream (status ${response.status})`,
        //     correlationId,
        //   );
        // }
        return NextResponse.json(
          {
            message: 'Failed to parse response from backend service.',
            error: 'UpstreamError',
            upstreamStatus: response.status,
            details: responseTextForError.substring(0, 500),
          },
          { status: 502 }, // Bad Gateway, as we got an invalid response from upstream
        );
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
      // data = { // MODIFIED
      //   error: 'Non-JSON content type from member service',
      //   description: responseTextForError.substring(0, 500),
      //   status: response.status,
      // };
      // Force treating this as a non-ok response if it wasn't already
      // if (response.ok) { // MODIFIED
      //   return createFallbackResponse(
      //     memeck,
      //     planId,
      //     `Non-JSON content-type from upstream (status ${response.status})`,
      //     correlationId,
      //   );
      // }
      return NextResponse.json(
        {
          message: 'Invalid response content type from backend service.',
          error: 'UpstreamError',
          upstreamStatus: response.status,
          contentType: response.headers.get('content-type'),
          details: responseTextForError.substring(0, 500),
        },
        { status: 502 }, // Bad Gateway
      );
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
      // return createFallbackResponse( // MODIFIED
      //   memeck,
      //   planId,
      //   `Member service call failed with status ${response.status}`,
      //   correlationId,
      //   response.status, // Pass through the original error status if it's an error from upstream
      // );
      return NextResponse.json(
        {
          message: `Error from backend member service: ${data?.error || 'Unknown error'}`,
          error: 'UpstreamError',
          upstreamStatus: response.status,
          details: data,
        },
        {
          status:
            response.status > 0 && response.status < 600
              ? response.status
              : 500,
        }, // Use upstream status, or 500
      );
    }

    // Make sure essential fields like orgId, clickToChatEndpoint, and gmsChatUrl have fallbacks
    // if they are not provided by the API. This is now a crucial step as we are not mocking.
    const validatedData = {
      ...data,
      orgId: data.orgId || process.env.NEXT_PUBLIC_GENESYS_CLOUD_ORG_ID, // Example fallback
      clickToChatEndpoint:
        data.gmsChatUrl || process.env.NEXT_PUBLIC_GMS_CHAT_URL,
      gmsChatUrl: data.gmsChatUrl || process.env.NEXT_PUBLIC_GMS_CHAT_URL,
      // Add other critical fallbacks here IF AND ONLY IF they should have system-wide defaults
      // and are not expected to always come from the backend.
      // For example, clickToChatToken should ideally always come from the backend.
    };

    if (!validatedData.clickToChatToken) {
      logger.error(
        '[API:chat/getChatInfo] Critical: clickToChatToken missing from backend response and no fallback configured.',
        { correlationId, responseData: validatedData },
      );
      return NextResponse.json(
        {
          message: 'Chat token missing in response from backend service.',
          error: 'ServerError',
          details: 'clickToChatToken is missing.',
        },
        { status: 500 },
      );
    }
    if (
      !validatedData.clickToChatEndpoint &&
      validatedData.chatMode === 'legacy'
    ) {
      logger.error(
        '[API:chat/getChatInfo] Critical: clickToChatEndpoint missing for legacy mode.',
        { correlationId, responseData: validatedData },
      );
      return NextResponse.json(
        {
          message:
            'Chat endpoint missing in response from backend service for legacy mode.',
          error: 'ServerError',
          details: 'clickToChatEndpoint is missing.',
        },
        { status: 500 },
      );
    }
    // Add similar checks for other absolutely critical fields if necessary.

    logger.info(
      '[API:chat/getChatInfo] Successfully fetched and validated chat info.',
      {
        correlationId,
        chatMode: validatedData.cloudChatEligible ? 'cloud' : 'legacy',
      },
    );

    updateApiState(
      validatedData.isEligible,
      validatedData.cloudChatEligible ? 'cloud' : 'legacy',
    );

    return NextResponse.json(validatedData);
  } catch (error: any) {
    logger.error('[API:chat/getChatInfo] Unhandled error in GET handler.', {
      correlationId,
      errorMessage: error.message,
      errorStack: error.stack,
      errorDetails: error,
    });
  }
}

// The generateMockChatConfig function can be kept for other testing purposes if needed,
// but it's no longer directly used for fallbacks in this API route.

// ... rest of the file (if any) including generateMockChatConfig definition ...
