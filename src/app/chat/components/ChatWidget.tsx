'use client';

/**
 * @file ChatWidget.tsx
 * @description This component is the main UI/UX orchestrator for the Genesys chat.
 * It loads the appropriate Genesys script (legacy or cloud) based on configuration,
 * subscribes to Genesys events to update application state via chatStore,
 * and renders auxiliary UI like error modals.
 */

import { logger } from '@/utils/logger';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useChatStore } from '../stores/chatStore'; // Assuming selectors are exported with useChatStore or separately
import {
  CloudChatConfig,
  GenesysChat,
  GenesysCXBus,
  LegacyChatConfig,
  ScriptLoadPhase,
} from '../types/chat-types';
import { ChatErrorDialog } from './ChatErrorDialog';
import GenesysCloudLoader from './GenesysCloudLoader';
import GenesysScriptLoader from './GenesysScriptLoader';
import { PreChatModal } from './PreChatModal';

const LOG_PREFIX = '[ChatWidget]';

const GENESYS_BUTTON_SELECTORS = [
  '.cx-widget.cx-webchat-chat-button',
  'button[data-testid="messenger-button"]',
  // Add other selectors for different Genesys button versions if necessary
];

const FALLBACK_BUTTON_ID_INIT_ERROR = 'genesys-button-fallback-init-error';
const DEDICATED_FALLBACK_BUTTON_ID = 'fallback-chat-button-dedicated';

const FALLBACK_BUTTON_IMPERATIVE_STYLE = `
  position: fixed !important; bottom: 20px !important; right: 20px !important;
  width: 60px !important; height: 60px !important; border-radius: 50% !important;
  background-color: #0078d4 !important; color: white !important; font-size: 24px !important;
  border: none !important; box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
  cursor: pointer !important; z-index: 2147483647 !important;
  display: flex !important; align-items: center !important; justify-content: center !important;
`;

interface ChatWidgetProps {
  containerId?: string;
  showLoaderStatus?: boolean;
  forceFallbackButton?: boolean;
}

