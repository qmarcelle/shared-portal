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

/**
 * CXBus interface - Handles communication with Genesys widget
 */
export interface CXBus {
  command: (command: string, ...args: any[]) => any;
  subscribe: (event: string, callback: (...args: any[]) => void) => void;
  unsubscribe: (event: string) => void;
  registerPlugin: (pluginName: string) => {
    subscribe: (event: string, callback: (...args: any[]) => void) => void;
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
 * Base interface for chat configuration with common properties
 */
export interface BaseGenesysChatConfig {
  chatMode?: 'legacy' | 'cloud';
  isChatAvailable: string | boolean;
  isChatEligibleMember: string | boolean;
  targetContainer?: string;
  cloudChatEligible?: string | boolean;
  firstname?: string;
  lastname?: string;
  formattedFirstName?: string;
  userID?: string;
  memberMedicalPlanID?: string;
  isDemoMember?: string | boolean;
  isAmplifyMem?: string | boolean;
  isCobrowseActive?: string | boolean;
  chatHours?: string;
  rawChatHrs?: string;
  selfServiceLinks?: Array<any>;
  [key: string]: any; // For flexibility with unknown properties
}

/**
 * Legacy specific chat configuration
 */
export interface LegacyChatConfig extends BaseGenesysChatConfig {
  // Essential for legacy mode
  clickToChatToken: string;
  clickToChatEndpoint: string;
  widgetUrl: string;
  clickToChatJs: string;

  // Optional legacy-specific fields
  clickToChatDemoEndPoint?: string;
  chatTokenEndpoint?: string;
  gmsChatUrl?: string;
  genesysWidgetUrl?: string;

  // CoBrowse settings
  coBrowseEndpoint?: string;
  coBrowseLicence?: string;
  cobrowseSource?: string;
  cobrowseURL?: string;
}

/**
 * Cloud specific chat configuration
 */
export interface CloudChatConfig extends BaseGenesysChatConfig {
  // Essential for cloud mode
  deploymentId: string;
  orgId: string;
  environment: string;
}

/**
 * Type guards for runtime checks
 */
export function isLegacyChatConfig(config: any): config is LegacyChatConfig {
  return !!(
    config &&
    config.clickToChatToken &&
    config.clickToChatEndpoint &&
    (config.chatMode === 'legacy' || !config.chatMode)
  );
}

export function isCloudChatConfig(config: any): config is CloudChatConfig {
  return !!(
    config &&
    config.deploymentId &&
    config.orgId &&
    config.chatMode === 'cloud'
  );
}

/**
 * ChatSettings interface - Configuration passed to click_to_chat.js
 * This is now a subset of LegacyChatConfig for backward compatibility
 */
export type ChatSettings = LegacyChatConfig;

/**
 * GenesysChatConfig interface - Configuration for Genesys chat integration
 * This is a union type of both configuration types
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
  _forceChatButtonCreate?: () => boolean;
  forceCreateChatButton?: () => void;
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
