/**
 * Chat System Types
 *
 * This file contains all consolidated TypeScript interfaces and types used throughout the chat system.
 * Types are organized with prefixes for better organization and to avoid naming conflicts.
 */

/**
 * Message related types
 */

/**
 * Basic chat message interface
 */
export interface ChatMessage {
  id: string;
  content: string;
  text?: string; // For backward compatibility
  sender: 'user' | 'agent' | 'system' | 'bot';
  timestamp: string | Date | number; // Support multiple timestamp formats
}

/**
 * Session related types
 */

/**
 * JWT information for chat sessions
 */
export interface ChatSessionJWT {
  // Core session data from AuthJS
  token?: string;
  userID?: string;
  userRole?: string;

  // Plan-specific data
  planId: string;
  groupId?: string;
  subscriberId?: string;

  // Additional user data
  currUsr?: {
    umpi: string;
    role: string;
    plan?: {
      memCk: string;
      grpId: string;
      subId: string;
    };
  };
}

/**
 * Chat session state
 */
export interface ChatSession {
  id: string;
  active?: boolean;
  agentId?: string;
  agentName?: string;
  startTime?: string;
  endTime?: string | null;
  status?: 'active' | 'ended' | 'error';
  messages?: ChatMessage[];
  planId?: string;
  planName?: string;
  isPlanSwitchingLocked?: boolean;
  jwt?: ChatSessionJWT;
  lastUpdated?: number;
}

/**
 * Chat session initialization options
 */
export interface ChatSessionInitOptions {
  planId: string;
  jwt: ChatSessionJWT;
  userInfo: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

/**
 * Chat payload for API requests
 */
export interface ChatPayload {
  memberClientID: string;
  userID: string;
  planId: string;
  message?: string;
}

/**
 * Co-browsing related types
 */

/**
 * Co-browse session state
 */
export type CobrowseState = 'inactive' | 'pending' | 'active';

/**
 * Co-browse session information
 */
export interface CobrowseSession {
  id: string;
  active: boolean;
  url: string;
  code?: string;
}

/**
 * Co-browse initialization response
 */
export interface CobrowseInitResponse {
  success: boolean;
  error?: string;
}

/**
 * Co-browse session creation response
 */
export interface CobrowseSessionResponse {
  sessionId: string;
  code: string;
  url?: string;
}

/**
 * Co-browse configuration
 */
export interface CobrowseConfig {
  license: string;
  endPoint?: string;
  redactedElements?: string[];
  customData?: Record<string, string>;
}

/**
 * Business hours related types
 */

/**
 * Business day configuration
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
 * Business hours configuration
 */
export interface BusinessHours {
  isOpen24x7: boolean;
  days: BusinessDay[];
  timezone?: string;
  isCurrentlyOpen?: boolean;
  nextOpeningTime?: string;
  lastUpdated?: number;
  source?: 'api' | 'legacy' | 'default';
}

/**
 * Plan related types
 */

/**
 * Plan information
 */
export interface PlanInfo {
  id: string;
  name: string;
  isEligibleForChat: boolean;
  businessHours: BusinessHours;
  termsAndConditions?: string;
}

/**
 * Plan switcher state
 */
export interface PlanSwitcherState {
  isPlanSwitcherLocked: boolean;
  currentPlan: PlanInfo | null;
  lockPlanSwitcher: () => void;
  unlockPlanSwitcher: () => void;
  updateCurrentPlan: (plan: PlanInfo) => void;
}

/**
 * User eligibility related types
 */

/**
 * User eligibility for chat
 */
export interface ChatEligibility {
  isEligible: boolean;
  reason?: string;
}

/**
 * Detailed user eligibility information
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
  RoutingChatbotInteractionId?: string;
  coverage_eligibility?: string;
  lob_group?: string;
  Origin?: string;
  Source?: string;
}

/**
 * Chat configuration related types
 */
export interface ChatConfig {
  token: string;
  endPoint: string;
  demoEndPoint?: string;
  opsPhone: string;
  memberFirstname: string;
  memberLastname: string;
  memberId: string;
  groupId: string;
  planId: string;
  planName: string;
  businessHours: BusinessHours;
  cobrowseSource?: string;
  cobrowseURL?: string;
  coBrowseLicence?: string;
  // Additional fields
  SERV_Type?: string;
  RoutingChatbotInteractionId?: string;
  PLAN_ID?: string;
  GROUP_ID?: string;
  IDCardBotName?: string;
  IsVisionEligible?: boolean;
  MEMBER_ID?: string;
  coverage_eligibility?: string;
  INQ_TYPE?: string;
  IsDentalEligible?: boolean;
  MEMBER_DOB?: string;
  LOB?: string;
  lob_group?: string;
  IsMedicalEligibile?: boolean;
  Origin?: string;
  Source?: string;
}

/**
 * Chat state related types
 */
export interface ChatState {
  // UI State
  isOpen: boolean;
  isPlanSwitcherLocked: boolean;
  showPlanSwitcherMessage: boolean;
  showCobrowseConsent: boolean;
  cobrowseSessionCode: string | null;
  isLoading?: boolean;
  isSending?: boolean;
  error?: string | null;

  // Messages State
  messages: ChatMessage[];

  // Session State
  session: ChatSession | null;
  isInitializing: boolean;
  isWithinBusinessHours: boolean;

  // Plan Switching State
  currentPlan: PlanInfo;
  availablePlans: PlanInfo[];
  isPlanSwitcherOpen: boolean;
}

/**
 * Test-related types
 */
export interface TestChatWidgetProps {
  isOpen: boolean;
  isEligible: boolean;
  isWithinBusinessHours: boolean;
  userEligibility: UserEligibility;
  config: ChatConfig;
  currentPlan: PlanInfo;
  availablePlans: PlanInfo[];
}
