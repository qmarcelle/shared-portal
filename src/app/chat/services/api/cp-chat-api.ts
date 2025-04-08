import { ChatError } from '../../types/errors';
import { ChatInfo, ChatPayload } from '../../types/types';

interface CPChatAPIConfig {
  baseUrl: string;
  headers: {
    'X-Portal-Login': string;
    Authorization?: string;
  };
}

let config: CPChatAPIConfig = {
  baseUrl: process.env.NEXT_PUBLIC_CHAT_API_URL || 'https://stge-js.bcbst.com',
  headers: {
    'X-Portal-Login': '',
  },
};

/**
 * Configure the Chat API with authentication headers
 */
export function configureCPChatAPI(newConfig: Partial<CPChatAPIConfig>) {
  config = { ...config, ...newConfig };
}

/**
 * Generic API call handler for Chat endpoints
 */
async function cpChatApiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const response = await fetch(`${config.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new ChatError(
        `Chat API call failed: ${response.statusText}`,
        'NETWORK_ERROR',
        'error',
        {
          status: response.status,
          endpoint,
          method: options.method,
        },
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ChatError) {
      throw error;
    }
    throw new ChatError('Chat API call failed', 'NETWORK_ERROR', 'error', {
      endpoint,
      method: options.method,
      originalError: error,
    });
  }
}

/**
 * Chat API service with endpoints matching the provided documentation
 */
export const cpChatAPI = {
  /**
   * Get chat eligibility and configuration
   */
  async getChatInfo(
    memberId: string,
    lookup = 'byMemberCk',
  ): Promise<ChatInfo> {
    const endpoint = `/MemberServiceWeb/api/member/v1/members/${lookup}/${memberId}/chat/getChatInfo`;
    return cpChatApiCall<ChatInfo>(endpoint);
  },

  /**
   * Get cloud chat groups configuration
   */
  async getCloudChatGroups(): Promise<any> {
    const endpoint =
      '/MemberServiceWeb/api/member/v1/members/chat/cloudChatGroups';
    return cpChatApiCall(endpoint);
  },

  /**
   * Send email communication
   */
  async sendEmail(emailData: {
    memberEmail: string;
    message: string;
    category?: string;
    contactNumber?: string;
  }): Promise<void> {
    const endpoint = '/memberservice/api/v1/contactusemail';
    return cpChatApiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(emailData),
    });
  },

  /**
   * Get phone attributes and operating hours
   */
  async getPhoneAttributes(params: {
    groupId: string;
    subscriberCk: string;
    effectiveDetails: string;
  }): Promise<{
    memberServicePhoneNumber: string;
    operatingHours: string;
  }> {
    const queryParams = new URLSearchParams(params as any).toString();
    const endpoint = `/OperationHours?${queryParams}`;
    return cpChatApiCall(endpoint);
  },

  /**
   * Get email preferences
   */
  async getEmailPreferences(params: {
    memberKey: string;
    subscriberKey: string;
    getMemberPreferenceBy: string;
    memberUserId: string;
    extendedOptions: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams(params as any).toString();
    const endpoint = `/memberContactPreference?${queryParams}`;
    return cpChatApiCall(endpoint);
  },
};

/**
 * Create chat payload based on the format in the documentation
 * Compatible with Next.js AuthJS session structure
 */
export function createChatPayload(
  session: any,
  chatInfo: ChatInfo,
): ChatPayload {
  const user = session?.user || {};
  const currUsr = user.currUsr || {};
  const plan = currUsr.plan || {};

  // Get the name parts - these are typically not in currUsr
  // but might be available elsewhere in the session
  const firstName =
    currUsr.firstName || user.firstName || user.name?.split(' ')[0] || '';
  const lastName =
    currUsr.lastName ||
    user.lastName ||
    user.name?.split(' ').slice(1).join(' ') ||
    '';

  // Extract coverage types from any available fields
  // These may not be directly available in the session
  const isMedicalEligible = Boolean(
    plan.isMedicalEligible || user.isMedicalEligible,
  );
  const isDentalEligible = Boolean(
    plan.isDentalEligible || user.isDentalEligible,
  );
  const isVisionEligible = Boolean(
    plan.isVisionEligible || user.isVisionEligible,
  );

  // Determine line of business based on available data
  let lineOfBusiness = 'Medical';
  if (!isMedicalEligible && isDentalEligible) {
    lineOfBusiness = 'Dental';
  } else if (!isMedicalEligible && !isDentalEligible && isVisionEligible) {
    lineOfBusiness = 'Vision';
  }

  // Extract group type
  const groupType = user.groupType || 'Commercial';

  return {
    SERV_Type: 'MemberPortal',
    firstname: firstName,
    RoutingChatbotInteractionId: `MP-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    PLAN_ID: plan.memCk || '',
    lastname: lastName,
    GROUP_ID: plan.grpId || '',
    IDCardBotName: chatInfo.chatIDChatBotName,
    IsVisionEligible: isVisionEligible,
    MEMBER_ID: plan.memCk || '',
    coverage_eligibility: lineOfBusiness.toLowerCase(),
    INQ_TYPE: 'MEM',
    IsDentalEligible: isDentalEligible,
    MEMBER_DOB: currUsr.dateOfBirth || user.dateOfBirth || '',
    LOB: lineOfBusiness,
    lob_group: groupType,
    IsMedicalEligibile: isMedicalEligible,
    Origin: 'MemberPortal',
    Source: 'Web',
  };
}
