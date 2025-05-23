'use client';

/**
 * @file ChatWidget.tsx
 * @description This component is the main UI/UX orchestrator for the Genesys chat.
 * It loads the appropriate Genesys script (legacy or cloud) based on configuration,
 * subscribes to Genesys events to update application state via chatStore,
 * and renders auxiliary UI like error modals.
 */

import { logger } from '@/utils/logger';
import { MessageSquare } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useChatStore } from '../stores/chatStore'; // ButtonState is not an export, use literals
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
  width: 56px !important;
  height: 56px !important;
  border-radius: 50% !important;
  background-color: #0078d4 !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
  cursor: pointer !important;
  z-index: 2147483647 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
`;

interface ChatWidgetProps {
  containerId?: string;
  showLoaderStatus?: boolean;
  forceFallbackButton?: boolean;
}

export default function ChatWidget({
  containerId = 'genesys-chat-container',
  showLoaderStatus = false,
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
  const { openPreChatModal, closePreChatModal } = storeActions;

  // Select individual pieces of state or logically grouped state
  // UI State
  const buttonState = useChatStore((state) => state.ui.buttonState);
  const isPreChatModalOpen = useChatStore(
    (state) => state.ui.isPreChatModalOpen,
  );

  // Config State
  const chatMode = useChatStore(
    (state) => state.config.genesysChatConfig?.chatMode ?? 'legacy',
  );
  const genesysChatConfigFull = useChatStore(
    (state) => state.config.genesysChatConfig,
  );
  const isLoadingConfig = useChatStore((state) => state.config.isLoading);
  const configError = useChatStore((state) => state.config.error);
  const isChatEnabled = useChatStore(
    (state) =>
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

  const activeLegacyConfig = useMemo(() => {
    if (genesysChatConfigFull?.chatMode === 'legacy') {
      return genesysChatConfigFull as LegacyChatConfig;
    }
    return undefined;
  }, [genesysChatConfigFull]);

  const activeCloudConfig = useMemo(() => {
    if (genesysChatConfigFull?.chatMode === 'cloud') {
      return genesysChatConfigFull as unknown as CloudChatConfig;
    }
    return undefined;
  }, [genesysChatConfigFull]);

  // Effect to log key state variables and define window.requestChatOpen
  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} Key state update. isChatEnabled: ${isChatEnabled}`,
      {
        isChatEnabled,
        chatMode,
        isLoadingConfig,
        configErrorMsg: configError?.message,
        scriptLoadPhase,
        buttonState,
        isChatActive,
        hasFullConfig: !!genesysChatConfigFull,
        hasActiveLegacyConfig: !!activeLegacyConfig,
        hasActiveCloudConfig: !!activeCloudConfig,
      },
    );

    // Define window.requestChatOpen to use our PreChatModal logic
    // This will override any definition from click_to_chat.js if it runs after
    (window as any).requestChatOpen = () => {
      logger.info(
        `${LOG_PREFIX} window.requestChatOpen (custom) called. Opening PreChatModal.`,
      );
      openPreChatModal(); // Use action from store
    };

    // Cleanup function
    return () => {
      // Consider if cleanup of requestChatOpen is truly needed or could cause issues
      // if other parts of the system expect it to persist.
      // For now, we'll leave it to be potentially overridden by subsequent mounts if any.
      // delete (window as any).requestChatOpen;
    };
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
    openPreChatModal, // Added dependency
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

  // Effect to subscribe to custom DOM events from click_to_chat.js
  useEffect(() => {
    const handleGenesysReady = () => {
      logger.info(
        `${LOG_PREFIX} Timestamp: ${Date.now()} - Event: 'genesys:ready' handler EXECUTED.`,
      );
      logger.info(`${LOG_PREFIX} Event: 'genesys:ready' received.`);
      storeActions.setButtonState('created');
      storeActions.setScriptLoadPhase(ScriptLoadPhase.LOADED);
      setIsCXBusReadyLocal(true);
      if (chatMode === 'legacy') {
        logger.info(
          `${LOG_PREFIX} Setting (window as any).genesysLegacyChatIsReady = true due to 'genesys:ready' event.`,
        );
        (window as any).genesysLegacyChatIsReady = true;

        if ((window as any).genesysLegacyChatOpenRequested) {
          logger.info(
            `${LOG_PREFIX} 'genesys:ready' received and open was previously requested. Attempting to open chat.`,
          );
          const bus = window._genesysCXBus as any;
          if (bus && typeof bus.command === 'function') {
            try {
              logger.info(
                `${LOG_PREFIX} Commanding WebChat.open from 'genesys:ready' handler because open was requested.`,
              );
              bus.command('WebChat.open');
              (window as any).genesysLegacyChatOpenRequested = false;
            } catch (e: any) {
              logger.error(
                `${LOG_PREFIX} Error commanding WebChat.open in 'genesys:ready' (after request): ${e.message}`,
                e,
              );
              storeActions.setError(e);
              storeActions.setButtonState('failed');
            }
          } else {
            logger.warn(
              `${LOG_PREFIX} _genesysCXBus not available in 'genesys:ready' handler (after request) despite 'genesys:ready' event.`,
            );
            storeActions.setError(
              new Error(
                'Chat CXBus became unavailable before open could be commanded.',
              ),
            );
            storeActions.setButtonState('failed');
          }
        }
      }
      storeActions.endChat();
      setShowChatErrorModal(true);
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

    const handleAppMainReady = () => {
      logger.info(
        `${LOG_PREFIX} Timestamp: ${Date.now()} - Event: 'genesys:appMainReady' handler EXECUTED.`,
      );
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
    document.addEventListener('genesys:appMainReady', handleAppMainReady);

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
      document.removeEventListener('genesys:appMainReady', handleAppMainReady);
    };
  }, [storeActions, chatMode]);

  // Effect to define global functions needed by click_to_chat.js
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

    // The user's version of window.requestChatOpen was complex and bypassed PreChatModal.
    // Restoring simpler version that triggers PreChatModal.
    // It's defined in the other useEffect now.

    return () => {
      delete (window as Window & typeof globalThis).openPlanSwitcher;
      delete (window as Window & typeof globalThis).OpenChatDisclaimer;
      // delete (window as Window & typeof globalThis).requestChatOpen; // requestChatOpen is managed in another useEffect
    };
  }, [storeActions, genesysChatConfigFull]); // Removed isChatEnabled, openPreChatModal as requestChatOpen moved

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
    storeActions.setError(null);

    if (isChatEnabled && genesysChatConfigFull && !isChatActive) {
      logger.info(
        `${LOG_PREFIX} Attempting to re-open PreChatModal after error dismissal.`,
      );
      openPreChatModal(); // Use action
    } else if (!isChatEnabled || !genesysChatConfigFull) {
      logger.warn(
        `${LOG_PREFIX} Chat cannot be reopened: chat not enabled or config missing.`,
      );
    }
  }, [
    storeActions,
    isChatEnabled,
    genesysChatConfigFull,
    isChatActive,
    openPreChatModal, // Added dependency
  ]);

  // Restored to trigger PreChatModal
  const handleChatButtonClick = useCallback(() => {
    logger.info(`${LOG_PREFIX} Custom or Fallback Chat Button Clicked.`);
    if (!isChatEnabled || !genesysChatConfigFull) {
      logger.warn(
        `${LOG_PREFIX} Chat button clicked, but chat is not enabled or not fully configured.`,
        {
          isChatEnabled,
          hasFullConfig: !!genesysChatConfigFull,
        },
      );
      storeActions.setError(
        new Error('Chat is currently unavailable or not configured.'),
      );
      setShowChatErrorModal(true);
      return;
    }
    // This now relies on the window.requestChatOpen defined in the earlier useEffect
    // which is set to call openPreChatModal()
    if (typeof (window as any).requestChatOpen === 'function') {
      logger.info(
        `${LOG_PREFIX} Calling (window as any).requestChatOpen() to trigger pre-chat modal.`,
      );
      (window as any).requestChatOpen();
    } else {
      logger.error(
        `${LOG_PREFIX} (window as any).requestChatOpen is not defined. Cannot open pre-chat modal.`,
      );
      storeActions.setError(
        new Error('Chat initiation function (requestChatOpen) is missing.'),
      );
      setShowChatErrorModal(true);
    }
  }, [isChatEnabled, genesysChatConfigFull, storeActions, openPreChatModal]); // Added openPreChatModal

  // This is called from PreChatModal's "Start Chat" button
  const handleStartChatConfirm = useCallback(() => {
    logger.info(
      `${LOG_PREFIX} PreChatModal confirmed. Attempting to open/ensure Genesys chat.`,
    );
    // The user's version was complex, reverting to a simpler bus call that was working previously.
    const cxBus =
      (window as any)._genesysCXBus || window._genesys?.widgets?.bus;

    if (cxBus) {
      logger.info(
        `${LOG_PREFIX} Attempting to command chat open. Mode: ${chatMode}. Using CXBus: ${(window as any)._genesysCXBus ? '_genesysCXBus' : '_genesys.widgets.bus'}`,
      );
      cxBus
        .command('WebChat.open', {})
        .done(() => {
          logger.info(
            `${LOG_PREFIX} WebChat.open command successful via CXBus.`,
          );
        })
        .fail((err: any) => {
          logger.error(
            `${LOG_PREFIX} WebChat.open command failed via CXBus.`,
            err,
          );
          setShowChatErrorModal(true);
        });

      // Legacy fallback can remain if needed
      if (chatMode === 'legacy') {
        logger.info(
          `${LOG_PREFIX} Attempting legacy WebChat.getInstance().open() as a fallback/additional step.`,
        );
        const webChatInstance =
          (window._genesys?.widgets?.legacy?.webchat?.getInstance &&
            window._genesys.widgets.legacy.webchat.getInstance()) ||
          ((window as any).Genesys?.webchat?.getInstance &&
            (window as any).Genesys.webchat.getInstance());
        if (webChatInstance) {
          webChatInstance.open();
          logger.info(
            `${LOG_PREFIX} Legacy WebChat.getInstance().open() called.`,
          );
        } else {
          logger.warn(
            `${LOG_PREFIX} Legacy WebChat.getInstance() not found for fallback call.`,
          );
        }
      }
    } else {
      logger.error(
        `${LOG_PREFIX} Genesys CXBus not available. Cannot open chat. Script load phase: ${scriptLoadPhase}`,
      );
      setShowChatErrorModal(true);
    }
    closePreChatModal(); // Close the pre-chat modal
  }, [chatMode, scriptLoadPhase, closePreChatModal, storeActions]); // Removed logger, setShowChatErrorModal as they are stable from component scope. Added storeActions

  // Effect for managing the visibility of the Genesys native chat button
  useEffect(() => {
    if (isPreChatModalOpen) {
      logger.debug(
        `${LOG_PREFIX} PreChat is open. Attempting to hide native Genesys button.`,
      );
      if (chatMode === 'legacy') {
        const legacyButton = document.getElementById('cx_chat_form_button');
        if (legacyButton) {
          legacyButton.style.display = 'none';
        }
      } else if (chatMode === 'cloud') {
        document.body.classList.add('prechat-panel-open');
      }
    } else if (!isChatActive) {
      logger.debug(
        `${LOG_PREFIX} PreChat is closed and chat is NOT active. Attempting to show native Genesys button.`,
      );
      const legacyButton = document.getElementById('cx_chat_form_button');
      if (legacyButton) {
        legacyButton.style.display = '';
      }
    } else if (chatMode === 'cloud') {
      document.body.classList.remove('prechat-panel-open');
    }
  }, [isPreChatModalOpen, isChatActive, chatMode]); // Removed storeActions as it's not used

  // Effect to handle legacy chat re-initialization
  useEffect(() => {
    if (chatMode === 'legacy' && activeLegacyConfig) {
      if (
        prevActiveLegacyConfigRef.current &&
        JSON.stringify(prevActiveLegacyConfigRef.current) !==
          JSON.stringify(activeLegacyConfig)
      ) {
        logger.info(
          `${LOG_PREFIX} Legacy config changed. Attempting to reinitialize.`,
        );
        if (window.handleChatSettingsUpdate) {
          window.handleChatSettingsUpdate(
            JSON.parse(JSON.stringify(activeLegacyConfig)),
          );
        }
      }
      prevActiveLegacyConfigRef.current = JSON.parse(
        JSON.stringify(activeLegacyConfig),
      );
    } else if (chatMode !== 'legacy') {
      prevActiveLegacyConfigRef.current = undefined;
    }
  }, [activeLegacyConfig, chatMode]);

  const handleScriptLoadSuccess = useCallback(() => {
    logger.info(
      `${LOG_PREFIX} Script load reported as SUCCESSFUL by child loader.`,
    );
    storeActions.setScriptLoadPhase(ScriptLoadPhase.LOADED);
  }, [storeActions]);

  const handleScriptLoadError = useCallback(
    (error: Error) => {
      logger.error(
        `${LOG_PREFIX} Script load reported as FAILED by child loader.`,
        error,
      );
      storeActions.setScriptLoadPhase(ScriptLoadPhase.ERROR);
      storeActions.setError(error);
      setShowChatErrorModal(true);
    },
    [storeActions],
  );

  const shouldAttemptScriptLoading = useMemo(() => {
    if (isLoadingConfig || !genesysChatConfigFull) {
      logger.info(
        `${LOG_PREFIX} NOT attempting script loading: config is loading or missing.`,
      );
      return false;
    }
    return true;
  }, [isLoadingConfig, genesysChatConfigFull]);

  // MODIFIED: Rendering Logic - use a variable and single return
  let loaderComponentToRender = null;

  if (!shouldAttemptScriptLoading) {
    logger.info(
      `${LOG_PREFIX} Render: Not attempting script loading due to preconditions.`,
    );
    loaderComponentToRender = showLoaderStatus ? (
      <div>{LOG_PREFIX} Config loading...</div>
    ) : null;
  } else {
    logger.info(
      `${LOG_PREFIX} Render: Preparing to render script loader. chatMode: ${chatMode}, isChatEnabled: ${isChatEnabled}`,
    );
    if (chatMode === 'legacy') {
      if (!activeLegacyConfig) {
        logger.warn(
          `${LOG_PREFIX} Render: Legacy mode, but activeLegacyConfig is missing.`,
        );
        loaderComponentToRender = showLoaderStatus ? (
          <div>{LOG_PREFIX} Legacy config not ready...</div>
        ) : null;
      } else {
        loaderComponentToRender = (
          <GenesysScriptLoader
            legacyConfig={activeLegacyConfig}
            isChatActuallyEnabled={isChatEnabled}
            onLoad={handleScriptLoadSuccess}
            onError={handleScriptLoadError}
            showStatus={showLoaderStatus}
            chatMode="legacy"
          />
        );
      }
    } else if (chatMode === 'cloud') {
      if (!activeCloudConfig) {
        logger.warn(
          `${LOG_PREFIX} Render: Cloud mode, but activeCloudConfig is missing.`,
        );
        loaderComponentToRender = showLoaderStatus ? (
          <div>{LOG_PREFIX} Cloud config not ready...</div>
        ) : null;
      } else {
        const transformedCloudConfig = {
          ...activeCloudConfig,
          userData: activeCloudConfig.userData
            ? Object.fromEntries(
                Object.entries(activeCloudConfig.userData).map(
                  ([key, value]) => [key, String(value)],
                ),
              )
            : undefined,
        };
        loaderComponentToRender = (
          <GenesysCloudLoader
            {...transformedCloudConfig}
            isChatActuallyEnabled={isChatEnabled}
            onLoad={handleScriptLoadSuccess}
            onError={handleScriptLoadError}
          />
        );
      }
    } else {
      logger.warn(
        `${LOG_PREFIX} Render: Unknown or unsupported chatMode: ${chatMode}`,
      );
      loaderComponentToRender = showLoaderStatus ? (
        <div>
          {LOG_PREFIX} Unknown chat mode: {chatMode}
        </div>
      ) : null;
    }
  }

  logger.info(
    `${LOG_PREFIX} Before return - isPreChatModalOpen: ${isPreChatModalOpen}`,
  );
  console.log(
    `${LOG_PREFIX} Before return - isPreChatModalOpen:`,
    isPreChatModalOpen,
  );

  // MODIFIED: Single return statement
  return (
    <>
      {loaderComponentToRender}
      {isPreChatModalOpen && (
        <PreChatModal
          isOpen={isPreChatModalOpen}
          onOpenChange={(open: boolean) => {
            if (!open) {
              closePreChatModal();
            } else {
              openPreChatModal(); // Should not be necessary if isOpen controls it
            }
          }}
          hasMultiplePlans={
            (genesysChatConfigFull as any)?.multiPlanData?.hasMultiplePlans ??
            false
          }
          currentPlanName={
            (genesysChatConfigFull as any)?.multiPlanData?.currentPlanName ??
            'Current Plan'
          }
          onSwitchPlanRequest={() => {
            logger.info('Switch plan requested from PreChatModal.');
            if ((window as any).openPlanSwitcher) {
              (window as any).openPlanSwitcher();
            }
            closePreChatModal();
          }}
          onStartChatConfirm={handleStartChatConfirm}
        />
      )}
      {showChatErrorModal && (
        <ChatErrorDialog
          isOpen={showChatErrorModal}
          onOpenChange={(open: boolean) => {
            if (!open) setShowChatErrorModal(false);
          }}
          title="Chat Error"
          errorMessage={standardErrorMessage}
          onConfirm={handleClearErrorAndReopen}
        />
      )}
      {showFallbackButtonJSXState && (
        <button
          style={
            {
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              zIndex: 2147483641,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0',
            } as React.CSSProperties
          }
          onClick={handleChatButtonClick}
          title="Chat with us"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </>
  );
}

// Helper to augment the global Window interface
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
    genesysLegacyChatIsReady?: boolean; // Flag used by user's custom requestChatOpen
    genesysLegacyChatOpenRequested?: boolean; // Flag used by user's custom requestChatOpen
  }
}
