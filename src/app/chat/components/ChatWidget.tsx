'use client';

/**
 * @file ChatWidget.tsx
 * @description This component is the main UI/UX orchestrator for the Genesys chat.
 * (Description remains the same)
 */

import { logger } from '@/utils/logger';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  chatConfigSelectors,
  chatScriptSelectors,
  chatSessionSelectors,
  chatUISelectors,
  useChatStore,
} from '../stores/chatStore';
import { GenesysChat, GenesysCXBus } from '../types/chat-types';
import GenesysCloudLoader from './GenesysCloudLoader';
import GenesysScriptLoader from './GenesysScriptLoader';

const LOG_PREFIX = '[ChatWidget]';

// REMOVED: ENABLE_CHAT_BUTTON_DIAGNOSTICS (unused constant)

// --- Constants for Selectors and IDs ---
const GENESYS_BUTTON_SELECTORS = [
  '.cx-widget.cx-webchat-chat-button',
  '.cx-webchat-chat-button',
  '[data-cx-widget="WebChat"]',
  '.cx-button.cx-webchat',
  '.cx-button',
  '[class*="cx-button"]',
];

const FALLBACK_BUTTON_ID_PROLIFERATION = 'genesys-button-fallback';
const FALLBACK_BUTTON_ID_INIT_ERROR = 'genesys-button-fallback-init-error';
const DEDICATED_FALLBACK_BUTTON_ID = 'fallback-chat-button-dedicated';
// const FALLBACK_BUTTON_ID_RENDER = 'fallback-chat-button-render'; // ID for JSX button, used directly

const FALLBACK_BUTTON_IMPERATIVE_STYLE = `
  position: fixed !important;
  bottom: 20px !important;
  right: 20px !important;
  width: 60px !important;
  height: 60px !important;
  border-radius: 50% !important;
  background-color: #0078d4 !important;
  color: white !important;
  font-size: 24px !important;
  border: none !important;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
  cursor: pointer !important;
  z-index: 2147483647 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
`;

interface ChatWidgetProps {
  containerId?: string;
  hideCoBrowse?: boolean;
  showLoaderStatus?: boolean;
  onChatOpened?: () => void;
  onChatClosed?: () => void;
  onError?: (error: Error) => void;
  forceFallbackButton?: boolean;
}

