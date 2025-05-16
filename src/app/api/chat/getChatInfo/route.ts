'use server';

import {
  markApiCallStarted,
  updateApiState,
} from '@/app/chat/utils/chatSequentialLoader';
import { getAuthToken } from '@/utils/api/getToken';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Maps frontend member types to backend-compatible member ID types
 * @param frontendType The member type passed from the frontend (e.g., 'MEM')
 * @returns A backend-compatible member ID type
 */
const mapMemberType = (frontendType: string | null): string => {
  if (!frontendType) return 'subscriberId'; // Default fallback

  // Map frontend member types to backend types
  const typeMap: Record<string, string> = {
    MEM: 'subscriberId', // Map 'MEM' to 'subscriberId' as specified
    SUB: 'subscriberId',
    // Add more mappings as needed
  };

  return typeMap[frontendType] || frontendType; // Return mapped value or original if no mapping exists
};

/**
 * Generates mock chat configuration data for development/testing
 * This is used when the real API is unavailable or there's an error
 */
function generateMockChatConfig(
  memberId: string | null,
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
    genesysCloudConfig: {
      deploymentId:
        process.env.NEXT_PUBLIC_GENESYS_CLOUD_DEPLOYMENT_ID ||
        'mock-deployment-id',
      environment:
        process.env.NEXT_PUBLIC_GENESYS_CLOUD_ENVIRONMENT || 'prod-usw2',
      orgId: process.env.NEXT_PUBLIC_GENESYS_CLOUD_ORG_ID || '',
    },
    // Additional debugging info
    _mockData: true,
    _timestamp: new Date().toISOString(),
    _memberId: memberId,
    _planId: planId,
  };
}

/**
 * API Route handler for the /api/chat/getChatInfo endpoint
 *
 * This endpoint proxies requests to the member service API to retrieve chat configuration
 * information for a specific member.
 */
