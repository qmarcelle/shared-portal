/**
 * Chat Hooks
 *
 * Essential hooks for retrieving user and plan context from session.
 * These are used by ChatProvider to initialize the chat store.
 *
 * For all chat-specific state and actions, use the chatStore and its selectors:
 * - chatUISelectors: UI state (isOpen, isMinimized, etc)
 * - chatConfigSelectors: Config state (isLoading, error, genesysChatConfig, etc)
 * - chatSessionSelectors: Session state (isChatActive, messages, etc)
 * - chatScriptSelectors: Script state (scriptLoadPhase)
 */

// Essential hooks for getting user and plan data
export * from './usePlanContext';
export * from './useUserContext';