export default function ChatWidget({
  containerId = 'genesys-chat-container',
  hideCoBrowse = true, // Prop kept as per non-modification of external interface rule
  showLoaderStatus = process.env.NODE_ENV === 'development',
  onChatOpened, // Prop kept
  onChatClosed, // Prop kept
  onError, // Prop kept
  forceFallbackButton = false,
}: ChatWidgetProps) {
  // === HOOKS ===
  // REMOVED: isMounted (unused)
  // REMOVED: instanceId (unused)
  // REMOVED: cxBusCommandQueue (unused)
  const [isCXBusReady, setIsCXBusReady] = useState(false);
  // REMOVED: cxBusSubscriptionsSetup (unused)
  // REMOVED: cxBusPollTimer (unused)
  // REMOVED: activeSubscriptions (unused)
  const [showChatErrorModal, setShowChatErrorModal] = useState(false);
  const [showFallbackButton, setShowFallbackButton] =
    useState(forceFallbackButton); // Initialized with prop
  // REMOVED: buttonCheckAttempts, MAX_BUTTON_CHECK_ATTEMPTS (unused)
  // REMOVED: isGenesysFullyInitialized, genesysInitCheckAttempts, MAX_GENESYS_INIT_CHECK_ATTEMPTS (unused)

  const [hasCreatedFallbackButton, setHasCreatedFallbackButton] =
    useState(false);
  const fallbackButtonRef = useRef<HTMLButtonElement | null>(null);

  // Default function for the ref, can be updated by useEffect.
  const forceButtonCreationRef = useRef<() => boolean>(() => {
    logger.info(
      `${LOG_PREFIX} Default force button creation invoked: No button created.`,
    );
    return false;
  });

  // Store selectors
  const isOpen = useChatStore(chatUISelectors.isOpen);
  const chatMode = useChatStore(chatConfigSelectors.chatMode);
  const buttonState = useChatStore(chatUISelectors.buttonState); // Used by enhancedForceButtonCreation
  const legacyConfig = useChatStore((state) => state.config.legacyConfig);
  const cloudConfig = useChatStore((state) => state.config.cloudConfig);
  const isLoading = useChatStore(chatConfigSelectors.isLoading);
  const error = useChatStore(chatConfigSelectors.error);
  const isChatEnabled = useChatStore(chatConfigSelectors.isChatEnabled);
  const scriptLoadPhase = useChatStore(chatScriptSelectors.scriptLoadPhase);
  const genesysCloudConfig = useChatStore(
    chatConfigSelectors.genesysCloudDeploymentConfig,
  ); // Used for type casting check
  const standardErrorMessage = useChatStore(
    chatSessionSelectors.standardErrorMessage,
  );

  // Store actions
  const setScriptLoadPhase = useChatStore(
    (state) => state.actions.setScriptLoadPhase,
  ); // Used by script loaders
  const setError = useChatStore((state) => state.actions.setError);
  const setOpen = useChatStore((state) => state.actions.setOpen);
  const setButtonState = useChatStore((state) => state.actions.setButtonState);

  const genesysChatConfig = chatMode === 'legacy' ? legacyConfig : cloudConfig;

  logger.info(`${LOG_PREFIX} Component instance created/rendered.`, {
    containerId,
    initialIsChatEnabled: useChatStore.getState().config.chatData?.isEligible,
    chatModeFromStore: chatMode,
    hasLegacyConfig: !!legacyConfig,
    hasCloudConfig: !!cloudConfig,
  });

  // REMOVED: addChatButtonStyles & addGlobalStyles (defined but never called)
  // If these styles were critical, their invocation was missing.
  // Removing them reflects the current actual behavior (styles not applied).

  // Effect for window._genesysInitStatus and _genesysDiagnostics (self-contained, kept as is)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window._genesysInitStatus = window._genesysInitStatus || {
        isInitialized: false,
        initializationAttempts: 0,
        maxAttempts: 3,
        lastAttemptTime: 0,
        buttonCreationAttempts: 0,
        hasReportedFailure: false,
        hasFallbackButton: false,
        errors: [],
      };
      window._genesysDiagnostics = () => {
        console.log('Genesys Diagnostics:', {
          initStatus: window._genesysInitStatus,
          genesysObject: !!window._genesys,
          hasWidgets: !!window._genesys?.widgets,
          hasMain: !!window._genesys?.widgets?.main,
          hasInitialize:
            typeof window._genesys?.widgets?.main?.initialise === 'function',
          cxBusAvailable: !!window._genesysCXBus,
          buttonElements: document.querySelectorAll(
            GENESYS_BUTTON_SELECTORS.join(', '),
          ).length,
        });
      };
      const diagTimer = setTimeout(() => {
        // Ensure timer is managed
        if (window._genesysDiagnostics) window._genesysDiagnostics();
      }, 5000);

      return () => {
        clearTimeout(diagTimer);
        if (window._genesysInitStatus) {
          window._genesysInitStatus.isInitialized = false; // Example cleanup
        }
        // Potentially remove _genesysDiagnostics if it shouldn't persist past component life
        // delete window._genesysDiagnostics;
      };
    }
    return () => {}; // Ensure a function is always returned for cleanup
  }, []);

  const cleanupExistingButtons = useCallback(() => {
    let removed = 0;
    for (const selector of GENESYS_BUTTON_SELECTORS) {
      const buttons = document.querySelectorAll(selector);
      if (buttons.length > 1) {
        for (let i = 1; i < buttons.length; i++) {
          try {
            buttons[i].remove();
            removed++;
          } catch (e) {
            /* Ignore errors during cleanup */
          }
        }
      }
    }
    if (removed > 0) {
      logger.info(`${LOG_PREFIX} Cleaned up ${removed} excess button elements`);
    }
    return removed;
  }, []);

  // --- Consolidated Fallback Button Creation ---
  const createImperativeFallbackButton = useCallback(
    (id: string, text: string, ariaLabel: string) => {
      if (
        document.getElementById(id) ||
        document.getElementById(DEDICATED_FALLBACK_BUTTON_ID)
      ) {
        return null;
      }

      const fallbackButtonElement = document.createElement('button');
      fallbackButtonElement.id = id;
      fallbackButtonElement.innerText = text;
      fallbackButtonElement.setAttribute('aria-label', ariaLabel);
      fallbackButtonElement.style.cssText = FALLBACK_BUTTON_IMPERATIVE_STYLE;

      fallbackButtonElement.onclick = () => {
        setOpen(true);
        const cxBus = window._genesysCXBus as GenesysCXBus;
        if (cxBus?.command) {
          try {
            cxBus.command('WebChat.open');
          } catch (e) {
            logger.error(`${LOG_PREFIX} Error opening chat via fallback: ${e}`);
          }
        }
      };

      document.body.appendChild(fallbackButtonElement);
      fallbackButtonRef.current = fallbackButtonElement;
      setHasCreatedFallbackButton(true);
      return fallbackButtonElement;
    },
    [setOpen, setHasCreatedFallbackButton, fallbackButtonRef],
  ); // Dependencies added

  // Effect for checking button proliferation
  useEffect(() => {
    if (!isChatEnabled) return;

    const checkInterval = setInterval(() => {
      const buttonCount = GENESYS_BUTTON_SELECTORS.reduce(
        (count, selector) => count + document.querySelectorAll(selector).length,
        0,
      );

      if (buttonCount > 3) {
        logger.error(
          `${LOG_PREFIX} Detected button proliferation (${buttonCount} buttons). Cleaning up.`,
        );
        cleanupExistingButtons();

        if (
          !hasCreatedFallbackButton &&
          !document.getElementById(DEDICATED_FALLBACK_BUTTON_ID)
        ) {
          const button = createImperativeFallbackButton(
            FALLBACK_BUTTON_ID_PROLIFERATION,
            '💬',
            'Chat with us',
          );
          if (button) {
            logger.info(
              `${LOG_PREFIX} Created emergency fallback button due to button proliferation`,
            );
            clearInterval(checkInterval); // Stop checking once handled
          }
        }
      }
    }, 2000);

    return () => clearInterval(checkInterval);
  }, [
    isChatEnabled,
    hasCreatedFallbackButton,
    cleanupExistingButtons,
    createImperativeFallbackButton, // Added dependency
  ]);

  // --- Simplified forceButtonCreationRef logic ---
  const baseForceButtonCreationLogic = useCallback(() => {
    logger.info(
      `${LOG_PREFIX} Base force button creation logic: No button created by default.`,
    );
    return false;
  }, []);

  const actualEnhancedForceButtonCreation = useCallback(() => {
    if (window._genesysInitStatus) {
      window._genesysInitStatus.buttonCreationAttempts++;
      const initError =
        window._genesys &&
        window._genesys.widgets &&
        window._genesys.widgets.main &&
        typeof window._genesys.widgets.main.initialise !== 'function';

      if (initError && window._genesysInitStatus.buttonCreationAttempts > 3) {
        logger.error(
          `${LOG_PREFIX} Detected 'widgets.main.initialise is NOT a function' error - using fallback`,
        );
        cleanupExistingButtons();
        if (
          !hasCreatedFallbackButton &&
          !document.getElementById(DEDICATED_FALLBACK_BUTTON_ID)
        ) {
          const button = createImperativeFallbackButton(
            FALLBACK_BUTTON_ID_INIT_ERROR,
            '💬',
            'Chat with us',
          );
          if (button) {
            setButtonState('created');
            logger.info(
              `${LOG_PREFIX} Created fallback button due to initialization error`,
            );
          }
        }
        return true; // Indicate button was (attempted to be) created or error handled
      }
    }
    return baseForceButtonCreationLogic(); // Call base if no specific action taken
  }, [
    cleanupExistingButtons,
    hasCreatedFallbackButton,
    setButtonState,
    createImperativeFallbackButton, // Added dependency
    baseForceButtonCreationLogic, // Added dependency
  ]);

  useEffect(() => {
    const previousRefValue = forceButtonCreationRef.current;
    forceButtonCreationRef.current = actualEnhancedForceButtonCreation;
    if (typeof window !== 'undefined') {
      window._forceChatButtonCreate = actualEnhancedForceButtonCreation;
    }
    return () => {
      forceButtonCreationRef.current = previousRefValue; // Restore previous function on unmount
      if (
        typeof window !== 'undefined' &&
        window._forceChatButtonCreate === actualEnhancedForceButtonCreation
      ) {
        // Clean up window property if it was set by this instance
        // Set to a default or delete, depending on desired global state management
        window._forceChatButtonCreate = () => {
          /* No-op or previous value if known */ return false;
        };
      }
    };
  }, [actualEnhancedForceButtonCreation]);

  const handleCXBusReady = useCallback(() => {
    logger.info(`${LOG_PREFIX} CXBus is ready`);
    setIsCXBusReady(true);
  }, []);

  const handleScriptError = useCallback(
    (err: Error) => {
      // Renamed error to err to avoid conflict with store's error
      logger.error(`${LOG_PREFIX} Script loading error: ${err.message}`);
      setError(err);
      setShowChatErrorModal(true);
    },
    [setError],
  );

  const handleClearErrorAndReopen = useCallback(() => {
    logger.info(`${LOG_PREFIX} Clearing error and reopening chat`);
    setError(null);
    setShowChatErrorModal(false);
    setOpen(true);
  }, [setError, setOpen]);

  const chatDataFromStore = useChatStore.getState().config.chatData;
  logger.info('[ChatWidget] Pre-render conditional check values:', {
    isChatEnabled,
    hasGenesysChatConfig: !!genesysChatConfig,
    isLoading,
    errorMsg: error?.message,
    scriptLoadPhase,
    storeChatDataIsEligible: chatDataFromStore?.isEligible,
    storeChatDataChatAvailable: chatDataFromStore?.chatAvailable,
  });

  if (!isChatEnabled || !genesysChatConfig) {
    if (!isChatEnabled)
      logger.warn(
        `${LOG_PREFIX} Chat is not enabled. GenesysScriptLoader will not be rendered.`,
      );
    if (!genesysChatConfig)
      logger.warn(
        `${LOG_PREFIX} genesysChatConfig not available. GenesysScriptLoader will not be rendered.`,
      );
    if (isLoading) {
      logger.info(
        `${LOG_PREFIX} Chat config loading. Rendering loading message.`,
      );
      return (
        <p data-testid="chat-loading-config">Loading chat configuration...</p>
      );
    }
    if (error) {
      logger.error(
        `${LOG_PREFIX} Error loading chat. Error message: ${error.message}`,
      );
    }
    logger.info(
      `${LOG_PREFIX} Chat not enabled or no config, and not loading/error state. Rendering minimal.`,
    );
    // Continues to render the container and potentially error modal/fallback button below
  }

  if (error && !showChatErrorModal) {
    logger.info(
      `${LOG_PREFIX} Global error from store. Setting showChatErrorModal.`,
    );
    setShowChatErrorModal(true);
  }

  logger.info(
    `${LOG_PREFIX} Rendering main content. isChatEnabled: ${isChatEnabled}, hasConfig: ${!!genesysChatConfig}, showErrorModal: ${showChatErrorModal}`,
  );

  return (
    <>
      <div id={containerId} data-testid="chat-widget-container" />

      {isChatEnabled &&
        genesysChatConfig &&
        (chatMode === 'cloud' ? (
          <GenesysCloudLoader
            useProdDeployment={process.env.NODE_ENV === 'production'}
            onLoad={handleCXBusReady}
            onError={handleScriptError}
            userData={(genesysChatConfig as any)?.userData || {}}
          />
        ) : (
          <GenesysScriptLoader
            chatMode="legacy"
            legacyConfig={legacyConfig || undefined}
            cloudConfig={undefined} // Explicitly undefined for legacy
            onLoad={handleCXBusReady}
            onError={handleScriptError}
            showStatus={showLoaderStatus}
          />
        ))}

      {showChatErrorModal && (
        <div className="chat-error-modal" data-testid="chat-error-modal">
          <div className="modal-content">
            <p>{error?.message || standardErrorMessage}</p>
            <button
              onClick={handleClearErrorAndReopen}
              data-testid="chat-error-reopen-button"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                setError(null);
                setShowChatErrorModal(false);
              }}
              data-testid="chat-error-close-button"
            >
              Close
            </button>
          </div>
          <style jsx>{`
            .chat-error-modal {
              /* Styles kept as is */
            }
            .modal-content {
              /* Styles kept as is */
            }
            .modal-content p {
              /* Styles kept as is */
            }
            .modal-content button {
              /* Styles kept as is */
            }
          `}</style>
        </div>
      )}

      {showFallbackButton &&
        !document.getElementById(DEDICATED_FALLBACK_BUTTON_ID) &&
        !document.getElementById(FALLBACK_BUTTON_ID_PROLIFERATION) && // Also check our own fallbacks
        !document.getElementById(FALLBACK_BUTTON_ID_INIT_ERROR) && (
          <button
            id="fallback-chat-button-render" // This is the JSX fallback button
            onClick={() => {
              setOpen(true);
              const cxBus = window._genesysCXBus as GenesysCXBus;
              if (cxBus?.command) {
                cxBus.command('WebChat.open');
              }
            }}
            style={
              {
                /* Styles kept as is */
              }
            }
            data-testid="chat-fallback-button-render"
          >
            Chat with us (Fallback)
          </button>
        )}
    </>
  );
}

declare global {
  interface Window {
    GenesysChat?: GenesysChat;
    _genesysCXBus?: unknown; // Use unknown to avoid type conflicts
    _chatWidgetInstanceId?: string;
    _forceChatButtonCreate?: () => boolean;
    _genesysButtonObserver?: MutationObserver;
    _genesysButtonVisibilityInterval?: NodeJS.Timeout;
    _genesys?: {
      widgets?: {
        main?: {
          initialise?: Function;
        };
      };
    };
    _genesysInitStatus?: {
      isInitialized: boolean;
      initializationAttempts: number;
      maxAttempts: number;
      lastAttemptTime: number;
      buttonCreationAttempts: number;
      hasReportedFailure: boolean;
      hasFallbackButton: boolean;
      errors: any[];
    };
    _genesysDiagnostics?: () => void;
  }
}
