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
import GenesysScriptLoader from './GenesysScriptLoader';

const LOG_PREFIX = '[ChatWidget]';

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

  const checkGenesysButton = useCallback(() => {
    if (buttonState === 'created') return;
    buttonCheckAttempts.current += 1;
    logger.info(
      `${LOG_PREFIX} Checking for Genesys button (attempt ${buttonCheckAttempts.current}/${MAX_BUTTON_CHECK_ATTEMPTS})`,
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
          `${LOG_PREFIX} Found Genesys button using selector: ${selector}`,
        );
        break;
      }
    }
    if (button) {
      logger.info(`${LOG_PREFIX} Genesys button found, ensuring visibility`);
      useChatStore.getState().actions.setButtonState('created');
      try {
        (button as HTMLElement).style.display = 'block';
        (button as HTMLElement).style.visibility = 'visible';
        (button as HTMLElement).style.opacity = '1';
      } catch (err) {
        logger.warn(`${LOG_PREFIX} Error ensuring button visibility:`, err);
      }
    } else {
      logger.warn(
        `${LOG_PREFIX} Genesys button not found on attempt ${buttonCheckAttempts.current}`,
      );
      if (isCXBusReady && window._genesysCXBus) {
        logger.info(`${LOG_PREFIX} Attempting to create button via CXBus`);
        useChatStore.getState().actions.setButtonState('creating');
        try {
          window._genesysCXBus.command('WebChat.showChatButton');
        } catch (err) {
          logger.error(`${LOG_PREFIX} Error creating button via CXBus:`, err);
        }
      }
      if (buttonCheckAttempts.current >= MAX_BUTTON_CHECK_ATTEMPTS) {
        logger.warn(
          `${LOG_PREFIX} Max button check attempts reached. Marking button creation as failed.`,
        );
        useChatStore.getState().actions.setButtonState('failed');
      }
    }
  }, [buttonState, isCXBusReady]);

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
    containerElement.style.position = 'relative';
    containerElement.style.zIndex = '999';
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
        `${LOG_PREFIX} Not the active instance, skipping CXBus setup.`,
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
    if (isCXBusReady) {
      executeChatCommand();
    } else {
      logger.info(
        `${LOG_PREFIX} CXBus not ready, queuing isOpen state sync command.`,
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
    logger.info(`${LOG_PREFIX} Button state changed to: ${buttonState}`);
    if (buttonState === 'created') {
      setShowFallbackButton(false);
      logger.info(
        `${LOG_PREFIX} Genesys button created successfully, hiding fallback button`,
      );
      // Remove fallback button if it exists
      const fallbackBtn = document.getElementById(
        'fallback-chat-button-dedicated',
      );
      if (fallbackBtn) fallbackBtn.remove();
    }
    if (buttonState === 'failed' && isCXBusReady) {
      setShowFallbackButton(true);
      logger.info(
        `${LOG_PREFIX} Button creation failed, showing fallback button`,
      );
    }
  }, [buttonState, isCXBusReady]);

  useEffect(() => {
    if (!isCXBusReady) return;
    logger.info(`${LOG_PREFIX} CXBus is ready, starting button checks`);
    useChatStore.getState().actions.setButtonState('creating');
    if (window._forceChatButtonCreate) {
      try {
        logger.info(`${LOG_PREFIX} Calling _forceChatButtonCreate()`);
        window._forceChatButtonCreate();
      } catch (err) {
        logger.error(
          `${LOG_PREFIX} Error calling _forceChatButtonCreate():`,
          err,
        );
      }
    }
    checkGenesysButton();
    const buttonCheckInterval = setInterval(() => {
      if (
        buttonState === 'created' ||
        buttonCheckAttempts.current >= MAX_BUTTON_CHECK_ATTEMPTS
      ) {
        clearInterval(buttonCheckInterval);
        logger.info(
          `${LOG_PREFIX} Button check interval cleared: ${buttonState === 'created' ? 'button found' : 'max attempts reached'}`,
        );
        return;
      }
      checkGenesysButton();
    }, 2000);
    return () => clearInterval(buttonCheckInterval);
  }, [isCXBusReady, checkGenesysButton, buttonState]);

  useEffect(() => {
    if (!genesysChatConfig) {
      logger.info(`${LOG_PREFIX} No Genesys chat configuration available yet.`);
      return;
    }
    const config = genesysChatConfig as any;
    const currentChatMode = chatMode || 'legacy';
    const serverChatMode = config.chatMode || 'legacy';
    const isCloudEligible =
      config.cloudChatEligible === 'true' || config.cloudChatEligible === true;
    logger.info(`${LOG_PREFIX} Validating chat mode consistency:`, {
      currentChatMode, // From store/props
      serverChatMode, // From fetched config
      isCloudEligible, // From fetched config
    });
    if (currentChatMode === 'cloud' && !isCloudEligible) {
      logger.warn(
        `${LOG_PREFIX} Inconsistent chat mode: UI expects 'cloud', but server config indicates not cloud eligible. Potential misconfiguration.`,
      );
      // setError(new Error('Chat mode mismatch: UI expects cloud, but not eligible.'));
      // setShowChatErrorModal(true);
    } else if (currentChatMode === 'legacy' && isCloudEligible) {
      logger.warn(
        `${LOG_PREFIX} Inconsistent chat mode: UI expects 'legacy', but server config indicates cloud eligible. Consider updating UI to use cloud mode.`,
      );
    }
    // Further validation for Genesys Cloud config
    if (currentChatMode === 'cloud') {
      const gcConfig = genesysCloudConfig; // From store selector
      if (!gcConfig?.deploymentId || !gcConfig?.environment) {
        logger.error(
          `${LOG_PREFIX} Critical Genesys Cloud config missing: deploymentId or environment.`,
          { gcConfigFromStore: gcConfig },
        );
        setError(
          new Error(
            'Genesys Cloud configuration is incomplete (missing deploymentId or environment).',
          ),
        );
        setShowChatErrorModal(true);
      }
    }
  }, [genesysChatConfig, chatMode, genesysCloudConfig, setError]);

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

      {isChatEnabled && genesysChatConfig && (
        <GenesysScriptLoader
          chatMode={chatMode}
          // Ensure legacyConfig and cloudConfig are properly passed or default to undefined
          legacyConfig={
            chatMode === 'legacy' ? legacyConfig || undefined : undefined
          }
          cloudConfig={
            chatMode === 'cloud' ? cloudConfig || undefined : undefined
          }
          onLoad={handleCXBusReady}
          onError={handleScriptError}
          showStatus={showLoaderStatus}
        />
      )}

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
  }
}

console.log('[ChatWidget] Module loaded');
