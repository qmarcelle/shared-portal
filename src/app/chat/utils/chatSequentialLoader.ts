import { logger } from '@/utils/logger';

/**
 * ChatSequentialLoader
 *
 * This utility manages the sequential loading of chat resources, prevents race conditions,
 * and ensures resources are loaded only once.
 */

// Static state for tracking loading progress across all component instances
export const ChatLoadingState = {
  // Global initialization state - prevents multiple app-level initializations
  isInitialized: false,

  // API state - tracks if getChatInfo has been called and completed
  apiState: {
    isFetching: false,
    isComplete: false,
    isEligible: false,
    chatMode: null as 'legacy' | 'cloud' | null,
    lastFetchTimestamp: 0,
  },

  // Script loading state - tracks script loading
  scriptState: {
    isLoading: false,
    isComplete: false,
    loadAttempts: 0,
    lastAttemptTimestamp: 0,
  },

  // DOM state - tracks DOM elements like chat buttons, links, etc.
  domState: {
    linksEnhanced: false,
    buttonCount: 0,
    lastUpdateTimestamp: 0,
  },
};

// Time constants (in milliseconds)
const TIME_CONSTANTS = {
  // Minimum time between API refresh calls
  MIN_API_REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes

  // How long to wait for scripts to load before retrying
  SCRIPT_LOAD_TIMEOUT: 10 * 1000, // 10 seconds

  // Maximum retries for failed script loads
  MAX_SCRIPT_LOAD_ATTEMPTS: 3,

  // Delay between initialization phases
  PHASE_DELAY: 300, // 300ms between phases for smoother loading
};

/**
 * Checks if we should fetch the API data again
 */
export function shouldRefreshChatConfig(): boolean {
  const { apiState } = ChatLoadingState;
  const now = Date.now();

  // If never fetched, or sufficient time has passed since last fetch
  return (
    !apiState.isComplete ||
    now - apiState.lastFetchTimestamp > TIME_CONSTANTS.MIN_API_REFRESH_INTERVAL
  );
}

/**
 * Marks the API fetch as started
 */
export function markApiCallStarted(): void {
  logger.info('[ChatSequentialLoader] API call started');
  ChatLoadingState.apiState.isFetching = true;
}

/**
 * Updates the API state with results from getChatInfo
 */
export function updateApiState(
  isEligible: boolean,
  chatMode: 'legacy' | 'cloud' | null,
): void {
  logger.info('[ChatSequentialLoader] API call completed', {
    isEligible,
    chatMode,
  });

  ChatLoadingState.apiState = {
    isFetching: false,
    isComplete: true,
    isEligible: !!isEligible, // Ensure boolean conversion
    chatMode,
    lastFetchTimestamp: Date.now(),
  };

  // Add explicit logging about eligibility status for debugging
  if (isEligible) {
    logger.info('[ChatSequentialLoader] User is eligible for chat');
  } else {
    logger.info('[ChatSequentialLoader] User is NOT eligible for chat');
  }

  // Log the complete state after update for debugging
  logger.info(
    '[ChatSequentialLoader] Updated API state:',
    ChatLoadingState.apiState,
  );
}

/**
 * Checks if we should load the chat scripts based on API eligibility
 */
export function shouldLoadScripts(): boolean {
  const { apiState, scriptState } = ChatLoadingState;

  logger.info('[ChatSequentialLoader] shouldLoadScripts check', {
    apiComplete: apiState.isComplete,
    apiEligible: apiState.isEligible,
    scriptComplete: scriptState.isComplete,
    scriptLoading: scriptState.isLoading,
    scriptAttempts: scriptState.loadAttempts,
    maxAttempts: TIME_CONSTANTS.MAX_SCRIPT_LOAD_ATTEMPTS,
  });

  // Simple case: scripts already completed successfully
  if (scriptState.isComplete) {
    logger.info(
      '[ChatSequentialLoader] Scripts already completed successfully',
    );
    return false;
  }

  // Current script loading in progress - don't start another
  if (scriptState.isLoading) {
    logger.info('[ChatSequentialLoader] Scripts currently loading');
    return false;
  }

  // API call not complete yet - wait for it
  if (!apiState.isComplete) {
    logger.info('[ChatSequentialLoader] API call not complete yet');
    return false;
  }

  // Not eligible for chat - don't load scripts
  if (!apiState.isEligible) {
    logger.info('[ChatSequentialLoader] User not eligible for chat');
    return false;
  }

  // Too many failed attempts
  if (scriptState.loadAttempts >= TIME_CONSTANTS.MAX_SCRIPT_LOAD_ATTEMPTS) {
    logger.info('[ChatSequentialLoader] Maximum load attempts reached');
    return false;
  }

  // If we got here, we should load scripts
  logger.info('[ChatSequentialLoader] Script loading ALLOWED');
  return true;
}

/**
 * Marks script loading as started
 */
export function markScriptLoadStarted(): void {
  logger.info('[ChatSequentialLoader] Script loading started');

  ChatLoadingState.scriptState.isLoading = true;
  ChatLoadingState.scriptState.loadAttempts += 1;
  ChatLoadingState.scriptState.lastAttemptTimestamp = Date.now();
}

/**
 * Marks script loading as complete
 */
export function markScriptLoadComplete(success: boolean): void {
  logger.info('[ChatSequentialLoader] Script loading completed', { success });

  ChatLoadingState.scriptState.isLoading = false;
  ChatLoadingState.scriptState.isComplete = success;
}

/**
 * Checks if a chat initialization has timed out and should be retried
 */
export function hasScriptLoadTimedOut(): boolean {
  const { scriptState } = ChatLoadingState;
  const now = Date.now();

  return (
    scriptState.isLoading &&
    now - scriptState.lastAttemptTimestamp > TIME_CONSTANTS.SCRIPT_LOAD_TIMEOUT
  );
}

/**
 * Marks DOM enhancement (buttons, links) as complete
 */
export function markDomEnhancementComplete(buttonCount: number): void {
  logger.info('[ChatSequentialLoader] DOM enhancement completed', {
    buttonCount,
  });

  ChatLoadingState.domState = {
    linksEnhanced: true,
    buttonCount,
    lastUpdateTimestamp: Date.now(),
  };
}

/**
 * Main initialization function that ensures sequential loading
 * Returns whether initialization was started
 */
export function initializeChatSequentially(): boolean {
  // If already initialized or initializing, don't start again
  if (ChatLoadingState.isInitialized) {
    logger.info('[ChatSequentialLoader] Chat already initialized, skipping');
    return false;
  }

  logger.info('[ChatSequentialLoader] Starting sequential initialization');
  ChatLoadingState.isInitialized = true;
  return true;
}

/**
 * Resets the loader state - useful for testing or forced reinitialization
 * Should be used carefully in production
 */
export function resetChatLoader(): void {
  logger.info('[ChatSequentialLoader] Resetting chat loader state');

  ChatLoadingState.isInitialized = false;
  ChatLoadingState.apiState = {
    isFetching: false,
    isComplete: false,
    isEligible: false,
    chatMode: null,
    lastFetchTimestamp: 0,
  };
  ChatLoadingState.scriptState = {
    isLoading: false,
    isComplete: false,
    loadAttempts: 0,
    lastAttemptTimestamp: 0,
  };
  ChatLoadingState.domState = {
    linksEnhanced: false,
    buttonCount: 0,
    lastUpdateTimestamp: 0,
  };
}
