// Export types used across the chat modules
export interface ChatSettings {
  // Base settings
  widgetUrl: string;
  bootstrapUrl?: string;
  clickToChatJs: string;
  clickToChatEndpoint: string;
  chatTokenEndpoint: string;
  coBrowseEndpoint: string;
  opsPhone: string;
  opsPhoneHours: string;

  // Dynamic settings from user data
  [key: string]: any;
}

export enum ScriptLoadPhase {
  INIT = 'init',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
}

export interface ChatError extends Error {
  code?: string;
  context?: Record<string, any>;
}
