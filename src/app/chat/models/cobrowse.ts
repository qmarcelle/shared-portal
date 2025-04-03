/**
 * Cobrowse session information
 */
export interface CobrowseSession {
  id: string;
  active: boolean;
  url: string;
  code?: string;
}

/**
 * Cobrowse initialization response
 */
export interface CobrowseInitResponse {
  success: boolean;
  error?: string;
}

/**
 * Cobrowse session creation response
 */
export interface CobrowseSessionResponse {
  sessionId: string;
  code: string;
  url?: string;
}

/**
 * Cobrowse configuration
 */
export interface CobrowseConfig {
  license: string;
  endPoint?: string;
  redactedElements?: string[];
  customData?: Record<string, string>;
}
