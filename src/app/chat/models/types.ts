/**
 * Chat System Types
 *
 * This file contains all the TypeScript interfaces and types used throughout the chat system.
 * It defines the structure of:
 * - Messages
 * - Sessions
 * - Configuration
 * - Business Hours
 * - User Eligibility
 * - Error Handling
 */

import { ChatSessionJWT } from './session';

/**
 * Basic chat message type
 * Represents a single message in a chat conversation
 */
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: number;
}

/**
 * Chat session information
 * Tracks the state of an active chat session
 */
export interface ChatSession {
  id: string;
  active: boolean;
  agentName?: string;
  messages: ChatMessage[];
  planId: string;
  planName: string;
  isPlanSwitchingLocked: boolean;
  jwt: ChatSessionJWT;
  lastUpdated: number;
}

/**
 * Chat configuration settings
 * Required for initializing the Genesys chat widget
 */
export interface ChatConfig {
  endPoint: string;
  demoEndPoint: string;
  token: string;
  coBrowseLicence: string;
  cobrowseSource: string;
  cobrowseURL: string;
  opsPhone: string;
  opsPhoneHours: string;
  userID: string;
  memberFirstname: string;
  memberLastname: string;
  memberId: string;
  groupId: string;
  planId: string;
  planName: string;
  businessHours: BusinessHours;
  // Required fields from user stories
  SERV_Type: string;
  RoutingChatbotInteractionId: string;
  PLAN_ID: string;
  GROUP_ID: string;
  IDCardBotName: string;
  IsVisionEligible: boolean;
  MEMBER_ID: string;
  coverage_eligibility: string;
  INQ_TYPE: string;
  IsDentalEligible: boolean;
  MEMBER_DOB: string;
  LOB: string;
  lob_group: string;
  IsMedicalEligibile: boolean;
  Origin: string;
  Source: string;
}

/**
 * Business hours configuration
 * Defines when chat is available
 */
export interface BusinessHours {
  isOpen24x7: boolean;
  days: BusinessDay[];
  timezone: string;
  isCurrentlyOpen: boolean;
  nextOpeningTime?: string;
  lastUpdated: number;
  source: 'api' | 'legacy' | 'default';
}

/**
 * Business day configuration
 * Defines operating hours for a specific day
 */
export interface BusinessDay {
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  isHoliday?: boolean;
  holidayName?: string;
}

/**
 * Chat dropdown option
 * Used for chat-related UI selections
 */
export type ChatOption = {
  text: string;
  value: string;
  disabled?: boolean;
  selected?: boolean;
};

/**
 * User eligibility for chat
 * Determines if a user can access chat features
 */
export interface UserEligibility {
  isChatEligibleMember: boolean;
  isDemoMember: boolean;
  isAmplifyMem: boolean;
  groupId: string;
  memberClientID: string;
  getGroupType: string;
  isBlueEliteGroup: boolean;
  isMedical: boolean;
  isDental: boolean;
  isVision: boolean;
  isWellnessOnly: boolean;
  isCobraEligible: boolean;
  chatHours: string;
  rawChatHours: string;
  isChatbotEligible: boolean;
  memberMedicalPlanID: string;
  isIDCardEligible: boolean;
  memberDOB: string;
  subscriberID: string;
  sfx: string;
  memberFirstname: string;
  memberLastName: string;
  userID: string;
  isChatAvailable: boolean;
  routingchatbotEligible: boolean;
  idCardChatBotName?: string;

  // Added fields based on user stories
  RoutingChatbotInteractionId?: string;
  coverage_eligibility?: string;
  lob_group?: string;
  Origin?: string;
  Source?: string;
}

/**
 * Plan information for chat
 * Contains plan-specific chat settings
 */
export interface ChatPlan {
  id: string;
  name: string;
  isChatEligible: boolean;
  businessHours: BusinessHours;
  lineOfBusiness: string;
  termsAndConditions: string;
  isActive: boolean;
  // Additional properties for Genesys integration
  memberFirstname?: string;
  memberLastname?: string;
  memberId?: string;
  groupId?: string;
  lobGroup?: string;
  isMedicalEligible?: boolean;
  isDentalEligible?: boolean;
  isVisionEligible?: boolean;
  memberDob?: string;
}

/**
 * Co-browse session state
 * Tracks the state of a co-browsing session
 */
export type CobrowseState = 'inactive' | 'pending' | 'active';

/**
 * Co-browse session information
 * Contains details about an active co-browsing session
 */
export interface CobrowseSession {
  id: string;
  active: boolean;
  url: string;
}

/**
 * Chat error types
 * Standardized error format for chat-related errors
 */
export interface ChatError {
  code: string;
  message: string;
  isRecoverable: boolean;
}

/**
 * Chat state
 * Global state for the chat system
 */
export interface ChatState {
  isActive: boolean;
  isPlanSwitchingLocked: boolean;
  currentPlan: ChatPlan | null;
  availablePlans: ChatPlan[];
  businessHours: BusinessHours;
  eligibility: UserEligibility;
  error: ChatError | null;
}
