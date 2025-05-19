'use client';

/**
 * @file ChatWidget.tsx
 * @description This component is the main UI/UX orchestrator for the Genesys chat.
 * As per README.md: "Renders chat container, manages UI based on store, handles CXBus events, renders loader."
 * Key Responsibilities:
 * - Renders the `div` container where the Genesys chat widget will be injected.
 * - Conditionally renders `GenesysScriptLoader` when `genesysChatConfig` is ready and chat is enabled.
 * - Waits for CXBus to be ready before interacting with the widget.
 * - Synchronizes the chat widget's open/closed state with the `chatStore` using `CXBus` commands (`WebChat.open`, `WebChat.close`).
 * - Subscribes to `CXBus` events (e.g., `WebChat.opened`, `WebChat.closed`, `WebChat.error`) to update the `chatStore`,
 *   ensuring a unidirectional data flow: UI/Store -> Widget Command -> Widget Event -> Store.
 * - Handles script loading success and errors from `GenesysScriptLoader`.
 * - Provides backwards compatibility for older `window.GenesysChat` methods if needed.
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
import {
  GenesysChat,
  GenesysCXBus,
  ScriptLoadPhase,
} from '../types/chat-types';
import { ChatLoadingState } from '../utils/chatSequentialLoader';
import GenesysCloudLoader from './GenesysCloudLoader';
import GenesysScriptLoader from './GenesysScriptLoader';

const LOG_PREFIX = '[ChatWidget]';

// Add a constant for diagnostic mode (enable by default for now)
const ENABLE_CHAT_BUTTON_DIAGNOSTICS = true;

interface ChatWidgetProps {
  /** Custom container ID (default: 'genesys-chat-container') */
  containerId?: string;
  /** Hide CoBrowse functionality - Note: Cobrowse is primarily configured via genesysChatConfig */
  hideCoBrowse?: boolean;
  /** Show script loader status indicator */
  showLoaderStatus?: boolean;
  /** Callback when chat is opened */
  onChatOpened?: () => void;
  /** Callback when chat is closed */
  onChatClosed?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
}

