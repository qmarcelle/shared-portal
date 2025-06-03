/**
 * Client-side API utility to fetch chat information.
 */
import { logger } from '@/utils/logger';

const LOG_PREFIX = '[ChatAPI:getChatInfo]';

// Define a more specific return type if known, otherwise 'any' is a placeholder.
// Ideally, this should match the structure of the data returned by the /api/chat/getChatInfo endpoint.
export interface ChatInfoResponse {
  isEligible: boolean;
  cloudChatEligible: boolean;
  chatAvailable?: boolean;
  chatGroup?: string;
  businessHours?: {
    isOpen: boolean;
    text: string;
  };
  workingHours?: string;
  // Add other fields that your backend API returns and chatStore expects
  isChatEligibleMember?: boolean;
  isChatAvailable?: boolean;
  chatHours?: string;
  rawChatHrs?: string;
  clickToChatToken?: string;
  clickToChatEndpoint?: string;
  coBrowseLicence?: string;
  routingInteractionId?: string;
  [key: string]: any; // Allow other properties
}

export async function getChatInfo(
  memberId: string,
  memberType?: string,
): Promise<ChatInfoResponse> {
  const params = new URLSearchParams();
  params.append('memberId', memberId);
  if (memberType) {
    params.append('memberType', memberType);
  }

  const apiUrl = `/api/chat/getChatInfo?${params.toString()}`;
  logger.info(`${LOG_PREFIX} Fetching chat info`, { apiUrl });

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any other necessary headers, like Authorization if needed directly by this Next.js API route
        // (though usually auth is handled by the browser session for internal API routes)
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`${LOG_PREFIX} API request failed`, {
        status: response.status,
        statusText: response.statusText,
        errorText,
        apiUrl,
      });
      throw new Error(
        `Failed to fetch chat info: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }

    const data: ChatInfoResponse = await response.json();
    logger.info(`${LOG_PREFIX} Successfully fetched chat info`, { data });
    return data;
  } catch (error: any) {
    logger.error(`${LOG_PREFIX} Error during fetch operation`, {
      errorMessage: error.message,
      stack: error.stack,
      apiUrl,
    });
    // Re-throw the error so the caller (chatStore) can handle it
    throw error;
  }
}
