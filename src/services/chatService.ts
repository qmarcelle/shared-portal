import { generateInteractionId } from '../utils/chatUtils';

/**
 * Interface for chat information response
 */
interface ChatInfoResponse {
  chatGroup: string | null;
  workingHours: string | null;
  chatIDChatBotName: string | null;
  chatBotEligibility: boolean;
  routingChatBotEligibility: boolean;
  chatAvailable: boolean;
  cloudChatEligible: boolean;
}

/**
 * Interface for chat session data
 */
interface ChatSessionData {
  sessionId: string;
  startTime: string;
  isActive: boolean;
  planId: string;
}

/**
 * Gets the authorization token for API requests
 * @returns Promise<string> The auth token
 */
async function getAuthToken(): Promise<string> {
  // This would typically call your auth service
  // For testing, we'll return a mock token
  return 'Bearer mock-token-12345';
}

/**
 * Updates chat eligibility by calling the API with the current member and plan
 *
 * @param memberId The member's ID
 * @param planId The plan ID to check eligibility for
 * @returns Promise<ChatInfoResponse> The chat eligibility information
 */
export async function updateChatEligibility(
  memberId: string,
  planId: string,
): Promise<ChatInfoResponse> {
  try {
    const authToken = await getAuthToken();
    const baseUrl = process.env.PORTAL_SERVICES_URL || '';

    const response = await fetch(
      `${baseUrl}/MemberServiceWeb/api/member/v1/members/byMemberCk/${memberId}/chat/getChatInfo`,
      {
        method: 'GET',
        headers: {
          'X-Portal-Login': 'user',
          Authorization: authToken,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Chat eligibility check failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking chat eligibility:', error);
    throw error;
  }
}

/**
 * Prepares the chat payload for initializing a chat session
 *
 * @param memberId Member identifier
 * @param planId Plan identifier
 * @param memberInfo Member information
 * @param planInfo Plan information
 * @param chatInfo Chat eligibility information
 * @returns Object containing the formatted chat payload
 */
export function prepareChatPayload(
  memberInfo: any,
  planInfo: any,
  chatInfo: any,
) {
  return {
    SERV_Type: planInfo.serviceType,
    firstname: memberInfo.firstName,
    RoutingChatbotInteractionId: generateInteractionId(),
    PLAN_ID: planInfo.planId,
    lastname: memberInfo.lastName,
    GROUP_ID: planInfo.groupId,
    IDCardBotName: chatInfo.chatIDChatBotName,
    IsVisionEligible: memberInfo.isVisionEligible,
    MEMBER_ID: memberInfo.memberId,
    coverage_eligibility: memberInfo.coverageEligibility || true,
    INQ_TYPE: 'MemberPortal',
    IsDentalEligible: memberInfo.isDentalEligible,
    MEMBER_DOB: memberInfo.dateOfBirth,
    LOB: planInfo.lineOfBusiness,
    lob_group: planInfo.lobGroup,
    IsMedicalEligibile: memberInfo.isMedicalEligible,
    Origin: 'MemberPortal',
    Source: 'Web',
  };
}

/**
 * Initializes a chat session with Genesys API
 *
 * @param chatPayload The payload to send to the chat API
 * @returns Promise<boolean> True if initialization was successful
 */
export function initializeGenesysChat(chatPayload: any): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      // Check if Genesys is available globally
      if (
        typeof window !== 'undefined' &&
        window.Genesys &&
        window.Genesys.Chat
      ) {
        // Initialize chat with configuration
        const chatConfig = {
          dataURL:
            process.env.GENESYS_CHAT_URL ||
            'https://api.example.com/genesys-chat',
          userData: chatPayload,
          // Other Genesys configuration
        };

        window.Genesys.Chat.createChatWidget(chatConfig);

        // Listen for chat events
        window.Genesys.Chat.onReady = function () {
          console.log('Chat widget ready');
          resolve(true);
        };

        window.Genesys.Chat.onError = function (error: any) {
          console.error('Chat error:', error);
          reject(error);
        };
      } else {
        reject(new Error('Genesys Chat API not available'));
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Add type definition for Genesys global object
declare global {
  interface Window {
    Genesys?: {
      Chat: {
        createChatWidget: (config: any) => void;
        onReady: () => void;
        onSessionStart: () => void;
        onSessionEnd: () => void;
        onError: (error: any) => void;
      };
    };
  }
}