export default function ChatWidget({
  containerId = 'genesys-chat-container',
  showLoaderStatus = process.env.NODE_ENV === 'development',
  forceFallbackButton = false,
}: ChatWidgetProps) {
  const [isCXBusReadyLocal, setIsCXBusReadyLocal] = useState(false);
  const [showChatErrorModal, setShowChatErrorModal] = useState(false);
  const [showFallbackButtonJSXState, setShowFallbackButtonJSXState] =
    useState(false);

  const [hasCreatedImperativeFallback, setHasCreatedImperativeFallback] =
    useState(false);
  const imperativeFallbackButtonRef = useRef<HTMLButtonElement | null>(null);

  // Store actions are stable references from the create() call
  const storeActions = useChatStore((state) => state.actions);

  // Select individual pieces of state or logically grouped state
  // UI State
  const isChatOpenInStore = useChatStore((state) => state.ui.isOpen);
  const buttonState = useChatStore((state) => state.ui.buttonState);
  const isPreChatModalOpen = useChatStore(
    (state) => state.ui.isPreChatModalOpen,
  );

  // Config State
  const chatMode = useChatStore(
    (state) => state.config.genesysChatConfig?.chatMode ?? 'legacy',
  ); // Default to legacy if no config yet
  const genesysChatConfigFull = useChatStore(
    (state) => state.config.genesysChatConfig,
  );
  const isLoadingConfig = useChatStore((state) => state.config.isLoading);
  const configError = useChatStore((state) => state.config.error);
  const isChatEnabled = useChatStore(
    (
      state, // Recalculate based on full config for safety
    ) =>
      state.config.genesysChatConfig?.isChatEligibleMember === true &&
      state.config.genesysChatConfig?.isChatAvailable === true,
  );

  // Session State
  const isChatActive = useChatStore((state) => state.session.isChatActive);
  const standardErrorMessage = useChatStore(
    (state) => state.session.standardErrorMessage,
  );

  // Script State
  const scriptLoadPhase = useChatStore(
    (state) => state.scripts.scriptLoadPhase,
  );

  const prevActiveLegacyConfigRef = useRef<LegacyChatConfig | undefined>();

  // Derived active configs for type safety when passing to loaders
  const activeLegacyConfig = useMemo(() => {
    if (genesysChatConfigFull?.chatMode === 'legacy') {
      return genesysChatConfigFull as LegacyChatConfig; // ChatSettings is LegacyChatConfig
    }
    return undefined;
  }, [genesysChatConfigFull]);

  const activeCloudConfig = useMemo(() => {
    if (genesysChatConfigFull?.chatMode === 'cloud') {
      return genesysChatConfigFull as unknown as CloudChatConfig; // Applied 'as unknown as CloudChatConfig'
    }
    return undefined;
  }, [genesysChatConfigFull]);

  useEffect(() => {
    logger.info(`${LOG_PREFIX} Initial render/update. Key states:`, {
      isChatEnabled,
      chatMode,
      isLoadingConfig,
      configErrorMsg: configError?.message,
      scriptLoadPhase,
      buttonState,
      isChatActive,
      hasFullConfig: !!genesysChatConfigFull,
      hasLegacyConfig: !!activeLegacyConfig,
      hasCloudConfig: !!activeCloudConfig,
    });
  }, [
    isChatEnabled,
    chatMode,
    isLoadingConfig,
    configError,
    scriptLoadPhase,
    buttonState,
    isChatActive,
    genesysChatConfigFull,
    activeLegacyConfig,
    activeCloudConfig,
  ]);

  // Helper function to check if a Genesys native button is rendered
  const isGenesysButtonRendered = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return false;
    for (const selector of GENESYS_BUTTON_SELECTORS) {
      if (document.querySelector(selector)) {
        logger.debug(
          `${LOG_PREFIX} Genesys native button found with selector: ${selector}`,
        );
        return true;
      }
    }
    logger.debug(`${LOG_PREFIX} No Genesys native button found.`);
    return false;
  }, []);

  // Effect to determine if the JSX fallback button should be shown
  useEffect(() => {
    const shouldShowFallback =
      (forceFallbackButton || scriptLoadPhase === ScriptLoadPhase.ERROR) &&
      !isGenesysButtonRendered() &&
      !isPreChatModalOpen;
    setShowFallbackButtonJSXState(shouldShowFallback);
    logger.debug(`${LOG_PREFIX} Fallback JSX button visibility update:`, {
      shouldShowFallback,
      forceFallbackButton,
      scriptLoadPhase,
      nativeButtonRendered: isGenesysButtonRendered(),
      isPreChatModalOpen,
    });
  }, [
    forceFallbackButton,
    scriptLoadPhase,
    isGenesysButtonRendered,
    isPreChatModalOpen,
  ]);

  // Effect for subscribing to custom DOM events from click_to_chat.js
  useEffect(() => {
    const handleGenesysReady = () => {
      logger.info(`${LOG_PREFIX} Event: 'genesys:ready' received.`);
      storeActions.setButtonState('created');
      storeActions.setScriptLoadPhase(ScriptLoadPhase.LOADED);
      setIsCXBusReadyLocal(true);
    };

    const handleWebChatOpened = () => {
      logger.info(`${LOG_PREFIX} Event: 'genesys:webchat:opened' received.`);
      storeActions.setOpen(true);
      storeActions.startChat();
    };

    const handleWebChatClosed = () => {
      logger.info(`${LOG_PREFIX} Event: 'genesys:webchat:closed' received.`);
      storeActions.setOpen(false);
      storeActions.endChat();
    };

    const handleGenesysError = (event: Event) => {
      const customEvent = event as CustomEvent;
      logger.error(
        `${LOG_PREFIX} Event: 'genesys:error' received.`,
        customEvent.detail,
      );
      storeActions.setError(
        customEvent.detail?.error ||
          new Error(
            customEvent.detail?.message || 'Genesys initialization error',
          ),
      );
      storeActions.setButtonState('failed');
      storeActions.setScriptLoadPhase(ScriptLoadPhase.ERROR);
      setShowChatErrorModal(true);
    };

    const handleWebChatErrorEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      logger.error(
        `${LOG_PREFIX} Event: 'genesys:webchat:error' received.`,
        customEvent.detail,
      );
      storeActions.setError(
        customEvent.detail?.error ||
          new Error(
            customEvent.detail?.message || 'Genesys webchat session error',
          ),
      );
      setShowChatErrorModal(true);
    };

    const handleWebChatFailedToStart = (event: Event) => {
      const customEvent = event as CustomEvent;
      logger.error(
        `${LOG_PREFIX} Event: 'genesys:webchat:failedToStart' received.`,
        customEvent.detail,
      );
      storeActions.setError(
        new Error(
          customEvent.detail?.message || 'Genesys webchat failed to start',
        ),
      );
      storeActions.endChat();
      setShowChatErrorModal(true);
    };

    const handleCreateButtonEvent = () => {
      logger.info(
        `${LOG_PREFIX} Event: 'genesys:create-button' received (safety timeout).`,
      );
    };

    const handleMessageReceived = (event: Event) => {
      const customEvent = event as CustomEvent;
      logger.info(
        `${LOG_PREFIX} Event: 'genesys:message:received' received.`,
        customEvent.detail,
      );
      storeActions.incrementMessageCount();
    };

    const handleWebChatSubmitted = (event: Event) => {
      const customEvent = event as CustomEvent;
      logger.info(
        `${LOG_PREFIX} Event: 'genesys:webchat:submitted' received.`,
        customEvent.detail,
      );
      // Optionally set a store state here if needed:
      // storeActions.setChatFormSubmitted(customEvent.detail?.formData);
    };

    document.addEventListener('genesys:ready', handleGenesysReady);
    document.addEventListener('genesys:webchat:opened', handleWebChatOpened);
    document.addEventListener('genesys:webchat:closed', handleWebChatClosed);
    document.addEventListener('genesys:error', handleGenesysError);
    document.addEventListener('genesys:webchat:error', handleWebChatErrorEvent);
    document.addEventListener(
      'genesys:webchat:failedToStart',
      handleWebChatFailedToStart,
    );
    document.addEventListener('genesys:create-button', handleCreateButtonEvent);
    document.addEventListener(
      'genesys:message:received',
      handleMessageReceived,
    );
    document.addEventListener(
      'genesys:webchat:submitted',
      handleWebChatSubmitted,
    );

    return () => {
      document.removeEventListener('genesys:ready', handleGenesysReady);
      document.removeEventListener(
        'genesys:webchat:opened',
        handleWebChatOpened,
      );
      document.removeEventListener(
        'genesys:webchat:closed',
        handleWebChatClosed,
      );
      document.removeEventListener('genesys:error', handleGenesysError);
      document.removeEventListener(
        'genesys:webchat:error',
        handleWebChatErrorEvent,
      );
      document.removeEventListener(
        'genesys:webchat:failedToStart',
        handleWebChatFailedToStart,
      );
      document.removeEventListener(
        'genesys:create-button',
        handleCreateButtonEvent,
      );
      document.removeEventListener(
        'genesys:message:received',
        handleMessageReceived,
      );
      document.removeEventListener(
        'genesys:webchat:submitted',
        handleWebChatSubmitted,
      );
    };
  }, [storeActions]);

  // Effect to define global functions needed by click_to_chat.js and general chat control
  useEffect(() => {
    (window as Window & typeof globalThis).openPlanSwitcher = () => {
      logger.info(
        `${LOG_PREFIX} window.openPlanSwitcher called from Genesys UI.`,
      );
      if (window._genesysCXBus) {
        (window._genesysCXBus as GenesysCXBus).command('WebChat.close');
      }
      storeActions.openPlanSwitcherModal();
    };

    (window as Window & typeof globalThis).OpenChatDisclaimer = () => {
      logger.info(
        `${LOG_PREFIX} window.OpenChatDisclaimer called from Genesys UI.`,
      );
      storeActions.openTnCModal(genesysChatConfigFull?.LOB || 'General');
    };

    (window as Window & typeof globalThis).requestChatOpen = () => {
      logger.info(`${LOG_PREFIX} window.requestChatOpen called.`);
      // Attempt to hide the native button immediately
      if (isChatEnabled && genesysChatConfigFull) {
        logger.debug(
          `${LOG_PREFIX} Pre-emptively hiding native Genesys button.`,
        );
        if (chatMode === 'legacy' && window._genesysCXBus) {
          try {
            (window._genesysCXBus as GenesysCXBus).command(
              'WebChat.hideChatButton',
            );
          } catch (e) {
            logger.warn(
              `${LOG_PREFIX} Error calling WebChat.hideChatButton pre-emptively:`,
              e,
            );
          }
        } else if (chatMode === 'cloud') {
          document.body.classList.add('prechat-panel-open');
          logger.info(
            `${LOG_PREFIX} Added .prechat-panel-open to body pre-emptively.`,
          );
        }
        storeActions.openPreChatModal();
      } else {
        logger.warn(
          `${LOG_PREFIX} Chat open requested, but chat is not enabled or config not loaded. PreChatModal not opened.`,
        );
        storeActions.setError(
          new Error(
            'Chat is currently unavailable. Please check eligibility and business hours.',
          ),
        );
        setShowChatErrorModal(true);
      }
    };

    return () => {
      delete (window as Window & typeof globalThis).openPlanSwitcher;
      delete (window as Window & typeof globalThis).OpenChatDisclaimer;
      delete (window as Window & typeof globalThis).requestChatOpen;
    };
  }, [storeActions, genesysChatConfigFull, isChatEnabled]);

  useEffect(() => {
    if (configError) {
      setShowChatErrorModal(true);
    }
  }, [configError]);

  const handleClearErrorAndReopen = useCallback(() => {
    logger.info(
      `${LOG_PREFIX} ChatErrorDialog confirmed. Clearing error and attempting to reopen/re-initialize if applicable.`,
    );
    setShowChatErrorModal(false);
    storeActions.setError(null); // Clear the error in the store

    // Attempt to re-trigger chat open or re-initialization if appropriate
    // This logic might need to be more sophisticated based on the error cause.
    // For now, if it was a failure to open, and chat is still enabled, try to open pre-chat modal again.
    if (isChatEnabled && genesysChatConfigFull && !isChatActive) {
      // If config is good and chat not active, try opening pre-chat modal again
      // This assumes the error wasn't a fatal config error.
      // If Genesys button exists, user can click it. If not, this provides a retry path.
      logger.info(
        `${LOG_PREFIX} Attempting to re-open PreChatModal after error dismissal.`,
      );
      storeActions.openPreChatModal();
    } else if (!isChatEnabled || !genesysChatConfigFull) {
      logger.warn(
        `${LOG_PREFIX} Chat cannot be reopened: chat not enabled or config missing.`,
      );
      // Potentially trigger a re-fetch of config if that was the issue.
      // storeActions.loadChatConfiguration(...); // This would require parameters
    }
  }, [storeActions, isChatEnabled, genesysChatConfigFull, isChatActive]);

  const handleStartChatConfirm = useCallback(() => {
    logger.info(`${LOG_PREFIX} PreChatModal confirmed. Opening Genesys chat.`);
    storeActions.closePreChatModal();
    setShowFallbackButtonJSXState(false);
    if (imperativeFallbackButtonRef.current) {
      imperativeFallbackButtonRef.current.remove();
      setHasCreatedImperativeFallback(false);
    }

    if (!isChatEnabled || !genesysChatConfigFull) {
      logger.error(
        `${LOG_PREFIX} Attempted to start chat from PreChatModal, but chat is no longer enabled or config is missing.`,
      );
      storeActions.setError(
        new Error(
          'Failed to start chat. Configuration issue or eligibility changed.',
        ),
      );
      setShowChatErrorModal(true);
      return;
    }

    if (chatMode === 'legacy' && window._genesysCXBus) {
      (window._genesysCXBus as GenesysCXBus).command('WebChat.open');
    } else if (chatMode === 'cloud' && window.Genesys) {
      window.Genesys('command', 'Messenger.open');
    } else {
      logger.error(
        `${LOG_PREFIX} Cannot open chat. Genesys CXBus (legacy) or Genesys global (cloud) not found. Mode: ${chatMode}`,
      );
      storeActions.setError(
        new Error('Chat system components not found. Cannot initiate chat.'),
      );
      setShowChatErrorModal(true);
    }
  }, [chatMode, storeActions, isChatEnabled, genesysChatConfigFull]);

  const createImperativeFallback = useCallback(() => {
    if (
      hasCreatedImperativeFallback ||
      isGenesysButtonRendered() ||
      isPreChatModalOpen
    ) {
      logger.info(
        `${LOG_PREFIX} Imperative fallback creation skipped: already created, native button exists, or pre-chat open.`,
        {
          hasCreatedImperativeFallback,
          nativeButton: isGenesysButtonRendered(),
          isPreChatModalOpen,
        },
      );
      return;
    }

    logger.warn(`${LOG_PREFIX} Creating imperative fallback button.`, {
      buttonState,
      isChatActive,
      genesysChatConfigFull,
      activeLegacyConfig,
      activeCloudConfig,
    });
    const btn = document.createElement('button');
    btn.id = DEDICATED_FALLBACK_BUTTON_ID;
    btn.innerText = 'Support Chat';
    btn.setAttribute('aria-label', 'Chat with support (fallback)');
    btn.style.cssText = FALLBACK_BUTTON_IMPERATIVE_STYLE;
    btn.onclick = () => {
      if (window._genesysCXBus) {
        (window._genesysCXBus as GenesysCXBus).command('WebChat.open');
      } else if (window.Genesys) {
        window.Genesys('command', 'Messenger.open');
      } else {
        alert('Chat system is currently unavailable.');
      }
    };
    document.body.appendChild(btn);
    setHasCreatedImperativeFallback(true);
    imperativeFallbackButtonRef.current = btn;
  }, [
    hasCreatedImperativeFallback,
    isGenesysButtonRendered,
    isPreChatModalOpen,
  ]);

  // Effect for subscribing to custom DOM events from click_to_chat.js
  useEffect(() => {
    if (
      scriptLoadPhase === ScriptLoadPhase.ERROR &&
      !hasCreatedImperativeFallback &&
      !isGenesysButtonRendered()
    ) {
      createImperativeFallback();
    }

    // Cleanup function
    return () => {
      if (imperativeFallbackButtonRef.current) {
        imperativeFallbackButtonRef.current.remove();
        setHasCreatedImperativeFallback(false);
        imperativeFallbackButtonRef.current = null;
      }
    };
  }, [
    scriptLoadPhase,
    createImperativeFallback,
    hasCreatedImperativeFallback,
    isGenesysButtonRendered,
  ]);

  // Effect to handle legacy chat re-initialization when config changes
  useEffect(() => {
    // Ensure this only runs for legacy mode and if activeLegacyConfig is present
    if (chatMode === 'legacy' && activeLegacyConfig) {
      // Check if the config has actually changed to prevent unnecessary re-initializations
      if (
        prevActiveLegacyConfigRef.current &&
        JSON.stringify(prevActiveLegacyConfigRef.current) !==
          JSON.stringify(activeLegacyConfig)
      ) {
        logger.info(
          `${LOG_PREFIX} Legacy config changed. Attempting to reinitialize Genesys legacy chat.`,
          {
            newConfigUserId: activeLegacyConfig.userID, // Log a key field to see change
            oldConfigUserId: prevActiveLegacyConfigRef.current.userID,
          },
        );
        if (window.handleChatSettingsUpdate) {
          // Pass a deep clone of the config to avoid potential issues with object references
          window.handleChatSettingsUpdate(
            JSON.parse(JSON.stringify(activeLegacyConfig)),
          );
        } else {
          logger.warn(
            `${LOG_PREFIX} window.handleChatSettingsUpdate not found. Cannot reinitialize legacy chat dynamically.`,
          );
        }
      }
      // Update the ref with a deep clone of the current config for the next comparison
      prevActiveLegacyConfigRef.current = JSON.parse(
        JSON.stringify(activeLegacyConfig),
      );
    } else if (chatMode !== 'legacy') {
      // Clear the ref if not in legacy mode or no active legacy config
      prevActiveLegacyConfigRef.current = undefined;
    }
  }, [activeLegacyConfig, chatMode, storeActions]); // storeActions added if re-init needs to dispatch anything, for now it's mainly window call

  // Effect to show/hide native Genesys button based on PreChatModal state
  useEffect(() => {
    if (isPreChatModalOpen) {
      logger.debug(
        `${LOG_PREFIX} PreChat is open. Attempting to hide native Genesys button.`,
      );
      if (chatMode === 'legacy' && window._genesysCXBus) {
        try {
          (window._genesysCXBus as GenesysCXBus).command(
            'WebChat.hideChatButton',
          );
        } catch (e) {
          logger.warn(`${LOG_PREFIX} Error calling WebChat.hideChatButton:`, e);
        }
      } else if (chatMode === 'cloud') {
        // For cloud, a direct hide command is preferable if available.
        // Using a class as a placeholder for Messenger.hideButton() or similar.
        // window.Genesys?.('command', 'Messenger.hideButton'); // Example, if exists
        document.body.classList.add('prechat-panel-open');
        logger.info(
          `${LOG_PREFIX} Added .prechat-panel-open to body for cloud mode.`,
        );
      }
    } else {
      // PreChat is not open, decide if we need to show the button
      if (!isChatActive) {
        // Only show if a chat session isn't already active
        logger.debug(
          `${LOG_PREFIX} PreChat is closed and chat is not active. Attempting to show native Genesys button.`,
        );
        if (chatMode === 'legacy' && window._genesysCXBus) {
          try {
            (window._genesysCXBus as GenesysCXBus).command(
              'WebChat.showChatButton',
            );
          } catch (e) {
            logger.warn(
              `${LOG_PREFIX} Error calling WebChat.showChatButton:`,
              e,
            );
          }
        } else if (chatMode === 'cloud') {
          // window.Genesys?.('command', 'Messenger.showButton'); // Example, if exists
          document.body.classList.remove('prechat-panel-open');
          logger.info(
            `${LOG_PREFIX} Removed .prechat-panel-open from body for cloud mode.`,
          );
        }
      } else {
        logger.debug(
          `${LOG_PREFIX} PreChat is closed, but chat IS active. Native button remains hidden by Genesys widget. `,
        );
      }
    }
  }, [isPreChatModalOpen, chatMode, isChatActive]);

  // Conditional Rendering Logic
  if (isLoadingConfig && scriptLoadPhase === ScriptLoadPhase.INIT) {
    return (
      <div data-testid="chat-loading-config">Initializing Chat Service...</div>
    );
  }

  // Render script loaders only if chat is enabled and config is fully resolved
  const shouldRenderLoaders = isChatEnabled && genesysChatConfigFull;

  return (
    <>
      <div id={containerId} data-testid="chat-widget-container" />

      {shouldRenderLoaders && chatMode === 'cloud' && activeCloudConfig && (
        <GenesysCloudLoader
          useProdDeployment={activeCloudConfig.environment
            ?.toLowerCase()
            .includes('prod')}
          userData={activeCloudConfig.userData || {}} // Pass userData from the full config
          onLoad={() => {
            logger.info(
              `${LOG_PREFIX} Genesys Cloud Loader: onLoad triggered.`,
            );
            setIsCXBusReadyLocal(true); // Or specific Messenger ready state
            storeActions.setScriptLoadPhase(ScriptLoadPhase.LOADED);
          }}
          onError={(err) => {
            logger.error(`${LOG_PREFIX} Genesys Cloud Loader: onError.`, err);
            storeActions.setError(
              err instanceof Error
                ? err
                : new Error(String((err as any)?.message || err)),
            );
            storeActions.setScriptLoadPhase(ScriptLoadPhase.ERROR);
          }}
        />
      )}

      {shouldRenderLoaders && chatMode === 'legacy' && activeLegacyConfig && (
        <GenesysScriptLoader
          legacyConfig={activeLegacyConfig} // Pass the fully resolved legacy config
          onLoad={() => {
            logger.info(
              `${LOG_PREFIX} Genesys Legacy Loader: onLoad triggered.`,
            );
            // Actual CXBus readiness for legacy is handled by 'genesys:ready' DOM event
          }}
          onError={(err) => {
            logger.error(`${LOG_PREFIX} Genesys Legacy Loader: onError.`, err);
            storeActions.setError(
              err instanceof Error
                ? err
                : new Error(String((err as any)?.message || err)),
            );
            storeActions.setScriptLoadPhase(ScriptLoadPhase.ERROR);
          }}
          showStatus={showLoaderStatus}
        />
      )}

      {isPreChatModalOpen && genesysChatConfigFull && (
        <PreChatModal
          isOpen={isPreChatModalOpen}
          onOpenChange={(open) => {
            if (!open) storeActions.closePreChatModal();
          }}
          hasMultiplePlans={(genesysChatConfigFull.numberOfPlans || 0) > 1}
          currentPlanName={genesysChatConfigFull.currentPlanName}
          onSwitchPlanRequest={() => {
            storeActions.closePreChatModal();
            storeActions.openPlanSwitcherModal();
          }}
          onStartChatConfirm={handleStartChatConfirm}
        />
      )}

      {showChatErrorModal && (
        <ChatErrorDialog
          isOpen={showChatErrorModal}
          onOpenChange={(open) => {
            if (!open) {
              setShowChatErrorModal(false);
              // It's often good practice to clear the error when the dialog is dismissed
              // if no specific confirm action was taken that addresses the error.
              if (configError) {
                // Only clear if it was a configError shown
                storeActions.setError(null);
              }
            }
          }}
          title="Chat Error"
          errorMessage={configError?.message || standardErrorMessage}
          onConfirm={handleClearErrorAndReopen} // This function already handles error clearing and reopening attempts
          confirmText="Ok"
          // cancelText prop could be used if needed, default is "Cancel"
          // The default behavior of AlertDialogCancel (clicking it or pressing Esc)
          // should trigger onOpenChange(false)
        />
      )}

      {showFallbackButtonJSXState && !hasCreatedImperativeFallback && (
        <button
          id={DEDICATED_FALLBACK_BUTTON_ID}
          style={{
            /* Basic styles */ position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: 1000,
          }}
          data-testid="chat-fallback-button-render"
          aria-label="Chat with us fallback"
        >
          💬
        </button>
      )}
    </>
  );
}

declare global {
  interface Window {
    GenesysChat?: GenesysChat;
    _genesysCXBus?: GenesysCXBus | unknown;
    openPlanSwitcher?: () => void;
    OpenChatDisclaimer?: () => void;
    requestChatOpen?: () => void;
    _forceChatButtonCreate?: () => boolean;
    _genesys?: any;
    _genesysInitStatus?: any;
    _genesysDiagnostics?: () => void;
    handleChatSettingsUpdate?: (newSettings: LegacyChatConfig) => void;
    Genesys?: ((command: string, ...args: unknown[]) => unknown) | undefined;
  }
}
