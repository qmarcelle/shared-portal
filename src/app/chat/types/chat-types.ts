/**
 * CONSOLIDATED CHAT TYPE DEFINITIONS
 *
 * This file contains ALL type definitions for the chat integration.
 * It serves as a single source of truth for chat-related types.
 */

/**
 * Enum representing the script loading phase for the Genesys chat widget.
 * Used for tracking and debugging script load state in the chat store.
 */
export enum ScriptLoadPhase {
  INIT = 'INIT',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  ERROR = 'ERROR',
}

/**
 * Enum representing the chat widget status
 */
export enum ChatWidgetStatus {
  UNINITIALIZED = 'UNINITIALIZED',
  INITIALIZING = 'INITIALIZING',
  READY = 'READY',
  ERROR = 'ERROR',
  UNAVAILABLE = 'UNAVAILABLE',
}

/**
 * Enum representing the chat button status
 */
export enum ChatButtonStatus {
  NOT_ATTEMPTED = 'not-attempted',
  CREATING = 'creating',
  CREATED = 'created',
  FAILED = 'failed',
}

/**
 * Interface for CXBus ready event
 */
export interface CXBusReadyEvent extends CustomEvent {
  detail: {
    CXBus: CXBus;
  };
}
// ... (Enums remain the same) ...

// export interface CXBusReadyEvent extends CustomEvent {
//   detail: {
//     CXBus: GenesysCXBus; // Often the CXBus instance is the specific GenesysCXBus
//   };
// }

export interface CXBus {
  // Generic/Base CXBus definition
  command: (command: string, ...args: any[]) => any;
  subscribe: (event: string, callback: (...args: any[]) => void) => void;
  unsubscribe: (event: string) => void;
  registerPlugin: (pluginName: string) => {
    subscribe: (event: string, callback: (...args: any[]) => void) => void;
  };
}

// ... (GenesysWidgets, GenesysGlobal remain largely the same, consider FormInputConfig if applicable) ...
// For GenesysWidgets.webchat.form.inputs, using Array<Record<string, any>> is a bit safer than Array<any>
// if you don't want to define a full FormInputConfig yet.
// e.g., inputs?: Array<Record<string, any>>;

// export interface BaseGenesysChatConfig {
//   chatMode?: 'legacy' | 'cloud';
//   isChatAvailable: string | boolean;
//   isChatEligibleMember: string | boolean;
//   targetContainer?: string;
//   cloudChatEligible?: string | boolean;
//   firstname?: string;
//   lastname?: string;
//   formattedFirstName?: string;
//   userID?: string;
//   memberMedicalPlanID?: string;
//   isDemoMember?: string | boolean;
//   isAmplifyMem?: string | boolean;
//   isCobrowseActive?: string | boolean;
//   chatHours?: string;
//   rawChatHrs?: string;
//   selfServiceLinks?: Array<{ key: string; value: string }>; // Made more specific
//   [key: string]: any;
// }

// ... (LegacyChatConfig, CloudChatConfig, type guards, ChatSettings, GenesysChatConfig, GenesysChat remain the same) ...

/**
 * GenesysCXBus interface - Represents the specific CXBus instance used by Genesys in this app
 * (e.g., window._genesysCXBus)
 */
// export interface GenesysCXBus {
//   command: (command: string, params?: any) => void; // Specific signature if _genesysCXBus.command returns void
//   subscribe: (event: string, callback: (...args: any[]) => void) => void;
//   unsubscribe: (event: string) => void; // Added unsubscribe
//   registerPlugin: (pluginName: string) => {
//     subscribe: (event: string, callback: (...args: any[]) => void) => void;
//   };
// }

// ... (ChatDiagnostics remains the same) ...

// export interface GenesysWindow {
//   // Assumes this augments global Window
//   CXBus?: CXBus; // A generic CXBus reference, if needed separately
//   _genesys?: GenesysGlobal;
//   _genesysCXBus?: GenesysCXBus; // The specific instance from click_to_chat.js
//   _genesysCXBusReady?: boolean;
//   _gt?: any[];
//   Genesys?: (command: string, ...args: any[]) => any; // Cloud Messenger's typical global

//   chatSettings?: ChatSettings;
//   GenesysChat?: GenesysChat;

//   _forceChatButtonCreate?: () => boolean;
//   forceCreateChatButton?: () => boolean; // Corrected return type & primary name

//   // ... (other window properties remain the same) ...
//   gmsServicesConfig?: {
//     GMSChatURL: () => string;
//   };
// }

