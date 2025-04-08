/**
 * BCBST Chat API Service Layer
 *
 * This file provides the core API integration for the BCBST chat system, supporting both
 * cloud-based (Genesys Cloud) and on-premises chat implementations. It handles all
 * communication with backend services for chat eligibility, session management, and messaging.
 *
 * Key responsibilities:
 * 1. Eligibility determination - Checks if user is eligible for chat support
 * 2. Business hours handling - Verifies if chat is available at current time
 * 3. Chat session management - Starts/ends chat sessions
 * 4. Message handling - Sends and retrieves chat messages
 * 5. Cloud vs. on-premises determination - Selects appropriate chat implementation
 *
 * Integration pattern:
 * - Used by chat hooks (useChatEligibility, useChat) to interact with backend APIs
 * - Consumed by chat components to display data and manage sessions
 * - Centralizes all API logic to ensure consistency across the application
 *
 * @module chatAPI
 */

import {
  ChatDataPayload,
  ChatInfoResponse,
  parseWorkingHours,
} from '../../schemas/user';
import { ChatError } from '../../types/errors';
import type {
  BusinessHours,
  ChatErrorCode,
  ChatMessage,
  ChatPlan,
  ChatSession,
  UserEligibility,
} from '../../types/types';

/**
 * Configuration interface for the Chat API service
 * Used to initialize the API with proper credentials and endpoints
 *
 * @interface ChatAPIConfig
 * @property {string} baseUrl - Base URL for API endpoints
 * @property {string} token - Authentication token for API calls
 * @property {string} username - Username for X-Portal-Login header
 * @property {number} [timeout] - Optional timeout for API calls in milliseconds
 */
interface ChatAPIConfig {
  baseUrl: string;
  token: string;
  username: string; // Added for X-Portal-Login header
  timeout?: number;
}

/**
 * Standard response structure for Chat API calls
 * Provides consistent typing for all API responses
 *
 * @interface ChatAPIResponse
 * @template T - The type of data returned by the API
 * @property {T} data - The response data
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 */
interface ChatAPIResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

/**
 * Default configuration for the Chat API
 * Values can be overridden using the configureChatAPI function
 */
let config: ChatAPIConfig = {
  baseUrl: process.env.NEXT_PUBLIC_CHAT_API_URL || '',
  token: '',
  username: '',
  timeout: 30000,
};

/**
 * Configure the chat API with custom settings
 *
 * @function configureChatAPI
 * @param {Partial<ChatAPIConfig>} newConfig - Configuration values to override
 * @example
 * configureChatAPI({
 *   baseUrl: 'https://api.example.com',
 *   token: 'user-auth-token',
 *   username: 'john.doe',
 *   timeout: 5000
 * });
 */
export function configureChatAPI(newConfig: Partial<ChatAPIConfig>) {
  config = { ...config, ...newConfig };
}

/**
 * Core API call handling function with proper error handling
 * All API requests are routed through this function to ensure consistent:
 * - Error handling
 * - Authentication
 * - Response formatting
 *
 * @async
 * @function apiCall
 * @template T - The expected response data type
 * @param {string} url - The API endpoint URL (will be appended to baseUrl)
 * @param {RequestInit} options - Standard fetch options
 * @param {ChatErrorCode} errorCode - Error code to use if request fails
 * @returns {Promise<ChatAPIResponse<T>>} Typed API response
 * @throws {ChatError} If the API call fails
 */
