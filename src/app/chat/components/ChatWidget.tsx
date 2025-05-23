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
  const { openPreChatModal, closePreChatModal } = storeActions;

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

  // This effect logs key state variables, including isChatEnabled, whenever they change.
  // This will help us see the sequence of isChatEnabled changes.
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
        hasActiveLegacyConfig: !!activeLegacyConfig, // Renamed for clarity
        hasActiveCloudConfig: !!activeCloudConfig, // Renamed for clarity
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

    // Cleanup function to remove the custom handler when the component unmounts
    return () => {
      if (
        (window as any).requestChatOpen &&
        typeof (window as any).requestChatOpen === 'function'
      ) {
        // Check if it's our function before deleting, though this is hard to do robustly
        // For now, just nullify it if we set it.
        // A more robust way might involve a flag or comparing the function reference if possible.
        // delete (window as any).requestChatOpen; // Or set to undefined
      }
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
    openPreChatModal, // Added openPreChatModal to dependency array
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
  }, [storeActions]);

  // Effect to define global functions needed by click_to_chat.js and general chat control
  useEffect(() => {
    (window as any).openPlanSwitcher = () => {
      logger.info(
        `${LOG_PREFIX} window.openPlanSwitcher called from Genesys UI.`,
      );
      if (window._genesysCXBus) {
        (window._genesysCXBus as GenesysCXBus).command('WebChat.close');
      }
      storeActions.openPlanSwitcherModal();
    };

    (window as any).OpenChatDisclaimer = () => {
      logger.info(
        `${LOG_PREFIX} window.OpenChatDisclaimer called from Genesys UI.`,
      );
      storeActions.openTnCModal(genesysChatConfigFull?.LOB || 'General');
    };

    return () => {
      delete (window as any).openPlanSwitcher;
      delete (window as any).OpenChatDisclaimer;
    };
  }, [storeActions, genesysChatConfigFull, isChatEnabled, openPreChatModal]);

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
      openPreChatModal(); // Use action
    } else if (!isChatEnabled || !genesysChatConfigFull) {
      logger.warn(
        `${LOG_PREFIX} Chat cannot be reopened: chat not enabled or config missing.`,
      );
      // Potentially trigger a re-fetch of config if that was the issue.
      // storeActions.loadChatConfiguration(...); // This would require parameters
    }
  }, [
    storeActions,
    isChatEnabled,
    genesysChatConfigFull,
    isChatActive,
    openPreChatModal,
  ]);

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

    if (typeof (window as any).requestChatOpen === 'function') {
      logger.info(
        `${LOG_PREFIX} Calling (window as any).requestChatOpen() to trigger pre-chat modal.`,
      );
      (window as any).requestChatOpen(); // This should now call our custom one
    } else {
      logger.error(
        `${LOG_PREFIX} (window as any).requestChatOpen is not defined. Cannot open pre-chat modal.`,
      );
      storeActions.setError(
        new Error('Chat initiation function (requestChatOpen) is missing.'),
      );
      setShowChatErrorModal(true);
    }
  }, [isChatEnabled, genesysChatConfigFull, storeActions]);

  // This function is now primarily for if you keep the PreChatModal for other purposes
  // or if Genesys itself needs to re-trigger a similar logic.
  // For the direct button click, handleChatButtonClick is now the entry point.
  const handleStartChatConfirm = useCallback(() => {
    console.log(
      '!!!!!!!!!!!!!!!!!!!!!!!! HANDLE START CHAT CONFIRM ENTERED !!!!!!!!!!!!!!!!!!!!!!!!',
    );
    logger.info(
      `${LOG_PREFIX} PreChatModal confirmed. Attempting to open/ensure Genesys chat.`,
      {
        currentChatMode: chatMode,
        isLegacyCXBusAvailable: !!window._genesysCXBus,
        isCloudGenesysApiAvailable: !!window.Genesys, // This will still be undefined if underlying issue isn't fixed
        isChatEnabled: isChatEnabled,
        hasFullConfig: !!genesysChatConfigFull,
      },
    );

    // storeActions.closePreChatModal(); // Closing pre-chat if it was somehow opened
    closePreChatModal(); // Use action

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

  // Standard handlers for script load success/error, if not already present
  const handleScriptLoadSuccess = useCallback(() => {
    logger.info(
      `${LOG_PREFIX} Script load reported as SUCCESSFUL by child loader.`,
    );
    storeActions.setScriptLoadPhase(ScriptLoadPhase.LOADED);
    // Potentially other actions like trying to find the button if not event-driven
  }, [storeActions]);

  const handleScriptLoadError = useCallback(
    (error: Error) => {
      logger.error(
        `${LOG_PREFIX} Script load reported as FAILED by child loader.`,
        error,
      );
      storeActions.setScriptLoadPhase(ScriptLoadPhase.ERROR);
      storeActions.setError(error); // Store the error
      setShowChatErrorModal(true); // Show error modal
    },
    [storeActions],
  );

  // Determine if we should even attempt to render script loaders
  const shouldAttemptScriptLoading = useMemo(() => {
    if (isLoadingConfig || !genesysChatConfigFull) {
      logger.info(
        `${LOG_PREFIX} NOT attempting script loading: config is loading or missing. isLoadingConfig: ${isLoadingConfig}, hasFullConfig: ${!!genesysChatConfigFull}`,
      );
      return false;
    }
    // Add any other essential preconditions before even trying to render a loader
    return true; // Default to true if basic config is present
  }, [isLoadingConfig, genesysChatConfigFull]);

  // Rendering Logic
  let loaderComponentToRender = null;
  if (!shouldAttemptScriptLoading) {
    logger.info(
      `${LOG_PREFIX} Render: Not attempting script loading due to preconditions (e.g., config loading/missing).`,
    );
    loaderComponentToRender = showLoaderStatus ? (
      <div>{LOG_PREFIX} Config loading...</div>
    ) : null;
  } else if (chatMode === 'legacy') {
    if (!activeLegacyConfig) {
      logger.warn(
        `${LOG_PREFIX} Render: Legacy mode, but activeLegacyConfig is missing. Cannot render GenesysScriptLoader.`,
      );
      loaderComponentToRender = showLoaderStatus ? (
        <div>{LOG_PREFIX} Legacy config not ready...</div>
      ) : null;
    } else {
      logger.info(
        `${LOG_PREFIX} Render: Rendering GenesysScriptLoader for LEGACY mode. isChatEnabled being passed: ${isChatEnabled}`,
      );
      loaderComponentToRender = (
        <GenesysScriptLoader
          legacyConfig={activeLegacyConfig}
          isChatActuallyEnabled={isChatEnabled} // Pass the crucial prop
          onLoad={handleScriptLoadSuccess}
          onError={handleScriptLoadError}
          showStatus={showLoaderStatus} // Pass this down if GenesysScriptLoader uses it
          chatMode="legacy"
        />
      );
    }
  } else if (chatMode === 'cloud') {
    if (!activeCloudConfig) {
      logger.warn(
        `${LOG_PREFIX} Render: Cloud mode, but activeCloudConfig is missing. Cannot render GenesysCloudLoader.`,
      );
      loaderComponentToRender = showLoaderStatus ? (
        <div>{LOG_PREFIX} Cloud config not ready...</div>
      ) : null;
    } else {
      logger.info(
        `${LOG_PREFIX} Render: Rendering GenesysCloudLoader for CLOUD mode. isChatEnabled being passed: ${isChatEnabled}`,
      );

      // Transform userData to ensure all values are strings for GenesysCloudLoader
      const transformedCloudConfig = activeCloudConfig
        ? {
            ...activeCloudConfig,
            userData: activeCloudConfig.userData
              ? Object.fromEntries(
                  Object.entries(activeCloudConfig.userData).map(
                    ([key, value]) => [key, String(value)],
                  ),
                )
              : undefined,
          }
        : undefined;

      if (!transformedCloudConfig) {
        logger.warn(
          `${LOG_PREFIX} Render: Cloud mode, but transformedCloudConfig is undefined (original activeCloudConfig was likely missing). Cannot render GenesysCloudLoader.`,
        );
        loaderComponentToRender = showLoaderStatus ? (
          <div>{LOG_PREFIX} Cloud config (transformed) not ready...</div>
        ) : null;
      } else {
        loaderComponentToRender = (
          <GenesysCloudLoader
            {...transformedCloudConfig}
            isChatActuallyEnabled={isChatEnabled}
            onLoad={handleScriptLoadSuccess}
            onError={handleScriptLoadError}
          />
        );
      }
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

  // Add this log to check the value of isPreChatModalOpen before rendering
  logger.info(
    `${LOG_PREFIX} Before return - isPreChatModalOpen: ${isPreChatModalOpen}`,
  );
  console.log(
    `${LOG_PREFIX} Before return - isPreChatModalOpen:`,
    isPreChatModalOpen,
  );

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
              openPreChatModal();
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
            // If open is true, it means the dialog is trying to open itself, which is fine.
            // We primarily care about when it wants to close.
          }}
          title="Chat Error" // Added title
          errorMessage={standardErrorMessage}
          onConfirm={handleClearErrorAndReopen} // Mapped to onConfirm
        />
      )}
      {showFallbackButtonJSXState && (
        <button
          style={
            {
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              width: 'auto',
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: '#0078d4',
              color: 'white',
              border: 'none',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              zIndex: 2147483647,
            } as React.CSSProperties
          }
          onClick={handleChatButtonClick}
        >
          Fallback Chat
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
    _genesys?: any; // More specific type if known, e.g., { widgets?: { main?: any, webchat?: any, onReady?: function } }
    _genesysInitStatus?: any;
    _genesysDiagnostics?: () => void;
    handleChatSettingsUpdate?: (newSettings: LegacyChatConfig) => void; // For dynamic updates
    Genesys?: ((command: string, ...args: unknown[]) => unknown) | undefined; // For Genesys Cloud or specific legacy APIs
  }
}
