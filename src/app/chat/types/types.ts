/**
 * Chat System Types
 */

// Message Types
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// Business Hours Types
export interface BusinessDay {
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  isHoliday?: boolean;
  holidayName?: string;
}

export interface BusinessHours {
  isOpen24x7: boolean;
  days: BusinessDay[];
  timezone: string;
  isCurrentlyOpen: boolean;
  lastUpdated: number;
  source: 'default' | 'api' | 'legacy';
}

// Plan Types
export interface PlanInfo {
  id: string;
  name: string;
  groupId: string;
  memberId: string;
  memberFirstname?: string;
  memberLastname?: string;
  businessHours: BusinessHours;
  isEligibleForChat: boolean;
  lineOfBusiness: string;
  termsAndConditions?: string;
  isActive: boolean;
  lobGroup?: string;
  isMedicalEligible?: boolean;
  isDentalEligible?: boolean;
  isVisionEligible?: boolean;
}

// Alias ChatPlan to PlanInfo for backward compatibility
export type ChatPlan = PlanInfo;

// Session Types
export interface ChatSessionJWT {
  token?: string;
  userID?: string;
  userRole?: string;
  planId: string;
  groupId?: string;
  subscriberId?: string;
  currUsr?: {
    umpi: string;
    role: string;
    firstName: string;
    lastName: string;
    plan?: {
      memCk: string;
      grpId: string;
      subId: string;
    };
  };
}

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
  startTime?: string;
  endTime?: string | null;
  status?: 'active' | 'ended' | 'error';
  config?: ChatConfig;
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark';
    fontSize: 'small' | 'medium' | 'large';
  };
  plan: ChatPlan;
}

// User Eligibility Types
export interface ChatEligibility {
  isEligible: boolean;
  reason?: string;
}

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
}

// Chat Payload Type
export interface ChatPayload {
  SERV_Type: string;
  firstname: string;
  RoutingChatbotInteractionId: string;
  PLAN_ID: string;
  lastname: string;
  GROUP_ID: string;
  IDCardBotName?: string;
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
  email?: string;
}

// Cobrowse Types
export interface CobrowseSession {
  id: string;
  active: boolean;
  url: string;
  code?: string;
}

