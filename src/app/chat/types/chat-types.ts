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
 * ChatSettings interface - Configuration passed to click_to_chat.js
 */
export interface ChatSettings {
  // Mode selection
  chatMode?: 'legacy' | 'cloud';

  // Common settings
  targetContainer?: string;
  isChatAvailable?: string;
  isChatEligibleMember?: string;
  isDemoMember?: string;
  isAmplifyMem?: string;
  isCobrowseActive?: string;
  isMagellanVAMember?: string;
  isMedicalAdvantageGroup?: string;
  routingchatbotEligible?: string;

  // Legacy mode settings
  clickToChatToken?: string;
  clickToChatEndpoint?: string;
  clickToChatDemoEndPoint?: string;
  widgetUrl?: string;
  clickToChatJs?: string;
  chatTokenEndpoint?: string;
  gmsChatUrl?: string;
  genesysWidgetUrl?: string;

  // Cloud mode settings
  deploymentId?: string;
  orgId?: string;

  // CoBrowse settings
  coBrowseEndpoint?: string;
  coBrowseLicence?: string;
  cobrowseSource?: string;
  cobrowseURL?: string;

  // Contact info
  opsPhone?: string;
  opsPhoneHours?: string;

  // User info
  firstname?: string;
  lastname?: string;
  formattedFirstName?: string;
  memberLastName?: string;

  // Hours
  rawChatHrs?: string;
  chatHours?: string;

  // Self-service
  selfServiceLinks?: Array<{ key: string; value: string }>;

  // Additional properties
  [key: string]: any;
}

/**
 * GenesysChatConfig interface - Configuration for Genesys chat integration
 * This is typically returned from the API and used to configure the chat widget
 */
export interface GenesysChatConfig {
  // Required fields
  isChatAvailable: string | boolean;
  clickToChatToken: string;
  clickToChatEndpoint: string;
  coBrowseLicence: string;
  cobrowseSource: string;
  cobrowseURL: string;
  userID: string;
  memberMedicalPlanID?: string;
  isChatEligibleMember: string | boolean;
  chatHours: string;
  rawChatHrs: string;
  widgetUrl: string;
  clickToChatJs: string;
  gmsChatUrl: string;

  // Optional fields
  chatMode?: 'legacy' | 'cloud';
  isDemoMember?: string | boolean;
  isAmplifyMem?: string | boolean;
  isCobrowseActive?: string | boolean;
  memberFirstname?: string;
  memberLastName?: string;
  formattedFirstName?: string;
  deploymentId?: string;
  orgId?: string;
  selfServiceLinks?: Array<any>;
  genesysWidgetUrl?: string;

  // Any other fields
  [key: string]: any;
}

/**
 * GenesysChat interface - Public API exposed by click_to_chat.js
 */
export interface GenesysChat {
  forceCreateButton?: () => boolean;
  openChat?: () => void;
  closeChat?: () => void;
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
 * Window extensions for Genesys
 */
export interface GenesysWindow {
  // Genesys globals
  CXBus?: CXBus;
  _genesys?: GenesysGlobal;
  _genesysCXBus?: GenesysCXBus;
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

  // CoBrowse
  CobrowseIO?: any;

  // Service config (for backward compatibility)
  gmsServicesConfig?: {
    GMSChatURL: () => string;
  };
}