export async function GET(request: NextRequest) {
  const memberId = request.nextUrl.searchParams.get('memberId');
  const memeck = request.nextUrl.searchParams.get('memeck') || memberId; // Look for memeck or fall back to memberId
  const memberType = request.nextUrl.searchParams.get('memberType');
  const planId = request.nextUrl.searchParams.get('planId');
  const correlationId =
    request.headers.get('x-correlation-id') || Date.now().toString();

  // Mark API call started in our sequential loader
  markApiCallStarted();

  console.log('⭐ [API:chat/getChatInfo] Endpoint CALLED ⭐', {
    correlationId,
    memberId,
    memeck,
    memberType,
    planId,
    timestamp: new Date().toISOString(),
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  });

  logger.info('[API:chat/getChatInfo] Incoming request', {
    correlationId,
    memberId,
    memeck,
    memberType,
    planId,
  });
  // eslint-disable-next-line no-console
  console.log('[API:chat/getChatInfo] Incoming request', {
    correlationId,
    memberId,
    memeck,
    memberType,
    planId,
  });

  if (!memeck) {
    return NextResponse.json(
      { message: 'Missing required parameter: memeck or memberId' },
      { status: 400 },
    );
  }

  try {
    const token = await getAuthToken();

    // Check if environment variables are available
    const portalServicesUrl = process.env.PORTAL_SERVICES_URL;
    const memberServiceRoot = process.env.MEMBERSERVICE_CONTEXT_ROOT;

    if (!portalServicesUrl || !memberServiceRoot) {
      logger.error(
        '[API:chat/getChatInfo] Missing required environment variables',
        {
          correlationId,
          hasPortalServicesUrl: !!portalServicesUrl,
          hasMemberServiceRoot: !!memberServiceRoot,
        },
      );

      // Generate mock data as fallback for missing environment variables
      const mockData = generateMockChatConfig(memeck, planId);
      mockData.genesysCloudConfig.orgId =
        process.env.NEXT_PUBLIC_GENESYS_CLOUD_ORG_ID || 'mock-org-id';

      // Update sequential loader state
      updateApiState(
        mockData.isEligible,
        mockData.cloudChatEligible ? 'cloud' : 'legacy',
      );

      logger.info(
        '[API:chat/getChatInfo] Returning mock data due to missing environment variables',
      );
      return NextResponse.json(mockData);
    }

    // Use direct environment variables instead of serverConfig
    const baseURL = `${portalServicesUrl}${memberServiceRoot}`;

    logger.info('[API:chat/getChatInfo] Member service configuration', {
      correlationId,
      baseURL,
      portalServicesUrl,
      memberServiceContext: memberServiceRoot,
    });
    // eslint-disable-next-line no-console
    console.log('[API:chat/getChatInfo] Member service configuration', {
      correlationId,
      baseURL,
      portalServicesUrl,
      memberServiceContext: memberServiceRoot,
    });

    // Build the URL using the correct format: /api/member/v1/members/byMemberCk/${memberCk}
    const url = `${baseURL}/api/member/v1/members/byMemberCk/${memeck}/chat/getChatInfo${planId ? `?planId=${planId}` : ''}`;

    logger.info('[API:chat/getChatInfo] Calling member service API', {
      correlationId,
      url,
      memeck,
      planId,
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
      // Log the raw data received from the member service to inspect its structure
      logger.info('[API:chat/getChatInfo] Raw data from member service:', {
        correlationId,
        rawDataFromService: data, // Log the entire data object
      });
      // eslint-disable-next-line no-console
      console.log(
        '[API:chat/getChatInfo] Raw data from member service (console):',
        {
          correlationId,
          rawDataFromService: data, // Log the entire data object via console too
        },
      );
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

      // Generate mock data as fallback
      const mockData = generateMockChatConfig(memeck, planId);
      mockData.genesysCloudConfig.orgId =
        process.env.NEXT_PUBLIC_GENESYS_CLOUD_ORG_ID || 'mock-org-id';

      // Update sequential loader state with mock data
      updateApiState(
        mockData.isEligible,
        mockData.cloudChatEligible ? 'cloud' : 'legacy',
      );

      logger.info(
        '[API:chat/getChatInfo] Returning mock data due to API error',
      );
      return NextResponse.json(mockData);
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

      // Use the Ping auth token as the clickToChatToken (as per user request for testing)
      clickToChatToken: token || '', // token is from getAuthToken()

      // Add Genesys Cloud configuration
      genesysCloudConfig: {
        deploymentId: process.env.NEXT_PUBLIC_GENESYS_CLOUD_DEPLOYMENT_ID || '',
        environment:
          process.env.NEXT_PUBLIC_GENESYS_CLOUD_ENVIRONMENT || 'prod-usw2',
        orgId: process.env.NEXT_PUBLIC_GENESYS_CLOUD_ORG_ID || '',
      },
    };

    // Update sequential loader state with API result
    updateApiState(
      transformedData.isEligible,
      transformedData.cloudChatEligible ? 'cloud' : 'legacy',
    );

    logger.info(
      '[API:chat/getChatInfo] Returning transformed chat info (using Ping token as clickToChatToken)',
      {
        correlationId,
        cloudChatEligible: transformedData.cloudChatEligible,
        chatGroup: transformedData.chatGroup,
        chatAvailable: transformedData.chatAvailable,
      },
    );
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
      // Generate mock data as fallback for error cases
      const mockData = generateMockChatConfig(memeck, planId);
      mockData.genesysCloudConfig.orgId =
        process.env.NEXT_PUBLIC_GENESYS_CLOUD_ORG_ID || 'mock-org-id';

      // Update sequential loader state with mock data for error case
      updateApiState(
        mockData.isEligible,
        mockData.cloudChatEligible ? 'cloud' : 'legacy',
      );

      logger.info(
        '[API:chat/getChatInfo] Returning mock data due to error condition',
      );
      return NextResponse.json(mockData);
    } catch (logError) {
      logger.error('[API:chat/getChatInfo] Error generating mock data', {
        correlationId,
        logError,
      });
      // eslint-disable-next-line no-console
      console.error('[API:chat/getChatInfo] Error generating mock data', {
        correlationId,
        logError,
      });

      // Last resort fallback
      const basicMockData = {
        isEligible: true,
        cloudChatEligible: false,
        chatAvailable: true,
        genesysCloudConfig: {
          deploymentId:
            process.env.NEXT_PUBLIC_GENESYS_CLOUD_DEPLOYMENT_ID ||
            'mock-deployment-id',
          environment:
            process.env.NEXT_PUBLIC_GENESYS_CLOUD_ENVIRONMENT || 'prod-usw2',
          orgId: process.env.NEXT_PUBLIC_GENESYS_CLOUD_ORG_ID || 'mock-org-id',
        },
        _error: 'Error handling failed, basic fallback provided',
      };

      // Update sequential loader with basic fallback
      updateApiState(true, 'legacy');

      return NextResponse.json(basicMockData);
    }
  }
}