// Configuration Types
export interface ChatConfig {
  token: string;
  endPoint: string;
  demoEndPoint?: string;
  opsPhone: string;
  opsPhoneHours?: string;
  userID: string;
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

// Provider Interface
export interface ChatProvider {
  initialize(options: ChatInitOptions | GenesysUserData): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(text: string): Promise<string>;
  getSessionId(): Promise<string>;
  updateConfiguration?(config: Partial<UnifiedChatConfig>): Promise<void>;
}

export interface WebMessagingProvider extends ChatProvider {
  initialize(data: GenesysUserData): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(text: string): Promise<string>;
  getSessionId(): Promise<string>;
  updateConfiguration(
    config: Partial<GenesysWebMessagingConfig>,
  ): Promise<void>;
}

export interface LegacyOnPremProvider extends ChatProvider {
  initialize(options: ChatInitOptions): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(text: string): Promise<string>;
  getSessionId(): Promise<string>;
}

// Legacy Provider Types
export interface LegacyOnPremConfig extends BaseChatConfig {
  type: 'legacy';
  endPoint: string;
  opsPhone: string;
  planName: string;
  token: string;
}

// Base configuration interface for all chat providers
export interface BaseChatConfig {
  planId: string;
  groupId: string;
  memberId: string;
  memberFirstname: string;
  memberLastname: string;
  businessHours: BusinessHours;
  environment: 'development' | 'staging' | 'production';
}

// Unified chat configuration type
export type UnifiedChatConfig = LegacyOnPremConfig | GenesysWebMessagingConfig;

// Chat initialization options
export interface ChatInitOptions {
  config: UnifiedChatConfig;
  jwt: ChatSessionJWT;
  userInfo: {
    email?: string;
    firstName: string;
    lastName: string;
  };
}

// Genesys Web Messenger Types
export interface GenesysWebMessagingConfig {
  deploymentId: string;
  region: string;
  token?: string;
  endPoint?: string;
  planId?: string;
  planName?: string;
}

export interface GenesysMessenger {
  startConversation: () => Promise<void>;
  endConversation: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
}

// User data types
export interface GenesysUserData {
  config: {
    deploymentId: string;
    region: string;
    planId?: string;
  };
  userInfo: {
    firstName: string;
    lastName: string;
    customFields?: {
      planId: string;
      groupId: string;
      lob?: string;
      lobGroup?: string;
      isMedical: string;
      isDental: string;
      isVision: string;
    };
  };
  SERV_Type?: 'MemberPortal';
  INQ_TYPE?: 'MEM';
  RoutingChatbotInteractionId?: string;
  Origin?: 'portal' | 'web';
  Source?: 'web' | 'MemberPortal';
}

export interface GenesysTheme {
  primaryColor: string;
  accentColor: string;
}

export interface GenesysPosition {
  enable: boolean;
  centerX: boolean;
  centerY: boolean;
  bottom: string;
  right: string;
}

export interface GenesysSize {
  width: string;
  height: string;
}

export interface GenesysStyling {
  primaryColor: string;
  fontFamily: string;
}

export interface GenesysFeatures {
  attachments: boolean;
  emojis: boolean;
  typingIndicator: boolean;
}

export interface GenesysI18n {
  defaultLocale: string;
  fallbackLocale: string;
  enableAutomaticLocaleDetection: boolean;
}

export interface GenesysLogging {
  logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
}

export interface GenesysSecurity {
  enableTokenAuth: boolean;
  tokenRefreshInterval: number;
}

export interface GenesysReconnection {
  maxAttempts: number;
  timeoutMs: number;
  backoffMultiplier: number;
}

// Widget configuration types
export interface GenesysWidgetConfig {
  dataURL: string;
  userData: Partial<GenesysUserData>;
  containerEl: HTMLDivElement;
  headerConfig: {
    title: string;
    closeButton?: boolean;
    minimizeButton?: boolean;
  };
  styling: {
    primaryColor: string;
    fontFamily: string;
    theme?: 'light' | 'dark';
  };
  features: {
    enableFileUpload: boolean;
    enableEmoji: boolean;
    enableTypingIndicator: boolean;
    confirmFormCloseEnabled?: boolean;
    actionsMenu?: boolean;
    maxMessageLength?: number;
  };
  autoInvite?: {
    enabled: boolean;
    timeToInviteSeconds: number;
    inviteTimeoutSeconds: number;
  };
  chatButton?: {
    enabled: boolean;
    effect: 'fade' | 'slide';
    openDelay: number;
    effectDuration: number;
    hideDuringInvite: boolean;
  };
  async?: {
    enabled: boolean;
    newMessageRestoreState: 'minimized' | 'maximized';
  };
  logging: {
    logLevel: 'ERROR' | 'DEBUG' | 'INFO' | 'WARN';
    isEnabled: boolean;
  };
  ariaIdleAlertIntervals?: number[];
  ariaCharRemainingIntervals?: number[];
  broadcast?: {
    enabled: boolean;
    messageDelay: number;
    messageTypes: Array<'system' | 'agent' | 'supervisor'>;
  };
}

export interface GenesysHeaderConfig {
  title: string;
}

export interface GenesysChat {
  createChatWidget: (config: GenesysWidgetConfig) => Promise<void>;
  updateUserData: (
    data: Record<string, string | number | boolean>,
  ) => Promise<void>;
  endSession: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  on: (event: string, callback: (data: GenesysChatEvent) => void) => void;
  off: (event: string, callback: (data: GenesysChatEvent) => void) => void;
}

export interface GenesysGlobal {
  Chat: GenesysChat;
  WebMessenger?: {
    createWebMessenger: (config: any) => any;
    destroy: () => void;
  };
}

export interface GenesysWindow {
  Genesys: GenesysGlobal;
}

export interface GenesysMessengerConfig {
  deploymentId: string;
  region: string;
  messenger: {
    features: {
      enableCustomHeader: boolean;
      enableExpandedTextInput: boolean;
      enableFileUpload: boolean;
      enableEmojiPicker: boolean;
    };
    styles: {
      primaryColor: string;
      customHeaderTemplate: string;
    };
  };
  callbacks: {
    onReady: () => void;
    onError: (error: Error) => void;
    onMessage: (message: unknown) => void;
    onDisconnect: () => void;
  };
  customAttributes: {
    planId: string;
    groupId: string;
    memberId: string;
    lineOfBusiness: string;
  };
}

// Chat event types
export interface GenesysChatEvent {
  type: string;
  data: {
    type: string;
    text: string;
    timestamp: number;
    from: {
      type: string;
      nickname: string;
      id: string;
    };
    message?: string;
  };
}

// BCBST-specific types
export interface ChatInfo {
  chatGroup: string;
  workingHours: string;
  chatIDChatBotName: string;
  chatBotEligibility: boolean;
  routingChatBotEligibility: boolean;
  chatAvailable: boolean;
  cloudChatEligible: boolean;
}

export const ChatErrorCodes = {
  INITIALIZATION_ERROR: 'INITIALIZATION_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  MESSAGE_ERROR: 'MESSAGE_ERROR',
  CHAT_START_ERROR: 'CHAT_START_ERROR',
  CHAT_END_ERROR: 'CHAT_END_ERROR',
  PLAN_SWITCH_ERROR: 'PLAN_SWITCH_ERROR',
  NOT_INITIALIZED: 'NOT_INITIALIZED',
  DISCONNECT_ERROR: 'DISCONNECT_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  NOT_ELIGIBLE: 'NOT_ELIGIBLE',
  OUTSIDE_BUSINESS_HOURS: 'OUTSIDE_BUSINESS_HOURS',
  HOURS_CHECK_FAILED: 'HOURS_CHECK_FAILED',
  ELIGIBILITY_CHECK_FAILED: 'ELIGIBILITY_CHECK_FAILED',
  PLAN_NOT_FOUND: 'PLAN_NOT_FOUND',
  INVALID_STATE: 'INVALID_STATE',
  COBROWSE_INIT_ERROR: 'COBROWSE_INIT_ERROR',
  COBROWSE_END_ERROR: 'COBROWSE_END_ERROR',
  TERMS_FETCH_ERROR: 'TERMS_FETCH_ERROR',
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  EMAIL_SEND_ERROR: 'EMAIL_SEND_ERROR',
  EMAIL_FETCH_ERROR: 'EMAIL_FETCH_ERROR',
  PHONE_FETCH_ERROR: 'PHONE_FETCH_ERROR',
  CHAT_GROUPS_ERROR: 'CHAT_GROUPS_ERROR',
} as const;

export type ChatErrorCode = keyof typeof ChatErrorCodes;
export type ErrorSeverity = 'error' | 'warning';

export class ChatError extends Error {
  constructor(
    message: string,
    public code: ChatErrorCode,
    public severity: ErrorSeverity = 'error',
  ) {
    super(message);
    this.name = 'ChatError';
  }
}

export interface GenesysWebChat {
  ready: () => Promise<void>;
  startChat: () => Promise<void>;
  endChat: () => Promise<void>;
  on: (event: string, handler: (event: GenesysChatEvent) => void) => void;
  off: (event: string, handler: (event: GenesysChatEvent) => void) => void;
}

declare global {
  interface Window {
    _genesys?: {
      widgets?: {
        webchat?: GenesysWebChat;
      };
    };
  }
}