async function apiCall<T>(
  url: string,
  options: RequestInit,
  errorCode: ChatErrorCode,
): Promise<ChatAPIResponse<T>> {
  try {
    const response = await fetch(`${config.baseUrl}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: config.token ? `Bearer ${config.token}` : '',
        'X-Portal-Login': config.username, // Required for all endpoints
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new ChatError(
        `API call failed: ${response.statusText}`,
        errorCode,
        'error',
        {
          status: response.status,
          url,
          method: options.method,
        },
      );
    }

    const data = await response.json();
    return {
      data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (error instanceof ChatError) {
      throw error;
    }
    throw new ChatError('API call failed', 'NETWORK_ERROR', 'error', {
      url,
      method: options.method,
      originalError: error,
    });
  }
}

/**
 * Main Chat API Service Object
 *
 * This object exposes all the necessary methods for interacting with the BCBST chat backend,
 * providing a clean interface for components and hooks to use without worrying about the
 * underlying API implementation details.
 */
export const chatAPI = {
  /**
   * Get Chat Eligibility Information
   *
   * Retrieves chat eligibility data for a specific member, including:
   * - Whether chat is available
   * - Business hours information
   * - Chatbot eligibility
   * - Cloud chat eligibility
   *
   * @async
   * @param {string} memberId - The member's unique identifier
   * @returns {Promise<ChatInfoResponse>} Chat eligibility information
   * @throws {ChatError} With code 'ELIGIBILITY_CHECK_FAILED' if request fails
   */
  async getChatInfo(memberId: string): Promise<ChatInfoResponse> {
    const { data } = await apiCall<ChatInfoResponse>(
      `/MemberServiceWeb/api/member/v1/members/byMemberCk/${memberId}/chat/getChatInfo`,
      { method: 'GET' },
      'ELIGIBILITY_CHECK_FAILED',
    );
    return data;
  },

  /**
   * Get Cloud Chat Groups
   *
   * Retrieves available cloud chat groups configuration for routing purposes.
   * This determines which agent groups/departments are available for chat.
   *
   * @async
   * @returns {Promise<any>} Cloud chat groups configuration
   * @throws {ChatError} With code 'CHAT_GROUPS_ERROR' if request fails
   */
  async getCloudChatGroups(): Promise<any> {
    const { data } = await apiCall<any>(
      '/MemberServiceWeb/api/member/v1/members/chat/cloudChatGroups',
      { method: 'GET' },
      'CHAT_GROUPS_ERROR',
    );
    return data;
  },

  /**
   * Start Chat Session
   *
   * Initializes a new chat session with the specified user information and chat data.
   * This is the primary method for beginning a new chat conversation.
   *
   * @async
   * @param {string} planId - The current plan identifier
   * @param {Object} userInfo - Basic user information
   * @param {string} userInfo.firstName - User's first name
   * @param {string} userInfo.lastName - User's last name
   * @param {string} [userInfo.email] - Optional user email address
   * @param {Partial<ChatDataPayload>} chatData - Additional chat data for routing and context
   * @returns {Promise<ChatSession>} The initialized chat session
   * @throws {ChatError} With code 'CHAT_START_ERROR' if session creation fails
   */
  async startSession(
    planId: string,
    userInfo: {
      firstName: string;
      lastName: string;
      email?: string;
    },
    chatData: Partial<ChatDataPayload>,
  ): Promise<ChatSession> {
    const { data } = await apiCall<ChatSession>(
      '/api/v1/chat/session',
      {
        method: 'POST',
        body: JSON.stringify({
          planId,
          userInfo,
          chatData: {
            SERV_Type: chatData.SERV_Type || '',
            firstname: userInfo.firstName,
            lastname: userInfo.lastName,
            PLAN_ID: planId,
            GROUP_ID: chatData.GROUP_ID || '',
            MEMBER_ID: chatData.MEMBER_ID || '',
            Origin: 'MemberPortal',
            Source: 'Web',
            // Include other required fields from chat data payload
            ...chatData,
          },
        }),
      },
      'CHAT_START_ERROR',
    );
    return data;
  },

  /**
   * End Chat Session
   *
   * Terminates an active chat session with the specified ID.
   * This should be called when a user closes the chat or when the conversation ends.
   *
   * @async
   * @param {string} sessionId - The ID of the chat session to end
   * @returns {Promise<void>}
   * @throws {ChatError} With code 'CHAT_END_ERROR' if session termination fails
   */
  async endSession(sessionId: string): Promise<void> {
    await apiCall<void>(
      `/api/v1/chat/session/${sessionId}`,
      { method: 'DELETE' },
      'CHAT_END_ERROR',
    );
  },

  /**
   * Send Message
   *
   * Sends a text message within an active chat session.
   *
   * @async
   * @param {string} sessionId - The ID of the active chat session
   * @param {string} text - The message text to send
   * @returns {Promise<ChatMessage>} The sent message with metadata
   * @throws {ChatError} With code 'MESSAGE_ERROR' if message sending fails
   */
  async sendMessage(sessionId: string, text: string): Promise<ChatMessage> {
    const { data } = await apiCall<ChatMessage>(
      `/api/v1/chat/session/${sessionId}/message`,
      {
        method: 'POST',
        body: JSON.stringify({ text }),
      },
      'MESSAGE_ERROR',
    );
    return data;
  },

  /**
   * Get Messages
   *
   * Retrieves the message history for a specific chat session.
   *
   * @async
   * @param {string} sessionId - The ID of the chat session
   * @returns {Promise<ChatMessage[]>} Array of messages in the conversation
   * @throws {ChatError} With code 'MESSAGE_ERROR' if retrieval fails
   */
  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    const { data } = await apiCall<ChatMessage[]>(
      `/api/v1/chat/session/${sessionId}/messages`,
      { method: 'GET' },
      'MESSAGE_ERROR',
    );
    return data;
  },

  /**
   * Get Business Hours
   *
   * Retrieves and processes business hours information for a specific plan.
   * Transforms the special format (DAY_DAY_HOUR_HOUR) into a structured BusinessHours object.
   *
   * @async
   * @param {string} planId - The plan identifier to check business hours for
   * @returns {Promise<BusinessHours>} Structured business hours information
   * @throws {ChatError} With code 'HOURS_CHECK_FAILED' if processing fails
   */
  async getBusinessHours(planId: string): Promise<BusinessHours> {
    try {
      const chatInfo = await this.getChatInfo(planId);
      // Parse working hours string to business hours format
      const hours = parseWorkingHours(chatInfo.workingHours);
      // Make sure we have all required BusinessHours properties
      const businessHours: BusinessHours = {
        isOpen24x7: hours.isOpen24x7,
        days: hours.days.map((day) => ({
          day: day.day || '',
          openTime: day.openTime || '',
          closeTime: day.closeTime || '',
          isOpen: day.isOpen || false,
        })),
        timezone: hours.timezone,
        isCurrentlyOpen: hours.isCurrentlyOpen,
        lastUpdated: hours.lastUpdated,
        source: hours.source,
      };
      return businessHours;
    } catch (error) {
      throw new ChatError(
        'Failed to process business hours',
        'HOURS_CHECK_FAILED',
        'error',
        { planId },
      );
    }
  },

  /**
   * Check Eligibility
   *
   * Comprehensive eligibility check that determines if a user can access chat services.
   * Maps the API response to a detailed UserEligibility object with all required properties.
   *
   * @async
   * @param {string} memberId - The member's unique identifier
   * @returns {Promise<UserEligibility>} Detailed eligibility information
   * @throws {ChatError} With code 'ELIGIBILITY_CHECK_FAILED' if check fails
   */
  async checkEligibility(memberId: string): Promise<UserEligibility> {
    try {
      const chatInfo = await this.getChatInfo(memberId);

      // Map the chat info response to our UserEligibility interface
      const eligibility: UserEligibility = {
        isChatEligibleMember: chatInfo.chatBotEligibility,
        routingchatbotEligible: chatInfo.routingChatBotEligibility,
        isChatAvailable: chatInfo.chatAvailable,
        // Additional fields would be populated from other sources or defaults
        isDemoMember: false,
        isAmplifyMem: false,
        groupId: '',
        memberClientID: '',
        getGroupType: '',
        isBlueEliteGroup: false,
        isMedical: false,
        isDental: false,
        isVision: false,
        isWellnessOnly: false,
        isCobraEligible: false,
        chatHours: '',
        rawChatHours: '',
        isChatbotEligible: chatInfo.chatBotEligibility,
        memberMedicalPlanID: '',
        isIDCardEligible: false,
        memberDOB: '',
        subscriberID: '',
        sfx: '',
        memberFirstname: '',
        memberLastName: '',
        userID: '',
      };

      return eligibility;
    } catch (error) {
      throw new ChatError(
        'Failed to check eligibility',
        'ELIGIBILITY_CHECK_FAILED',
        'error',
        { memberId },
      );
    }
  },

  /**
   * Get Plan Details
   *
   * Retrieves detailed information about a specific plan.
   *
   * @async
   * @param {string} planId - The plan identifier
   * @returns {Promise<ChatPlan>} Plan details
   * @throws {ChatError} With code 'PLAN_NOT_FOUND' if plan doesn't exist
   */
  async getPlanDetails(planId: string): Promise<ChatPlan> {
    const { data } = await apiCall<ChatPlan>(
      `/api/v1/chat/plan/${planId}`,
      { method: 'GET' },
      'PLAN_NOT_FOUND',
    );
    return data;
  },

  /**
   * Start Cobrowse Session
   *
   * Initiates a co-browsing session for an active chat conversation,
   * allowing agents to view and interact with the user's screen.
   *
   * @async
   * @param {string} sessionId - The ID of the active chat session
   * @returns {Promise<{token: string}>} Token for the cobrowse session
   * @throws {ChatError} With code 'COBROWSE_INIT_ERROR' if initialization fails
   */
  async startCobrowse(sessionId: string): Promise<{ token: string }> {
    const { data } = await apiCall<{ token: string }>(
      `/api/v1/chat/session/${sessionId}/cobrowse`,
      { method: 'POST' },
      'COBROWSE_INIT_ERROR',
    );
    return data;
  },

  /**
   * End Cobrowse Session
   *
   * Terminates an active co-browsing session.
   *
   * @async
   * @param {string} sessionId - The ID of the chat session with an active cobrowse
   * @returns {Promise<void>}
   * @throws {ChatError} With code 'COBROWSE_END_ERROR' if termination fails
   */
  async endCobrowse(sessionId: string): Promise<void> {
    await apiCall<void>(
      `/api/v1/chat/session/${sessionId}/cobrowse`,
      { method: 'DELETE' },
      'COBROWSE_END_ERROR',
    );
  },

  /**
   * Send Email
   *
   * Sends an email message related to a chat session.
   * Used for following up on conversations or sending additional information.
   *
   * @async
   * @param {string} sessionId - The ID of the related chat session
   * @param {Object} emailRequest - Email request details
   * @param {string} emailRequest.memberEmail - Recipient email address
   * @param {string} emailRequest.message - Email content
   * @param {string} [emailRequest.category] - Optional email category
   * @param {string} [emailRequest.contactNumber] - Optional contact number
   * @returns {Promise<void>}
   * @throws {ChatError} With code 'EMAIL_SEND_ERROR' if sending fails
   * @userStory ID: 31146 - Chat Data Payload Refresh for Switched Plans
   */
  async sendEmail(
    sessionId: string,
    emailRequest: {
      memberEmail: string;
      message: string;
      category?: string;
      contactNumber?: string;
    },
  ): Promise<void> {
    await apiCall<void>(
      `/memberservice/api/v1/contactusemail`,
      {
        method: 'POST',
        body: JSON.stringify(emailRequest),
      },
      'EMAIL_SEND_ERROR',
    );
  },

  /**
   * Get Email
   *
   * Retrieves the primary email address associated with a plan.
   *
   * @async
   * @param {string} planId - The plan identifier
   * @returns {Promise<string>} The associated email address
   * @throws {ChatError} With code 'EMAIL_FETCH_ERROR' if retrieval fails
   */
  async getEmail(planId: string): Promise<string> {
    const { data } = await apiCall<{ email: string }>(
      `/memberContactPreference?memberKey=${planId}`,
      { method: 'GET' },
      'EMAIL_FETCH_ERROR',
    );
    return data.email;
  },

  /**
   * Get Phone Attributes
   *
   * Retrieves phone number and operating hours for a specific member.
   * Used to display contact information when chat is unavailable.
   *
   * @async
   * @param {string} groupId - The group identifier
   * @param {string} subscriberCk - The subscriber check key
   * @returns {Promise<Object>} Phone number and operating hours
   * @returns {string} return.memberServicePhoneNumber - The phone number
   * @returns {string} return.operatingHours - The operating hours
   * @throws {ChatError} With code 'PHONE_FETCH_ERROR' if retrieval fails
   * @userStory ID: 31146 - Chat Data Payload Refresh for Switched Plans
   */
  async getPhoneAttributes(
    groupId: string,
    subscriberCk: string,
  ): Promise<{
    memberServicePhoneNumber: string;
    operatingHours: string;
  }> {
    const { data } = await apiCall<{
      memberServicePhoneNumber: string;
      operatingHours: string;
    }>(
      `/OperationHours?groupId=${groupId}&subscriberCk=${subscriberCk}&effectiveDetials=true`,
      { method: 'GET' },
      'PHONE_FETCH_ERROR',
    );
    return data;
  },

  /**
   * Determine if chat should use cloud or on-premises implementation
   *
   * Examines the chat info response to decide which chat implementation
   * should be used for this member.
   *
   * @param {ChatInfoResponse} chatInfo - Chat eligibility information
   * @returns {boolean} true if cloud chat should be used, false for on-premises
   */
  isCloudChatEligible(chatInfo: ChatInfoResponse): boolean {
    return chatInfo.cloudChatEligible;
  },
};
