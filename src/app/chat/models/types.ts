/**
 * Basic chat message type
 */
export interface ChatMessage {
  id?: string;
  text: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp?: number;
}

/**
 * Chat session information
 */
export interface ChatSession {
  id: string;
  active: boolean;
  agentName?: string;
  messages: ChatMessage[];
}

/**
 * Chat configuration settings
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
}

/**
 * Business hours configuration
 */
export interface BusinessHours {
  isOpen24x7: boolean;
  days: BusinessDay[];
}

/**
 * Business day configuration
 */
export interface BusinessDay {
  day: string;
  openTime: string;
  closeTime: string;
}

/**
 * Chat dropdown option
 */
export interface ChatOption {
  text: string;
  value: string;
  disabled?: boolean;
  selected?: boolean;
}

/**
 * User eligibility for chat
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
 * Co-browse session state
 */
export type CobrowseState = 'inactive' | 'pending' | 'active';