/**
 * CXBus interface - Handles communication with Genesys widget
 */
// Duplicate CXBus definition removed

/**
 * GenesysWidgets interface - Configuration for Genesys widgets
 */
export interface GenesysWidgets {
  webchat: {
    chatButton?: {
      enabled: boolean;
      openDelay: number;
      effectDuration: number;
      hideDuringInvite: boolean;
      template: string;
    };
    position?: {
      bottom: { px: number };
      right: { px: number };
      width: { pct: number };
      height: { px: number };
    };
    userData?: Record<string, string>;
    form?: {
      inputs?: Array<any>;
    };
    [key: string]: any;
  };
  main?: {
    debug?: boolean;
    theme?: string;
    lang?: string;
    mobileMode?: string;
    plugins?: string[];
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * GenesysGlobal interface - Global Genesys object structure
 */
export interface GenesysGlobal {
  widgets: GenesysWidgets;
  loaded?: boolean;
  [key: string]: any;
}

/**
 * Base configuration fields common to both Legacy and Cloud Genesys chat.
 */
export interface BaseGenesysChatConfig {
  chatMode: 'legacy' | 'cloud'; // Discriminator property
  userID: string;
  memberFirstname?: string;
  memberLastName?: string;
  formattedFirstName?: string; // Often same as memberFirstname
  subscriberID?: string;
  sfx?: string;
  groupId?: string;
  memberClientID?: string; // Or network ID, LOB from plan, etc.
  groupType?: string;
  memberMedicalPlanID?: string; // Current plan's ID for chat context
  memberDOB?: string;

  chatGroup?: string; // Added: For routing or grouping chats

  // Eligibility & Availability
  isChatEligibleMember: boolean | string; // Should eventually be boolean
  isChatAvailable: boolean | string; // Should eventually be boolean
  chatbotEligible?: boolean | string;
  routingchatbotEligible?: boolean | string;

  // UI/Display
  chatHours?: string; // Display string for chat hours, e.g., "M-F 8am-5pm"
  rawChatHrs?: string; // For logic, e.g., '8_17'
  workingHours?: string; // For Genesys config, e.g. 'S_S_24', 'M_F_8_17'
  targetContainer: string; // HTML element ID for widget injection
  audioAlertPath?: string;

  // Data to pass to the widget
  userData?: Record<string, string | number | boolean>;
  LOB?: string; // Line of Business
  INQ_TYPE?: string; // Inquiry Type
  MEMBER_ID?: string; // Usually composite like subscriberID-sfx

  // Informational for application logic
  numberOfPlans?: number;
  currentPlanName?: string;
  timestamp?: string; // For debugging/tracing

  // Feature flags/context
  isDemoMember?: boolean | string;
  isAmplifyMem?: boolean | string;
  isCobrowseActive?: boolean | string; // General co-browse feature flag

  // Co-browse specific configuration (can be common)
  coBrowseLicence?: string;
  cobrowseSource?: string;
  cobrowseURL?: string;
  coBrowseEndpoint?: string; // App's backend endpoint for CoBrowse actions

  // Contact/Support Info
  opsPhone?: string;
  opsPhoneHours?: string;
  selfServiceLinks?: { key: string; value: string }[];

  // Other contextual flags
  isBlueEliteGroup?: boolean | string;
  idCardChatBotName?: string;
  isDental?: boolean | string;
  isMedical?: boolean | string;
  isVision?: boolean | string;
  isWellnessOnly?: boolean | string;
  isCobraEligible?: boolean | string;
  isIDCardEligible?: boolean | string;
}

/**
 * Legacy specific chat configuration
 */
export interface LegacyChatConfig extends BaseGenesysChatConfig {
  chatMode: 'legacy';

  // Essential for legacy mode
  clickToChatToken: string;
  clickToChatEndpoint: string; // Main endpoint for chat communication
  gmsChatUrl: string; // Often same as clickToChatEndpoint or a base URL for GMS services

  // Script URLs (legacy specific)
  widgetUrl: string; // Path to widgets.min.js
  clickToChatJs: string; // Path to click_to_chat.js

  // Optional legacy-specific fields
  clickToChatDemoEndPoint?: string;
  chatTokenEndpoint?: string; // App's backend endpoint to get/refresh clickToChatToken

  // Optional UI/Behavior for legacy button/widget (often set by click_to_chat.js defaults)
  chatBtnText?: string;
  chatWidgetTitle?: string;
  chatWidgetSubtitle?: string;
  enableCobrowse?: boolean; // If true, legacy cobrowse UI elements might be shown/initialized
  showChatButton?: boolean; // Explicitly control legacy button visibility via this config
}

/**
 * Cloud specific chat configuration
 */
export interface CloudChatConfig extends BaseGenesysChatConfig {
  chatMode: 'cloud';

  // Essential for cloud mode
  deploymentId: string;
  orgId: string;
  environment: string; // e.g., 'prod-usw2', 'mypurecloud.com'

  // Optional: Specific URL for Genesys Messenger SDK if not using snippet from Cloud UI
  genesysWidgetUrl?: string;
}

/**
 * Type guards for runtime checks
 */
export function isLegacyChatConfig(
  config:
    | GenesysChatConfig
    | Partial<GenesysChatConfig>
    | BaseGenesysChatConfig,
): config is LegacyChatConfig {
  return !!(
    config &&
    config.chatMode === 'legacy' &&
    typeof (config as LegacyChatConfig).clickToChatToken === 'string' &&
    typeof (config as LegacyChatConfig).clickToChatEndpoint === 'string'
  );
}

export function isCloudChatConfig(
  config:
    | GenesysChatConfig
    | Partial<GenesysChatConfig>
    | BaseGenesysChatConfig,
): config is CloudChatConfig {
  return !!(
    config &&
    config.chatMode === 'cloud' &&
    typeof (config as CloudChatConfig).deploymentId === 'string' &&
    typeof (config as CloudChatConfig).orgId === 'string'
  );
}

/**
 * ChatSettings interface - Configuration passed to click_to_chat.js via window.chatSettings
 * This is specifically the LegacyChatConfig because click_to_chat.js is for legacy.
 */
export type ChatSettings = LegacyChatConfig;

/**
 * GenesysChatConfig interface - Unified configuration type for Genesys chat integration.
 * It's a discriminated union based on chatMode.
 */
export type GenesysChatConfig = LegacyChatConfig | CloudChatConfig;

/**
 * Interface for GenesysChat public API exposed to window
 */
export interface GenesysChat {
  openChat?: () => void;
  closeChat?: () => void;
  showButton?: () => void;
  hideButton?: () => void;
  startCoBrowse?: () => void;
  [key: string]: any;
}

/**
 * GenesysCXBus interface - CXBus reference exposed by click_to_chat.js
 */
export interface GenesysCXBus extends CXBus {
  subscribe: (event: string, callback: (...args: any[]) => void) => void;
  command: (command: string, params?: any) => void;
  registerPlugin: (pluginName: string) => {
    subscribe: (event: string, callback: (...args: any[]) => void) => void;
  };
}

/**
 * Chat diagnostics interface for development troubleshooting
 */
export interface ChatDiagnostics {
  getState: () => {
    scriptLoaded: boolean;
    cxBusReady: boolean;
    chatMode: string;
    config: any;
    chatLoadingState: any;
    domState: {
      scriptElement: boolean;
      cssElements: boolean[];
      chatButton: boolean;
      widgetContainer: boolean;
    };
  };
  forceButtonCreate: () => boolean;
  logCXBusState: () => void;
}

/**
 * Window extensions for Genesys
 */
export interface GenesysWindow {
  // Genesys globals
  CXBus?: CXBus;
  _genesys?: GenesysGlobal;
  _genesysCXBus?: GenesysCXBus;
  _genesysCXBusReady?: boolean;
  _gt?: any[];
  Genesys?: (command: string, ...args: any[]) => any;

  // Configuration
  chatSettings?: ChatSettings;

  // Public API
  GenesysChat?: GenesysChat;

  // Helper functions
  openGenesysChat?: () => void;

  // Script loading state flags
  _genesysScriptAlreadyAttempted?: boolean;
  _genesysButtonCheckTimeout?: boolean;
  _genesysButtonCreationInProgress?: boolean;
  _genesysScriptLoadExplicitlyInProgress?: boolean;
  _genesysWidgetsInitializationInProgress?: boolean;
  _genesysLastCXBusCommandTime?: number;
  _genesysScriptLoadingState?: {
    widgetsScriptLoaded: boolean;
    widgetsScriptFailed: boolean;
    initializedWidgets: boolean;
  };

  // ChatWidget instance tracking
  _chatWidgetInstanceId?: string;

  // Diagnostics (dev only)
  _chatDiagnostics?: ChatDiagnostics;

  // CoBrowse
  CobrowseIO?: any;

  // Service config (for backward compatibility)
  gmsServicesConfig?: {
    GMSChatURL: () => string;
  };
}
