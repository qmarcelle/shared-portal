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
  // const isChatOpenInStore = useChatStore((state) => state.ui.isOpen); // Less directly used now
  const buttonState = useChatStore((state) => state.ui.buttonState);
  const isPreChatModalOpen = useChatStore(
    (state) => state.ui.isPreChatModalOpen,
  ); // Reinstated: still used by PreChatModal component and some button visibility logic

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
      !isPreChatModalOpen; // Reinstated condition
    setShowFallbackButtonJSXState(shouldShowFallback);
    logger.debug(`${LOG_PREFIX} Fallback JSX button visibility update:`, {
      shouldShowFallback,
      forceFallbackButton,
      scriptLoadPhase,
      nativeButtonRendered: isGenesysButtonRendered(),
      isPreChatModalOpen, // Reinstated
    });
  }, [
    forceFallbackButton,
    scriptLoadPhase,
    isGenesysButtonRendered,
    isPreChatModalOpen, // Reinstated
  ]);

  // Effect for subscribing to custom DOM events from click_to_chat.js
  useEffect(() => {
    const handleGenesysReady = () => {
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

      if (!isChatEnabled || !genesysChatConfigFull) {
        logger.warn(
          `${LOG_PREFIX} window.requestChatOpen: Chat not enabled or not configured. Aborting.`,
          {
            isChatEnabled,
            hasFullConfig: !!genesysChatConfigFull,
          },
        );
        storeActions.setError(
          new Error(
            'Chat is currently unavailable. Please try again later or contact support.',
          ),
        );
        storeActions.setButtonState('failed');
        return;
      }

      logger.info(
        `${LOG_PREFIX} window.requestChatOpen: Attempting to command Genesys to open. Mode: ${chatMode}`,
        {
          isLegacyCXBusAvailable: !!window._genesysCXBus,
          isCloudGenesysApiAvailable: !!window.Genesys, // This is for cloud, legacy uses _genesysCXBus
          isGenesysLegacyChatReady: !!(window as any).genesysLegacyChatIsReady, // Check new flag
        },
      );

      if ((window as any).genesysLegacyChatIsReady) {
        logger.info(
          `${LOG_PREFIX} window.requestChatOpen: Genesys legacy chat is ready. Commanding WebChat.open directly.`,
        );
        const bus = window._genesysCXBus as any; // Cast to any
        if (bus && typeof bus.command === 'function') {
          try {
            bus.command('WebChat.open');
          } catch (e: any) {
            logger.error(
              `${LOG_PREFIX} Error commanding WebChat.open in requestChatOpen: ${e.message}`,
              e,
            );
            storeActions.setError(e);
            storeActions.setButtonState('failed');
          }
        } else {
          logger.warn(
            `${LOG_PREFIX} window.requestChatOpen: _genesysCXBus not available to command WebChat.open, though legacy chat reported as ready.`,
          );
          // This state suggests an issue with CXBus initialization in click_to_chat.js
          storeActions.setError(
            new Error(
              'Chat service CXBus not available. Please try again later.',
            ),
          );
          storeActions.setButtonState('failed');
        }
      } else {
        logger.info(
          `${LOG_PREFIX} window.requestChatOpen: Genesys legacy chat is NOT ready. Setting genesysLegacyChatOpenRequested = true.`,
        );
        (window as any).genesysLegacyChatOpenRequested = true;
        // Optionally, you could show a loading indicator or message here
        // e.g., storeActions.setButtonState('creating'); // Or a new pending state
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
      // Optionally show an error or a message to the user here
      storeActions.setError(
        new Error('Chat is currently unavailable or not configured.'),
      );
      setShowChatErrorModal(true);
      return;
    }

    // Directly attempt to open Genesys WebChat
    // This relies on click_to_chat.js defining window.requestChatOpen
    if (typeof window.requestChatOpen === 'function') {
      logger.info(
        `${LOG_PREFIX} Calling window.requestChatOpen() to directly open Genesys chat.`,
      );
      window.requestChatOpen();
    } else {
      logger.error(
        `${LOG_PREFIX} window.requestChatOpen is not defined. Cannot open Genesys chat. This function should be defined by click_to_chat.js.`,
      );
      storeActions.setError(
        new Error('Chat initiation function (requestChatOpen) is missing.'),
      );
      setShowChatErrorModal(true);
    }

    // Old logic for opening pre-chat modal - now bypassed
    // logger.info(`${LOG_PREFIX} Opening PreChatModal.`);
    // storeActions.openPreChatModal();
  }, [isChatEnabled, genesysChatConfigFull, storeActions]);

  // This function is now primarily for if you keep the PreChatModal for other purposes
  // or if Genesys itself needs to re-trigger a similar logic.
  // For the direct button click, handleChatButtonClick is now the entry point.
  const handleStartChatConfirm = useCallback(() => {
    debugger; // For step-through debugging
    logger.info(
      `${LOG_PREFIX} PreChatModal confirmed (or direct Genesys open attempted). Attempting to open/ensure Genesys chat.`,
      {
        currentChatMode: chatMode,
        isLegacyCXBusAvailable: !!window._genesysCXBus,
        isCloudGenesysApiAvailable: !!window.Genesys, // This will still be undefined if underlying issue isn't fixed
        isChatEnabled: isChatEnabled,
        hasFullConfig: !!genesysChatConfigFull,
      },
    );

    // storeActions.closePreChatModal(); // Closing pre-chat if it was somehow opened

    if (!isChatEnabled || !genesysChatConfigFull) {
      logger.error(
        `${LOG_PREFIX} Attempted to start chat, but chat is no longer enabled or not fully configured.`,
        {
          isChatEnabled,
          hasFullConfig: !!genesysChatConfigFull,
        },
      );
      storeActions.setError(
        new Error('Chat is currently unavailable or not configured.'),
      );
      setShowChatErrorModal(true); // Show error modal
      return;
    }

    logger.info(
      `${LOG_PREFIX} Attempting to command chat open. Mode: ${chatMode}`,
    );
    // Ensure CXBus is available for commands
    const bus = window._genesysCXBus as GenesysCXBus; // Type assertion
    const cloudApi = window.Genesys as GenesysChat['Genesys']; // Type assertion

    if (chatMode === 'legacy') {
      if (bus && typeof bus.command === 'function') {
        logger.info(
          `${LOG_PREFIX} window._genesysCXBus:`,
          typeof bus.command, // Changed from bus.publish to bus.command for logging
        );
        logger.info(`${LOG_PREFIX} window.Genesys:`, window.Genesys); // Log this critical object
        logger.info(`${LOG_PREFIX} Commanding WebChat.open for legacy`);
        try {
          bus.command('WebChat.open');
          // storeActions.startChat(); // Handled by 'genesys:webchat:opened'
        } catch (e) {
          logger.error(
            `${LOG_PREFIX} Error commanding WebChat.open for legacy:`,
            e,
          );
          storeActions.setError(
            new Error('Failed to command Genesys legacy chat to open.'),
          );
          setShowChatErrorModal(true);
        }
      } else {
        logger.error(
          `${LOG_PREFIX} Legacy CXBus not available to open chat. window._genesysCXBus:`,
          window._genesysCXBus,
        );
        storeActions.setError(new Error('Genesys legacy bus not ready.'));
        setShowChatErrorModal(true);
      }
    } else if (chatMode === 'cloud') {
      if (cloudApi && typeof cloudApi.command === 'function') {
        logger.info(`${LOG_PREFIX} Commanding Chat.open for cloud`);
        try {
          cloudApi.command('Chat.open');
          // storeActions.startChat(); // Handled by 'genesys:webchat:opened' or similar cloud event
        } catch (e) {
          logger.error(
            `${LOG_PREFIX} Error commanding Chat.open for cloud:`,
            e,
          );
          storeActions.setError(
            new Error('Failed to command Genesys cloud chat to open.'),
          );
          setShowChatErrorModal(true);
        }
      } else {
        logger.error(
          `${LOG_PREFIX} Cloud Genesys API not available to open chat. window.Genesys:`,
          window.Genesys,
        );
        storeActions.setError(new Error('Genesys cloud API not ready.'));
        setShowChatErrorModal(true);
      }
    }
  }, [
    chatMode,
    isChatEnabled,
    genesysChatConfigFull,
    storeActions,
    // Removed setShowChatErrorModal from deps as it's a setter
  ]);

  // Effect for managing the visibility of the Genesys native chat button
  // This effect tries to hide/show the cx_chat_form_button based on chat state
  useEffect(() => {
    if (isPreChatModalOpen) {
      logger.debug(
        `${LOG_PREFIX} PreChat is open. Attempting to hide native Genesys button.`,
      );
      if (chatMode === 'legacy') {
        const legacyButton = document.getElementById('cx_chat_form_button');
        if (legacyButton) {
          logger.info(
            `${LOG_PREFIX} Manually hiding legacy button (ID: cx_chat_form_button) by setting display:none.`,
          );
          legacyButton.style.display = 'none';
        } else {
          logger.warn(
            `${LOG_PREFIX} Legacy button (ID: cx_chat_form_button) not found in DOM to hide.`,
          );
        }
      } else if (chatMode === 'cloud') {
        document.body.classList.add('prechat-panel-open');
        // TODO: Find the official Genesys Cloud messenger command to hide/show the launcher button
        // and use it here instead of/in addition to the body class.
      }
    } else if (!isChatActive) {
      // Only show button again if chat didn't start (pre-chat was cancelled)
      // ADD/MODIFY LOGS HERE
      logger.debug(
        `${LOG_PREFIX} PreChat is closed and chat is NOT active. Attempting to show native Genesys button. DOM state for cx_chat_form_button:`,
        document.getElementById('cx_chat_form_button')
          ? 'Button Found In DOM'
          : 'Button NOT Found In DOM Immediately',
      );
      const legacyButton = document.getElementById('cx_chat_form_button');
      if (legacyButton) {
        logger.info(
          `${LOG_PREFIX} Manually showing legacy button (ID: cx_chat_form_button) by resetting display style.`,
        );
        legacyButton.style.display = ''; // Revert to default display (e.g., 'block', 'inline-block' based on its original CSS)
      } else {
        logger.warn(
          `${LOG_PREFIX} Legacy button (ID: cx_chat_form_button) not found in DOM to show. Current isPreChatModalOpen: ${isPreChatModalOpen}, isChatActive: ${isChatActive}`,
        );
        // debugger; // Optionally pause here to inspect DOM
      }
    } else if (chatMode === 'cloud') {
      document.body.classList.remove('prechat-panel-open');
      // TODO: Cloud command to show button
    }
  }, [isPreChatModalOpen, isChatActive, chatMode, storeActions]);

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

  // Render null or the appropriate chat loader
  if (scriptLoadPhase === ScriptLoadPhase.INIT && showLoaderStatus) {
    logger.info(
      `${LOG_PREFIX} Script load phase is INITIAL. Displaying loader status.`,
    );
    // Returning null instead of the status message div
    return null;
  }

  // Render script loaders only if chat is enabled and config is fully resolved
  const shouldRenderLoaders = isChatEnabled && genesysChatConfigFull;

  // If config is still loading, show a minimal loader or nothing
  if (isLoadingConfig && !genesysChatConfigFull) {
    logger.debug(
      `${LOG_PREFIX} Configuration is loading, rendering minimal UI.`,
    );
    return showLoaderStatus ? <div>Loading Chat Config...</div> : null;
  }

  // If config failed to load, show an error message or allow fallback.
  if (configError && !genesysChatConfigFull && !forceFallbackButton) {
    logger.error(
      `${LOG_PREFIX} Configuration error, rendering error UI.`,
      configError,
    );
    return showLoaderStatus ? (
      <div>Error loading chat config: {configError.message}</div>
    ) : null;
  }

  // If chat is explicitly disabled via config (e.g., isChatAvailable=false or isChatEligibleMember=false)
  // and not forcing fallback, render nothing or a disabled message.
  if (!isChatEnabled && !forceFallbackButton) {
    logger.info(
      `${LOG_PREFIX} Chat is not enabled (isChatAvailable or isChatEligibleMember is false), rendering nothing.`,
    );
    return showLoaderStatus ? <div>Chat is currently unavailable.</div> : null;
  }

  // At this point, either chat is enabled OR forceFallbackButton is true.
  // We must have genesysChatConfigFull to proceed with GenesysScriptLoader
  // or to provide a meaningful fallback experience.

  if (!genesysChatConfigFull && forceFallbackButton) {
    logger.warn(
      `${LOG_PREFIX} Forcing fallback button, but full config is missing. Fallback might be non-functional or use defaults.`,
    );
    // Render the JSX fallback button if state allows (it handles its own visibility)
    return (
      <>
        {showFallbackButtonJSXState && (
          <button
            id={DEDICATED_FALLBACK_BUTTON_ID}
            onClick={handleChatButtonClick}
            className="fixed bottom-5 right-5 z-[2147483647] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Open chat"
          >
            <MessageSquare className="h-6 w-6" />
          </button>
        )}
        <ChatErrorDialog
          isOpen={showChatErrorModal}
          onOpenChange={(open) => setShowChatErrorModal(open)}
          errorMessage={standardErrorMessage}
          title="Chat Error"
          onConfirm={() => setShowChatErrorModal(false)}
        />
      </>
    );
  }

  if (!genesysChatConfigFull) {
    logger.error(
      `${LOG_PREFIX} Full config still missing, cannot render Genesys loaders or functional fallback.`,
    );
    return showLoaderStatus ? (
      <div>Chat configuration is incomplete.</div>
    ) : null;
  }

  // Determine which loader to use
  const useCloudLoader = chatMode === 'cloud' && activeCloudConfig;
  const useLegacyLoader = chatMode === 'legacy' && activeLegacyConfig;

  // Debug output before rendering loaders
  logger.debug(`${LOG_PREFIX} Ready to render loaders.`, {
    chatMode,
    useCloudLoader: !!useCloudLoader,
    useLegacyLoader: !!useLegacyLoader,
    hasActiveCloudConfig: !!activeCloudConfig,
    hasActiveLegacyConfig: !!activeLegacyConfig,
    scriptLoadPhase,
    buttonState,
  });

  return (
    <div id={containerId} className="genesys-chat-widget-container">
      {showLoaderStatus && scriptLoadPhase !== ScriptLoadPhase.LOADED && (
        <div
          style={{
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            zIndex: 2147483647, // Max z-index
            fontSize: '12px',
          }}
        >
          Chat Status: {scriptLoadPhase} | Btn: {buttonState} | Mode:{' '}
          {genesysChatConfigFull?.chatMode || 'N/A'}
        </div>
      )}

      {useLegacyLoader && activeLegacyConfig && (
        <GenesysScriptLoader
          legacyConfig={activeLegacyConfig}
          cssUrls={[
            '/assets/genesys/plugins/widgets.min.css',
            '/assets/genesys/styles/bcbst-custom.css',
          ]}
          onLoad={() => {
            logger.info(
              `${LOG_PREFIX} GenesysScriptLoader (legacy) onLoad triggered.`,
            );
            // window.requestChatOpen might be defined by the script itself now
            // The 'genesys:ready' event should manage scriptLoadPhase and buttonState
          }}
          onError={(err) => {
            logger.error(
              `${LOG_PREFIX} GenesysScriptLoader (legacy) onError:`,
              err,
            );
            storeActions.setError(
              err || new Error('Legacy script loading failed.'),
            );
            storeActions.setScriptLoadPhase(ScriptLoadPhase.ERROR);
            setShowChatErrorModal(true);
          }}
        />
      )}

      {useCloudLoader && activeCloudConfig && (
        <GenesysCloudLoader
          useProdDeployment={activeCloudConfig.environment
            ?.toLowerCase()
            .includes('prod')}
          userData={activeCloudConfig.userData}
          onLoad={() => {
            logger.info(`${LOG_PREFIX} GenesysCloudLoader onLoad triggered.`);
            storeActions.setScriptLoadPhase(ScriptLoadPhase.LOADED);
            // Cloud loader might have its own way of signaling readiness or opening chat
          }}
          onError={(err: Error | unknown) => {
            logger.error(`${LOG_PREFIX} GenesysCloudLoader onError:`, err);
            storeActions.setError(
              err instanceof Error
                ? err
                : new Error(String(err || 'Cloud script loading failed.')),
            );
            storeActions.setScriptLoadPhase(ScriptLoadPhase.ERROR);
            setShowChatErrorModal(true);
          }}
        />
      )}

      {/* Fallback button rendered via JSX if needed */}
      {showFallbackButtonJSXState && (
        <button
          id={DEDICATED_FALLBACK_BUTTON_ID} // Ensure this ID is unique if imperative one is also used
          onClick={handleChatButtonClick}
          className="fixed bottom-5 right-5 z-[2147483647] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Open chat"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* PreChatModal is no longer opened by the main button click in this component */}
      {/* It can still be used if isPreChatModalOpen is set true by other means */}
      <PreChatModal
        isOpen={isPreChatModalOpen} // Will be false unless something else opens it
        onOpenChange={(open) => {
          if (!open) storeActions.closePreChatModal();
          // else storeActions.openPreChatModal(); // Or handle opening if necessary
        }}
        hasMultiplePlans={(genesysChatConfigFull?.numberOfPlans ?? 0) > 1}
        currentPlanName={genesysChatConfigFull?.currentPlanName}
        onSwitchPlanRequest={() => {
          logger.info(
            `${LOG_PREFIX} Switch plan requested from (now bypassed) PreChatModal.`,
          );
          if (typeof window.openPlanSwitcher === 'function') {
            window.openPlanSwitcher();
          }
        }}
        onStartChatConfirm={handleStartChatConfirm} // This will still be called if modal is shown
      />

      <ChatErrorDialog
        isOpen={showChatErrorModal}
        onOpenChange={(open) => setShowChatErrorModal(open)}
        errorMessage={standardErrorMessage}
        title="Chat Error"
        onConfirm={() => setShowChatErrorModal(false)}
      />
    </div>
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
    _genesys?: any; // More specific type if known, e.g., { widgets?: { main?: any, webchat?: any, onReady?: function } }
    _genesysInitStatus?: any;
    _genesysDiagnostics?: () => void;
    handleChatSettingsUpdate?: (newSettings: LegacyChatConfig) => void; // For dynamic updates
    Genesys?: ((command: string, ...args: unknown[]) => unknown) | undefined; // For Genesys Cloud or specific legacy APIs
  }
}
