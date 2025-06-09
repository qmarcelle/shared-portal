/**
 * CONSOLIDATED CHAT TYPE DEFINITIONS
 *
 * This file contains ALL type definitions for the cloud-only chat integration.
 * Simplified from legacy/cloud union to cloud-only implementation.
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

export interface CXBus {
  // Generic/Base CXBus definition
  command: (command: string, ...args: unknown[]) => unknown;
  subscribe: (event: string, callback: (...args: unknown[]) => void) => void;
  unsubscribe: (event: string) => void;
  registerPlugin: (pluginName: string) => {
    subscribe: (event: string, callback: (...args: unknown[]) => void) => void;
  };
}

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
      inputs?: Array<unknown>;
    };
    [key: string]: unknown;
  };
  main?: {
    debug?: boolean;
    theme?: string;
    lang?: string;
    mobileMode?: string;
    plugins?: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * GenesysGlobal interface - Global Genesys object structure
 */
export interface GenesysGlobal {
  widgets: GenesysWidgets;
  loaded?: boolean;
  [key: string]: unknown;
}

/**
 * Base configuration fields for cloud-only Genesys chat.
 */
export interface BaseGenesysChatConfig {
  chatMode: 'cloud'; // Cloud-only mode
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

  // Add email for chat prefill
  email?: string;
}

/**
 * Cloud specific chat configuration (cloud-only architecture)
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
 * Type guard for cloud chat configuration (cloud-only)
 */
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
 * GenesysChatConfig interface - Cloud-only configuration type for Genesys chat integration.
 * Simplified from legacy/cloud union to cloud-only.
 */
export type GenesysChatConfig = CloudChatConfig;

/**
 * Interface for GenesysChat public API exposed to window
 */
export interface GenesysChat {
  openChat?: () => void;
  closeChat?: () => void;
  showButton?: () => void;
  hideButton?: () => void;
  startCoBrowse?: () => void;
  [key: string]: unknown;
}

/**
 * GenesysCXBus interface - CXBus reference exposed by Genesys cloud
 */
export interface GenesysCXBus extends CXBus {
  subscribe: (event: string, callback: (...args: unknown[]) => void) => void;
  command: (command: string, params?: unknown) => void;
  registerPlugin: (pluginName: string) => {
    subscribe: (event: string, callback: (...args: unknown[]) => void) => void;
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
    config: unknown;
    chatLoadingState: unknown;
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
 * Window extensions for Genesys cloud
 */
export interface GenesysWindow {
  // Genesys globals
  CXBus?: CXBus;
  _genesys?: GenesysGlobal;
  _genesysCXBus?: GenesysCXBus;
  _genesysCXBusReady?: boolean;
  _gt?: unknown[];
  Genesys?: (command: string, ...args: unknown[]) => unknown;

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
  CobrowseIO?: unknown;

  // Service config (for backward compatibility)
  gmsServicesConfig?: {
    GMSChatURL: () => string;
  };
}