export default function ChatWidget({
  containerId = 'genesys-chat-container',
  hideCoBrowse = true,
  showLoaderStatus = process.env.NODE_ENV === 'development',
  onChatOpened,
  onChatClosed,
  onError,
}: ChatWidgetProps) {
  // === ALL HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP LEVEL ===
  const isMounted = useRef(false);
  const instanceId = useRef(`chat-widget-${Date.now()}`);
  const cxBusCommandQueue = useRef<Array<() => void>>([]);
  const [isCXBusReady, setIsCXBusReady] = useState(false);
  const cxBusSubscriptionsSetup = useRef(false);
  const cxBusPollTimer = useRef<NodeJS.Timeout | null>(null);
  const activeSubscriptions = useRef<{ [key: string]: boolean }>({});
  const [showChatErrorModal, setShowChatErrorModal] = useState(false);
  const [showFallbackButton, setShowFallbackButton] = useState(false);
  const buttonCheckAttempts = useRef(0);
  const MAX_BUTTON_CHECK_ATTEMPTS = 20;
  // Add a new state to specifically track full Genesys initialization
  const [isGenesysFullyInitialized, setIsGenesysFullyInitialized] =
    useState(false);
  const genesysInitCheckAttempts = useRef(0);
  const MAX_GENESYS_INIT_CHECK_ATTEMPTS = 40; // Allow more attempts for initialization check

  // Get state from store using selectors
  const isOpen = useChatStore(chatUISelectors.isOpen);
  const chatMode = useChatStore(chatConfigSelectors.chatMode);
  const buttonState = useChatStore(chatUISelectors.buttonState);
  const legacyConfig = useChatStore((state) => state.config.legacyConfig);
  const cloudConfig = useChatStore((state) => state.config.cloudConfig);
  const isLoading = useChatStore(chatConfigSelectors.isLoading);
  const error = useChatStore(chatConfigSelectors.error);
  const isChatEnabled = useChatStore(chatConfigSelectors.isChatEnabled);
  const scriptLoadPhase = useChatStore(chatScriptSelectors.scriptLoadPhase);
  const genesysCloudConfig = useChatStore(
    chatConfigSelectors.genesysCloudDeploymentConfig,
  );
  const standardErrorMessage = useChatStore(
    chatSessionSelectors.standardErrorMessage,
  );

  // Get actions from store
  const setScriptLoadPhase = useChatStore(
    (state) => state.actions.setScriptLoadPhase,
  );
  const setError = useChatStore((state) => state.actions.setError);
  const setOpen = useChatStore((state) => state.actions.setOpen);
  const setButtonState = useChatStore((state) => state.actions.setButtonState);

  // Derived state (safe to compute after hooks)
  const genesysChatConfig = chatMode === 'legacy' ? legacyConfig : cloudConfig;

  // Log initial props and critical state
  logger.info(`${LOG_PREFIX} Component instance created/rendered.`, {
    containerId,
    initialIsChatEnabled: useChatStore.getState().config.chatData?.isEligible, // getState is fine here for initial log
    chatModeFromStore: chatMode,
    hasLegacyConfig: !!legacyConfig,
    hasCloudConfig: !!cloudConfig,
  });

  // Callbacks (defined with useCallback)
  const handleClearErrorAndReopen = useCallback(() => {
    setError(null);
    setShowChatErrorModal(false);
    setOpen(true);
  }, [setError, setOpen]);

  const handleCXBusReady = useCallback(() => {
    logger.info(
      `${LOG_PREFIX} handleCXBusReady: CXBus is ready as reported by GenesysScriptLoader.`,
    );
    setIsCXBusReady(true);
    setScriptLoadPhase(ScriptLoadPhase.LOADED);
    if (cxBusCommandQueue.current.length > 0) {
      logger.info(
        `${LOG_PREFIX} Executing ${cxBusCommandQueue.current.length} queued CXBus commands.`,
      );
      cxBusCommandQueue.current.forEach((command) => {
        try {
          command();
        } catch (err) {
          logger.error(`${LOG_PREFIX} Error executing queued command:`, err);
        }
      });
      cxBusCommandQueue.current = [];
    }
  }, [setScriptLoadPhase]);

  const handleScriptError = useCallback(
    (err: Error) => {
      logger.error(`${LOG_PREFIX} handleScriptError: Script loading failed.`, {
        error: err.message,
        stack: err.stack,
      });
      setScriptLoadPhase(ScriptLoadPhase.ERROR);
      setError(new Error(standardErrorMessage));
      setShowChatErrorModal(true);
      if (onError) onError(err);
    },
    [setScriptLoadPhase, setError, onError, standardErrorMessage],
  );

  // Add a new useEffect specifically for checking complete Genesys initialization
  useEffect(() => {
    if (!isCXBusReady || isGenesysFullyInitialized) {
      return; // Don't check if CXBus isn't ready yet or if we've already determined Genesys is initialized
    }

    const checkGenesysInitialization = () => {
      genesysInitCheckAttempts.current += 1;

      // Most importantly check if widgets.main.initialise is a function
      const isFullyInitialized = !!(
        window._genesys &&
        window._genesys.widgets &&
        window._genesys.widgets.main &&
        typeof window._genesys.widgets.main.initialise === 'function'
      );

      logger.info(
        `${LOG_PREFIX} Checking full Genesys initialization (attempt ${genesysInitCheckAttempts.current}/${MAX_GENESYS_INIT_CHECK_ATTEMPTS}): ${isFullyInitialized ? 'SUCCESS' : 'NOT READY'}`,
      );

      if (isFullyInitialized) {
        setIsGenesysFullyInitialized(true);
        return true;
      }

      if (genesysInitCheckAttempts.current >= MAX_GENESYS_INIT_CHECK_ATTEMPTS) {
        logger.error(
          `${LOG_PREFIX} Genesys widgets.main.initialise not available after ${MAX_GENESYS_INIT_CHECK_ATTEMPTS} attempts`,
        );
        // Don't set state to failed here, let button creation handle that
        return false;
      }

      return false;
    };

    // Initial check
    if (checkGenesysInitialization()) {
      return; // Already initialized
    }

    // Set up interval to check for full initialization
    const initCheckInterval = setInterval(() => {
      if (checkGenesysInitialization()) {
        clearInterval(initCheckInterval);
      }
    }, 200); // Check every 200ms

    return () => {
      clearInterval(initCheckInterval);
    };
  }, [isCXBusReady, isGenesysFullyInitialized]);

  // Modify checkGenesysButton to wait for full initialization
  const checkGenesysButton = useCallback(() => {
    // Skip check if button is already created or failed
    if (buttonState === 'created') {
      logger.info(
        `${LOG_PREFIX} *** LOOP DIAGNOSTIC *** checkGenesysButton: Button already created, skipping checks`,
      );
      return;
    }

    if (buttonState === 'failed') {
      logger.info(
        `${LOG_PREFIX} *** LOOP DIAGNOSTIC *** checkGenesysButton: Previous check failed, skipping further checks`,
      );
      return;
    }

    // Wait for Genesys to be fully initialized before attempting to create buttons
    if (!isGenesysFullyInitialized && isCXBusReady) {
      logger.info(
        `${LOG_PREFIX} *** LOOP DIAGNOSTIC *** checkGenesysButton: Waiting for Genesys to fully initialize`,
      );
      return;
    }

    // Only increment the counter if we're actively checking
    buttonCheckAttempts.current += 1;

    logger.info(
      `${LOG_PREFIX} *** LOOP DIAGNOSTIC *** checkGenesysButton: Starting button check (attempt ${buttonCheckAttempts.current}/${MAX_BUTTON_CHECK_ATTEMPTS}), current buttonState: ${buttonState}`,
    );

    const selectors = [
      '.cx-widget.cx-webchat-chat-button',
      '.cx-webchat-chat-button',
      '[data-cx-widget="WebChat"]',
      '.cx-button.cx-webchat',
    ];

    let button: Element | null = null;
    for (const selector of selectors) {
      button = document.querySelector(selector);
      if (button) {
        logger.info(
          `${LOG_PREFIX} *** LOOP DIAGNOSTIC *** checkGenesysButton: Found button using selector: ${selector}`,
        );
        break;
      }
    }

    if (button) {
      // Only update state if not already 'created'
      logger.info(
        `${LOG_PREFIX} *** LOOP DIAGNOSTIC *** checkGenesysButton: Button found, setting state to 'created' from ${buttonState}`,
      );
      // Always set to created to ensure button is properly styled
      useChatStore.getState().actions.setButtonState('created');

      try {
        // Add a class rather than inline styles for better performance
        const buttonEl = button as HTMLElement;
        buttonEl.classList.add('genesys-chat-button-positioned');
      } catch (err) {
        logger.warn(`${LOG_PREFIX} Error applying button classes:`, err);
      }
    } else {
      logger.warn(
        `${LOG_PREFIX} *** LOOP DIAGNOSTIC *** checkGenesysButton: Button NOT found on attempt ${buttonCheckAttempts.current}, current buttonState: ${buttonState}`,
      );

      if (isCXBusReady && window._genesysCXBus) {
        logger.info(
          `${LOG_PREFIX} *** LOOP DIAGNOSTIC *** checkGenesysButton: Attempting to create button via CXBus`,
        );

        // Update buttonState to 'creating' if it's currently 'not-attempted'
        if (buttonState === 'not-attempted') {
          logger.info(
            `${LOG_PREFIX} *** LOOP DIAGNOSTIC *** checkGenesysButton: Setting state to 'creating' from ${buttonState}`,
          );
          useChatStore.getState().actions.setButtonState('creating');
        }

        try {
          window._genesysCXBus.command('WebChat.showChatButton');
        } catch (err) {
          logger.error(`${LOG_PREFIX} Error creating button via CXBus:`, err);
        }
      }

      // Set to failed state if we've reached the maximum attempts
      if (buttonCheckAttempts.current >= MAX_BUTTON_CHECK_ATTEMPTS) {
        logger.warn(
          `${LOG_PREFIX} *** LOOP DIAGNOSTIC *** checkGenesysButton: Max attempts reached, setting state to 'failed' from ${buttonState}`,
        );
        useChatStore.getState().actions.setButtonState('failed');
      }
    }
  }, [buttonState, isCXBusReady, isGenesysFullyInitialized, setOpen]);

  // useEffect Hooks
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (
        window._chatWidgetInstanceId &&
        window._chatWidgetInstanceId !== instanceId.current
      ) {
        logger.warn(
          `${LOG_PREFIX} Another ChatWidget instance already exists (${window._chatWidgetInstanceId}). This instance (${instanceId.current}) will be passive.`,
        );
        return;
      }
      window._chatWidgetInstanceId = instanceId.current;
      logger.info(
        `${LOG_PREFIX} Registered as the active ChatWidget instance: ${instanceId.current}`,
      );
      return () => {
        if (window._chatWidgetInstanceId === instanceId.current) {
          window._chatWidgetInstanceId = undefined;
          logger.info(
            `${LOG_PREFIX} Unregistered as the active ChatWidget instance: ${instanceId.current}`,
          );
        }
      };
    }
  }, [instanceId]); // instanceId.current is stable, so this runs like onMount/onUnmount

  useEffect(() => {
    if (
      isMounted.current ||
      (window._chatWidgetInstanceId &&
        window._chatWidgetInstanceId !== instanceId.current)
    ) {
      return;
    }
    isMounted.current = true;
    let containerElement = document.getElementById(containerId);
    if (!containerElement) {
      logger.info(
        `${LOG_PREFIX} Creating missing container element with id: ${containerId}`,
      );
      containerElement = document.createElement('div');
      containerElement.id = containerId;
      containerElement.setAttribute('data-chat-container', 'true');
      document.body.appendChild(containerElement);
    } else {
      logger.info(
        `${LOG_PREFIX} Container element already exists with id: ${containerId}`,
      );
    }
    containerElement.style.position = 'static';
    containerElement.style.zIndex = 'auto';
    containerElement.style.minHeight = '10px';
    containerElement.style.minWidth = '10px';
    containerElement.dataset.initialized = 'true';
  }, [containerId, instanceId]); // instanceId added for active check consistency

  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} useEffect: Setting up legacy document event listeners (genesys:webchat:*).`,
    );
    const handleChatOpenedEvent = () => {
      logger.info(
        `${LOG_PREFIX} Legacy event 'genesys:webchat:opened' received.`,
      );
      useChatStore.getState().actions.setOpen(true);
      useChatStore.getState().actions.startChat();
      if (onChatOpened) onChatOpened();
    };
    const handleChatClosedEvent = () => {
      logger.info(
        `${LOG_PREFIX} Legacy event 'genesys:webchat:closed' received.`,
      );
      useChatStore.getState().actions.setOpen(false);
      useChatStore.getState().actions.endChat();
      if (onChatClosed) onChatClosed();
    };
    const handleErrorEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const errorDetail =
        customEvent.detail?.error ||
        customEvent.detail?.message ||
        standardErrorMessage;
      logger.error(
        `${LOG_PREFIX} Legacy event 'genesys:script:error' or 'genesys:webchat:error' received.`,
        { error: errorDetail, eventType: e.type },
      );
      setError(
        new Error(
          typeof errorDetail === 'string' ? errorDetail : standardErrorMessage,
        ),
      );
      setShowChatErrorModal(true);
      if (onError)
        onError(
          errorDetail instanceof Error
            ? errorDetail
            : new Error(String(errorDetail)),
        );
    };
    document.addEventListener('genesys:webchat:opened', handleChatOpenedEvent);
    document.addEventListener('genesys:webchat:closed', handleChatClosedEvent);
    document.addEventListener('genesys:script:error', handleErrorEvent);
    document.addEventListener('genesys:webchat:error', handleErrorEvent);
    document.addEventListener(
      'genesys:webchat:failedToStart',
      handleErrorEvent,
    );
    return () => {
      logger.info(
        `${LOG_PREFIX} useEffect: Cleaning up legacy document event listeners.`,
      );
      document.removeEventListener(
        'genesys:webchat:opened',
        handleChatOpenedEvent,
      );
      document.removeEventListener(
        'genesys:webchat:closed',
        handleChatClosedEvent,
      );
      document.removeEventListener('genesys:script:error', handleErrorEvent);
      document.removeEventListener('genesys:webchat:error', handleErrorEvent);
      document.removeEventListener(
        'genesys:webchat:failedToStart',
        handleErrorEvent,
      );
    };
  }, [onChatOpened, onChatClosed, onError, setError, standardErrorMessage]);

  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} useEffect: Setting up backwards compatibility for window.GenesysChat methods.`,
    );
    if (typeof window !== 'undefined') {
      const originalGenesysChat = window.GenesysChat || {};
      const originalOpenChat = originalGenesysChat.openChat;
      const originalCloseChat = originalGenesysChat.closeChat;
      if (!originalOpenChat) {
        logger.info(
          `${LOG_PREFIX} window.GenesysChat.openChat not found. Adding compatibility method.`,
        );
        if (!window.GenesysChat) window.GenesysChat = {};
        window.GenesysChat.openChat = () => {
          logger.info(
            `${LOG_PREFIX} Compatibility window.GenesysChat.openChat() called. Updating store.`,
          );
          useChatStore.getState().actions.setOpen(true);
        };
      }
      if (!originalCloseChat) {
        logger.info(
          `${LOG_PREFIX} window.GenesysChat.closeChat not found. Adding compatibility method.`,
        );
        if (!window.GenesysChat) window.GenesysChat = {};
        window.GenesysChat.closeChat = () => {
          logger.info(
            `${LOG_PREFIX} Compatibility window.GenesysChat.closeChat() called. Updating store.`,
          );
          useChatStore.getState().actions.setOpen(false);
        };
      }
    }
  }, []);

  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} useEffect: CXBus setup initiated. isCXBusReady: ${isCXBusReady}`,
    );
    if (
      window._chatWidgetInstanceId &&
      window._chatWidgetInstanceId !== instanceId.current
    ) {
      logger.info(
        `${LOG_PREFIX} Not the active instance, skipping event subscriptions.`,
      );
      return;
    }
    if (!isCXBusReady) {
      logger.info(
        `${LOG_PREFIX} CXBus not ready yet, skipping event subscriptions.`,
      );
      return;
    }
    const setupSubscriptions = () => {
      if (window._genesysCXBus && !cxBusSubscriptionsSetup.current) {
        logger.info(
          `${LOG_PREFIX} CXBus is ready. Setting up event subscriptions (WebChat.opened, WebChat.closed, WebChat.error).`,
        );
        cxBusSubscriptionsSetup.current = true;
        const registerSubscription = (
          event: string,
          callback: (...args: any[]) => void,
        ) => {
          if (activeSubscriptions.current[event]) {
            logger.info(
              `${LOG_PREFIX} Already subscribed to ${event}, skipping.`,
            );
            return;
          }
          window._genesysCXBus?.subscribe(event, callback);
          activeSubscriptions.current[event] = true;
          logger.info(`${LOG_PREFIX} Subscribed to CXBus event: ${event}`);
        };
        registerSubscription('WebChat.opened', () => {
          logger.info(
            `${LOG_PREFIX} CXBus event: WebChat.opened. Updating store.`,
          );
          useChatStore.getState().actions.setOpen(true);
          useChatStore.getState().actions.startChat();
          if (onChatOpened) onChatOpened();
        });
        registerSubscription('WebChat.agentConnected', (e) => {
          logger.info(`${LOG_PREFIX} CXBus event: Agent connected to chat.`, {
            agentDetails: e,
          });
        });
        registerSubscription('WebChat.agentDisconnected', (e) => {
          logger.info(
            `${LOG_PREFIX} CXBus event: Agent disconnected from chat.`,
            { reason: e },
          );
        });
        registerSubscription('WebChat.ended', (e) => {
          logger.info(`${LOG_PREFIX} CXBus event: Chat session ended.`, {
            reason: e,
          });
        });
        registerSubscription('WebChat.failedToStart', (e) => {
          logger.error(`${LOG_PREFIX} CXBus event: Chat failed to start.`, {
            error: e,
          });
          setError(new Error(standardErrorMessage));
          setShowChatErrorModal(true);
        });
        registerSubscription('WebChat.closed', () => {
          logger.info(
            `${LOG_PREFIX} CXBus event: WebChat.closed. Updating store.`,
          );
          useChatStore.getState().actions.setOpen(false);
          useChatStore.getState().actions.endChat();
          if (onChatClosed) onChatClosed();
        });
        registerSubscription(
          'WebChat.error',
          (e: { data?: any; error?: any }) => {
            const errorDetail = e.data || e.error || standardErrorMessage;
            logger.error(
              `${LOG_PREFIX} CXBus event: WebChat.error. Updating store.`,
              { error: errorDetail, eventData: e },
            );
            const errorToSet =
              errorDetail instanceof Error
                ? errorDetail
                : new Error(
                    typeof errorDetail === 'string'
                      ? errorDetail
                      : standardErrorMessage,
                  );
            setError(errorToSet);
            setShowChatErrorModal(true);
            if (onError) onError(errorToSet);
          },
        );
        logger.info(`${LOG_PREFIX} CXBus subscriptions complete.`);
      } else if (cxBusSubscriptionsSetup.current) {
        logger.info(`${LOG_PREFIX} CXBus subscriptions already set up.`);
      }
    };
    setupSubscriptions();
    return () => {
      if (
        window._chatWidgetInstanceId === instanceId.current &&
        cxBusSubscriptionsSetup.current &&
        window._genesysCXBus
      ) {
        logger.info(`${LOG_PREFIX} Cleaning up CXBus subscriptions.`);
        Object.keys(activeSubscriptions.current).forEach((event) => {
          if (activeSubscriptions.current[event] && window._genesysCXBus) {
            try {
              window._genesysCXBus.unsubscribe(event);
              logger.info(
                `${LOG_PREFIX} Unsubscribed from CXBus event: ${event}`,
              );
              activeSubscriptions.current[event] = false;
            } catch (err) {
              logger.error(
                `${LOG_PREFIX} Error unsubscribing from ${event}:`,
                err,
              );
            }
          }
        });
        cxBusSubscriptionsSetup.current = false;
      }
    };
  }, [
    isCXBusReady,
    onChatOpened,
    onChatClosed,
    onError,
    setError,
    standardErrorMessage,
    instanceId,
  ]);

  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} useEffect: isOpen state sync check. isOpen: ${isOpen}, isCXBusReady: ${isCXBusReady}`,
    );
    if (
      window._chatWidgetInstanceId &&
      window._chatWidgetInstanceId !== instanceId.current
    ) {
      logger.info(
        `${LOG_PREFIX} Not the active instance, skipping isOpen state sync.`,
      );
      return;
    }
    const executeChatCommand = () => {
      if (!window._genesysCXBus) {
        logger.warn(
          `${LOG_PREFIX} CXBus not available even though isCXBusReady is true. Cannot sync isOpen state to widget.`,
        );
        return;
      }
      try {
        const currentWidgetState: any =
          window._genesysCXBus.command('WebChat.get');
        logger.info(
          `${LOG_PREFIX} Current widget state before command:`,
          currentWidgetState,
        );
        if (isOpen && currentWidgetState?.data?.state !== 'opened') {
          logger.info(
            `${LOG_PREFIX} Store isOpen is true. Commanding WebChat.open via CXBus.`,
          );
          window._genesysCXBus.command('WebChat.open');
        } else if (!isOpen && currentWidgetState?.data?.state !== 'closed') {
          logger.info(
            `${LOG_PREFIX} Store isOpen is false. Commanding WebChat.close via CXBus.`,
          );
          window._genesysCXBus.command('WebChat.close');
        }
      } catch (err) {
        logger.error(
          `${LOG_PREFIX} Error commanding WebChat open/close via CXBus:`,
          err,
        );
      }
    };
    if (isCXBusReady && window._genesysCXBus) {
      executeChatCommand();
    } else {
      logger.info(
        `${LOG_PREFIX} CXBus not ready OR window._genesysCXBus not yet available, queuing isOpen state sync command. isCXBusReady: ${isCXBusReady}`,
      );
      cxBusCommandQueue.current.push(executeChatCommand);
    }
  }, [isOpen, isCXBusReady, instanceId]);

  useEffect(() => {
    const loadingState = ChatLoadingState.scriptState.isLoading;
    const loadingComplete = ChatLoadingState.scriptState.isComplete;
    const apiComplete = ChatLoadingState.apiState.isComplete;
    const apiEligible = ChatLoadingState.apiState.isEligible;
    logger.info(`${LOG_PREFIX} Monitoring sequential loader state changes:`, {
      scriptLoadPhase,
      apiComplete,
      apiEligible,
      loadingState,
      loadingComplete,
      hasGenesysConfig: !!genesysChatConfig,
    });
    if (scriptLoadPhase === ScriptLoadPhase.LOADED && chatMode === 'legacy') {
      logger.info(
        `${LOG_PREFIX} scriptLoadPhase is LOADED and chatMode is legacy. Button creation is now primarily handled by the isCXBusReady effect.`,
      );
      // Ensure container exists, but do not force button creation here.
      let containerElement = document.getElementById(containerId);
      if (!containerElement) {
        logger.info(
          `${LOG_PREFIX} Creating container element with id: ${containerId} (from scriptLoadPhase effect)`,
        );
        containerElement = document.createElement('div');
        containerElement.id = containerId;
        containerElement.setAttribute('data-chat-container', 'true');
        document.body.appendChild(containerElement);
      } else {
        logger.info(
          `${LOG_PREFIX} Container element ${containerId} already exists (checked in scriptLoadPhase effect)`,
        );
      }
      // The complex logic involving _forceChatButtonCreate, timeouts, and style injection
      // has been removed from this useEffect hook. The useEffect hook dependent on `isCXBusReady`
      // is now the primary place where button checking and creation attempts are orchestrated.
    }
  }, [scriptLoadPhase, genesysChatConfig, chatMode, containerId]);

  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} Current system state (useEffect for fallback button):`,
      {
        // Renamed log for clarity
        apiState: {
          isComplete: ChatLoadingState.apiState.isComplete,
          isEligible: ChatLoadingState.apiState.isEligible,
          chatMode: ChatLoadingState.apiState.chatMode,
        },
        scriptState: {
          isComplete: ChatLoadingState.scriptState.isComplete,
          isLoading: ChatLoadingState.scriptState.isLoading,
          attempts: ChatLoadingState.scriptState.loadAttempts,
        },
        hasGenesysConfig: !!genesysChatConfig,
        configKeyCount: genesysChatConfig
          ? Object.keys(genesysChatConfig).length
          : 0,
        targetContainer:
          genesysChatConfig && 'targetContainer' in genesysChatConfig
            ? genesysChatConfig.targetContainer
            : 'undefined',
      },
    );

    // This is the effect that was previously identified by the line number
    if (isChatEnabled && scriptLoadPhase === ScriptLoadPhase.LOADED) {
      const buttonCheckTimer = setTimeout(() => {
        const genesysButton = document.querySelector(
          '.cx-widget.cx-webchat-chat-button',
        );
        if (!genesysButton) {
          console.log(
            `${LOG_PREFIX} Genesys button not found after 5s - adding fallback button (from dedicated useEffect)`,
          );
          const fallbackButton = document.createElement('button');
          fallbackButton.innerText = 'Chat with us';
          fallbackButton.id = 'fallback-chat-button-dedicated'; // Unique ID
          fallbackButton.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background-color: #0056b3; color: white; padding: 10px 20px;
            border-radius: 4px; border: none; cursor: pointer;
            font-size: 14px; font-weight: bold; z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          `;
          fallbackButton.onclick = () => {
            setOpen(true); // Use the hook from the outer scope
            if (window._genesysCXBus?.command) {
              window._genesysCXBus.command('WebChat.open');
            }
          };
          // Avoid appending if one already exists from another mechanism
          if (!document.getElementById(fallbackButton.id)) {
            document.body.appendChild(fallbackButton);
          }
        } else {
          console.log(
            `${LOG_PREFIX} Genesys button found (from dedicated useEffect):`,
            genesysButton,
          );
        }
      }, 5000);
      return () => clearTimeout(buttonCheckTimer);
    }
  }, [genesysChatConfig, scriptLoadPhase, isChatEnabled, setOpen]); // setOpen added as it's used in callback

  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} Button state changed to: ${buttonState}, Genesys fully initialized: ${isGenesysFullyInitialized}`,
    );

    if (buttonState === 'created') {
      // Button is created and positioned, we can do any additional setup here
      // This is a good place to ensure the button remains visible

      // Add a MutationObserver to monitor the button's visibility and position
      if (!window._genesysButtonObserver) {
        const buttonSelectors =
          '.cx-widget.cx-webchat-chat-button, .cx-webchat-chat-button, [data-cx-widget="WebChat"], .cx-button.cx-webchat';
        const observer = new MutationObserver((mutations) => {
          const buttons = document.querySelectorAll(buttonSelectors);
          if (buttons.length > 0) {
            buttons.forEach((button) => {
              // Ensure the button has our positioning class
              button.classList.add('genesys-chat-button-positioned');
            });
          }
        });

        // Observe the entire document for any changes to attributes or DOM structure
        observer.observe(document.body, {
          attributes: true,
          childList: true,
          subtree: true,
          attributeFilter: ['style', 'class', 'display', 'visibility'],
        });

        window._genesysButtonObserver = observer;

        logger.info(
          `${LOG_PREFIX} Added MutationObserver to monitor chat button visibility`,
        );
      }
    }

    if (buttonState === 'failed' && isCXBusReady) {
      // Add fallback button for emergency cases
      setShowFallbackButton(true);

      // Create a simple fallback button that will trigger the chat
      if (!document.getElementById('genesys-fallback-button')) {
        const fallbackButton = document.createElement('button');
        fallbackButton.id = 'genesys-fallback-button';
        fallbackButton.textContent = '💬 Chat Support';
        fallbackButton.className = 'genesys-chat-button-positioned';
        fallbackButton.style.cssText = `
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          z-index: 2147483647 !important;
          min-width: 120px !important;
          min-height: 45px !important;
          background-color: #0078d4 !important;
          color: white !important;
          border-radius: 4px !important;
          border: none !important;
          cursor: pointer !important;
          font-family: system-ui, sans-serif !important;
          font-size: 14px !important;
          padding: 10px 15px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
        `;

        fallbackButton.onclick = () => {
          if (window._genesysCXBus) {
            try {
              window._genesysCXBus.command('WebChat.open');
            } catch (err) {
              logger.error(
                `${LOG_PREFIX} Error opening chat from fallback button:`,
                err,
              );
            }
          }
          setOpen(true);
        };

        document.body.appendChild(fallbackButton);
        logger.info(
          `${LOG_PREFIX} Created fallback button due to failed Genesys button creation`,
        );
      }
    }

    // Cleanup function
    return () => {
      if (buttonState === 'created' && window._genesysButtonObserver) {
        // Only cleanup on unmount if we need to
      }
    };
  }, [buttonState, isCXBusReady, isGenesysFullyInitialized, setOpen]);

  // Modify the positionChatButton function to only run when Genesys is fully initialized
  const positionChatButton = useCallback(() => {
    // Skip positioning if Genesys isn't fully initialized yet
    if (!isGenesysFullyInitialized && isCXBusReady) {
      logger.info(
        `${LOG_PREFIX} Skipping button positioning - waiting for Genesys to fully initialize`,
      );
      return false;
    }

    // Find the button using multiple selectors
    const selectors = [
      '.cx-widget.cx-webchat-chat-button',
      '.cx-webchat-chat-button',
      '[data-cx-widget="WebChat"]',
      '.cx-button.cx-webchat',
    ];

    let buttonFound = false;
    let buttonsCount = 0;

    for (const selector of selectors) {
      const buttons = document.querySelectorAll(selector);
      if (buttons.length > 0) {
        buttonFound = true;
        buttonsCount += buttons.length;

        // Only update button styles if it's not already marked as created
        if (buttonState !== 'created') {
          buttons.forEach((button) => {
            const buttonEl = button as HTMLElement;

            // Don't apply styles directly, use class names instead
            buttonEl.classList.add('genesys-chat-button-positioned');
          });
        }
      }
    }

    if (buttonFound && buttonState !== 'created') {
      logger.info(
        `${LOG_PREFIX} Successfully positioned ${buttonsCount} chat button(s)`,
      );
      useChatStore.getState().actions.setButtonState('created');
      return true;
    }

    if (
      !buttonFound &&
      buttonState !== 'creating' &&
      buttonState !== 'failed'
    ) {
      logger.warn(`${LOG_PREFIX} No chat button found to position`);
    }

    return buttonFound;
  }, [buttonState, isGenesysFullyInitialized, isCXBusReady]);

  // Add global styles only once instead of repeatedly
  const addGlobalStyles = useCallback(() => {
    if (!document.getElementById('genesys-chat-position-styles')) {
      const style = document.createElement('style');
      style.id = 'genesys-chat-position-styles';
      style.textContent = `
        /* Global styles for chat button positioning */
        .cx-widget.cx-webchat-chat-button,
        .cx-webchat-chat-button,
        [data-cx-widget="WebChat"],
        .cx-button.cx-webchat,
        .genesys-chat-button-positioned {
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          z-index: 2147483647 !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          transform: none !important;
          min-width: 60px !important;
          min-height: 45px !important;
          background-color: #0078d4 !important;
          border-radius: 4px !important;
          border: none !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
          margin: 0 !important;
          padding: 10px !important;
          
          /* These additional properties ensure the button is always visible */
          clip: auto !important;
          clip-path: none !important;
          -webkit-clip-path: none !important;
          top: auto !important;
          left: auto !important;
        }
        
        /* Ensure child elements are visible */
        .genesys-chat-button-positioned *,
        .cx-widget.cx-webchat-chat-button *,
        .cx-webchat-chat-button *,
        [data-cx-widget="WebChat"] *,
        .cx-button.cx-webchat * {
          visibility: visible !important;
          opacity: 1 !important;
          display: inline-block !important;
        }
        
        /* Fix for stacking contexts */
        body * {
          transform-style: flat !important;
        }
        
        /* Open chat window needs high z-index too */
        .cx-widget.cx-webchat {
          z-index: 2147483646 !important;
        }
      `;
      document.head.appendChild(style);
      logger.info(`${LOG_PREFIX} Added global chat button position styles`);
    }
  }, []);

  // Modify the button state effect to also check for full initialization
  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} Button state changed to: ${buttonState}, Genesys fully initialized: ${isGenesysFullyInitialized}`,
    );

    if (buttonState === 'created') {
      // Button is created and positioned, we can do any additional setup here
      // This is a good place to ensure the button remains visible

      // Add a MutationObserver to monitor the button's visibility and position
      if (!window._genesysButtonObserver) {
        const buttonSelectors =
          '.cx-widget.cx-webchat-chat-button, .cx-webchat-chat-button, [data-cx-widget="WebChat"], .cx-button.cx-webchat';
        const observer = new MutationObserver((mutations) => {
          const buttons = document.querySelectorAll(buttonSelectors);
          if (buttons.length > 0) {
            buttons.forEach((button) => {
              // Ensure the button has our positioning class
              button.classList.add('genesys-chat-button-positioned');
            });
          }
        });

        // Observe the entire document for any changes to attributes or DOM structure
        observer.observe(document.body, {
          attributes: true,
          childList: true,
          subtree: true,
          attributeFilter: ['style', 'class', 'display', 'visibility'],
        });

        window._genesysButtonObserver = observer;

        logger.info(
          `${LOG_PREFIX} Added MutationObserver to monitor chat button visibility`,
        );
      }
    }

    if (buttonState === 'failed' && isCXBusReady) {
      // Add fallback button for emergency cases
      setShowFallbackButton(true);

      // Create a simple fallback button that will trigger the chat
      if (!document.getElementById('genesys-fallback-button')) {
        const fallbackButton = document.createElement('button');
        fallbackButton.id = 'genesys-fallback-button';
        fallbackButton.textContent = '💬 Chat Support';
        fallbackButton.className = 'genesys-chat-button-positioned';
        fallbackButton.style.cssText = `
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          z-index: 2147483647 !important;
          min-width: 120px !important;
          min-height: 45px !important;
          background-color: #0078d4 !important;
          color: white !important;
          border-radius: 4px !important;
          border: none !important;
          cursor: pointer !important;
          font-family: system-ui, sans-serif !important;
          font-size: 14px !important;
          padding: 10px 15px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
        `;

        fallbackButton.onclick = () => {
          if (window._genesysCXBus) {
            try {
              window._genesysCXBus.command('WebChat.open');
            } catch (err) {
              logger.error(
                `${LOG_PREFIX} Error opening chat from fallback button:`,
                err,
              );
            }
          }
          setOpen(true);
        };

        document.body.appendChild(fallbackButton);
        logger.info(
          `${LOG_PREFIX} Created fallback button due to failed Genesys button creation`,
        );
      }
    }

    // Cleanup function
    return () => {
      if (buttonState === 'created' && window._genesysButtonObserver) {
        // Only cleanup on unmount if we need to
      }
    };
  }, [buttonState, isCXBusReady, isGenesysFullyInitialized, setOpen]);

  // Modify the positioning and CSS effect to account for full initialization
  useEffect(() => {
    if (isChatEnabled) {
      // Add global styles once, regardless of Genesys initialization
      addGlobalStyles();

      // Wait for Genesys to be fully initialized before setting up MutationObserver
      if (!isGenesysFullyInitialized && isCXBusReady) {
        logger.info(
          `${LOG_PREFIX} Waiting for Genesys to fully initialize before setting up button observers`,
        );

        // Set up a check for initialization
        const waitForInitInterval = setInterval(() => {
          if (isGenesysFullyInitialized) {
            clearInterval(waitForInitInterval);
            // Initial position check once fully initialized
            positionChatButton();
          }
        }, 200);

        return () => {
          clearInterval(waitForInitInterval);
        };
      }

      // Only proceed with positioning and observers when Genesys is fully initialized
      logger.info(
        `${LOG_PREFIX} Genesys is fully initialized, setting up button positioning and observers`,
      );

      // Initial position check
      positionChatButton();

      // Setup MutationObserver to detect DOM changes that might affect button
      const observer = new MutationObserver((mutations) => {
        const shouldCheckButton = mutations.some((mutation) =>
          Array.from(mutation.addedNodes).some(
            (node) =>
              node.nodeType === 1 &&
              ((node as Element).querySelector?.('.cx-webchat-chat-button') ||
                (node as Element).classList?.contains?.(
                  'cx-webchat-chat-button',
                )),
          ),
        );

        if (shouldCheckButton) {
          positionChatButton();
        }
      });

      // Observe body for button injection
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });

      // Periodic check with limited attempts instead of infinite interval
      let attempts = 0;
      const MAX_PERIODIC_CHECKS = 10;
      const INTERVAL_DELAY = 2000;

      const checkInterval = setInterval(() => {
        attempts++;
        const buttonFound = positionChatButton();

        // Clear interval if button is found or max attempts reached
        if (buttonFound || attempts >= MAX_PERIODIC_CHECKS) {
          clearInterval(checkInterval);
        }
      }, INTERVAL_DELAY);

      return () => {
        observer.disconnect();
        clearInterval(checkInterval);
      };
    }
  }, [
    isChatEnabled,
    addGlobalStyles,
    positionChatButton,
    isGenesysFullyInitialized,
    isCXBusReady,
  ]);

  // === CONDITIONAL RENDERING LOGIC STARTS HERE ===
  // (Moved from lines 755-772)

  // Log critical state just before rendering decision
  const chatDataFromStore = useChatStore.getState().config.chatData; // getState is fine for logging
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
        `${LOG_PREFIX} Chat is not enabled (eligibility/consent). GenesysScriptLoader will not be rendered.`,
      );
    if (!genesysChatConfig)
      logger.warn(
        `${LOG_PREFIX} genesysChatConfig is not available. GenesysScriptLoader will not be rendered.`,
      );
    if (isLoading) {
      logger.info(
        `${LOG_PREFIX} Chat config is loading. Rendering loading message.`,
      );
      return (
        <p data-testid="chat-loading-config">Loading chat configuration...</p>
      );
    }
    if (error) {
      logger.error(
        `${LOG_PREFIX} Error loading chat. Rendering error message: ${error.message}`,
      );
      // Do not return modal directly, let the main render path handle it if showChatErrorModal is true
    }
    // If not loading and no error, but chat is not enabled or no config, render null or placeholder.
    // This path is hit if chat is explicitly disabled or config failed silently.
    logger.info(
      `${LOG_PREFIX} Chat not enabled or no config, and not loading/error state. Rendering null.`,
    );
    // return null; // Or some other UI indicating chat is unavailable
  }

  // If there's an error from the store, and we're not already showing the modal via local state,
  // set local state to show it. This ensures errors from various sources (script, CXBus, config) are handled.
  if (error && !showChatErrorModal) {
    logger.info(
      `${LOG_PREFIX} Global error detected from store. Setting showChatErrorModal to true.`,
    );
    setShowChatErrorModal(true); // This will cause a re-render to show the modal
  }

  logger.info(
    `${LOG_PREFIX} Rendering main content. isChatEnabled: ${isChatEnabled}, hasConfig: ${!!genesysChatConfig}, showErrorModal: ${showChatErrorModal}`,
  );

  // === MAIN RENDER LOGIC ===
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
            userData={
              // Cast userData to the right type or provide a default empty object
              (genesysChatConfig as any).userData || {}
            }
          />
        ) : (
          <GenesysScriptLoader
            chatMode="legacy" // Force legacy mode when not using cloud
            legacyConfig={legacyConfig || undefined}
            cloudConfig={undefined}
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
            {/* It might be useful to have a close button that doesn't try to reopen */}
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
          {/* Basic styling for the modal - consider moving to a CSS file */}
          <style jsx>{`
            .chat-error-modal {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 10000; /* Ensure it's on top */
            }
            .modal-content {
              background-color: white;
              padding: 20px;
              border-radius: 5px;
              text-align: center;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            .modal-content p {
              margin-bottom: 15px;
            }
            .modal-content button {
              margin: 0 5px;
              padding: 8px 15px;
              border-radius: 4px;
              cursor: pointer;
            }
          `}</style>
        </div>
      )}

      {showFallbackButton &&
        !document.getElementById('fallback-chat-button-dedicated') && (
          <button
            id="fallback-chat-button-render"
            onClick={() => {
              setOpen(true);
              if (window._genesysCXBus?.command) {
                window._genesysCXBus.command('WebChat.open');
              }
            }}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              backgroundColor: '#0056b3',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              zIndex: '9999',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            }}
            data-testid="chat-fallback-button-render"
          >
            Chat with us (Fallback)
          </button>
        )}
    </>
  );
}

// Extend window interface for Genesys specific properties
declare global {
  interface Window {
    GenesysChat?: GenesysChat;
    _genesysCXBus?: GenesysCXBus;
    _chatWidgetInstanceId?: string; // For tracking active ChatWidget instance
    _forceChatButtonCreate?: () => boolean;
    _genesysButtonObserver?: MutationObserver; // For monitoring button visibility
    _genesysButtonVisibilityInterval?: NodeJS.Timeout; // For periodic visibility checks
    _genesys?: {
      widgets?: {
        main?: {
          initialise?: Function;
          [key: string]: any;
        };
        [key: string]: any;
      };
      [key: string]: any;
    };
  }
}

console.log('[ChatWidget] Module loaded');
