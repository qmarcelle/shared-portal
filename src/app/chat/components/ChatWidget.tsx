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
  logger.info(`${LOG_PREFIX} Component instance created/rendered.`, {
    containerId,
    initialIsChatEnabled: useChatStore.getState().config.chatData?.isEligible,
  });

  // Add a mount tracking ref to prevent double initialization
  const isMounted = useRef(false);
  // Add a global component instance tracker to prevent multiple instances
  const instanceId = useRef(`chat-widget-${Date.now()}`);

  // Add a command queue reference after existing refs
  const cxBusCommandQueue = useRef<Array<() => void>>([]);

  // New state for tracking CXBus readiness
  const [isCXBusReady, setIsCXBusReady] = useState(false);

  // Get state from store using selectors for optimized rendering
  const isOpen = useChatStore(chatUISelectors.isOpen);
  const chatMode = useChatStore(chatConfigSelectors.chatMode);

  // Call useChatStore unconditionally for both configs
  const legacyConfig = useChatStore((state) => state.config.legacyConfig);
  const cloudConfig = useChatStore((state) => state.config.cloudConfig);

  // Then, conditionally assign to genesysChatConfig
  const genesysChatConfig = chatMode === 'legacy' ? legacyConfig : cloudConfig;

  const isLoading = useChatStore(chatConfigSelectors.isLoading);
  const error = useChatStore(chatConfigSelectors.error);
  const isChatEnabled = useChatStore(chatConfigSelectors.isChatEnabled);
  const scriptLoadPhase = useChatStore(chatScriptSelectors.scriptLoadPhase);
  const genesysCloudConfig = useChatStore(
    chatConfigSelectors.genesysCloudDeploymentConfig,
  );
  // Get the standard error message from the store
  const standardErrorMessage = useChatStore(
    chatSessionSelectors.standardErrorMessage,
  );

  // Get actions from store
  const setScriptLoadPhase = useChatStore(
    (state) => state.actions.setScriptLoadPhase,
  );
  const setError = useChatStore((state) => state.actions.setError);
  const setOpen = useChatStore((state) => state.actions.setOpen);

  // Local state for managing UI
  const [showChatErrorModal, setShowChatErrorModal] = useState(false);

  // Ref to track whether we've set up CXBus subscriptions
  const cxBusSubscriptionsSetup = useRef(false);
  const cxBusPollTimer = useRef<NodeJS.Timeout | null>(null);

  // Add a registry for tracking active CXBus subscriptions
  const activeSubscriptions = useRef<{ [key: string]: boolean }>({});

  // Add a mechanism to prevent multiple component instances from initializing simultaneously
  useEffect(() => {
    // Check if there's already a ChatWidget component instance active
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

      // Register this instance
      window._chatWidgetInstanceId = instanceId.current;
      logger.info(
        `${LOG_PREFIX} Registered as the active ChatWidget instance: ${instanceId.current}`,
      );

      return () => {
        // Only clear if this instance is still the active one
        if (window._chatWidgetInstanceId === instanceId.current) {
          window._chatWidgetInstanceId = undefined;
          logger.info(
            `${LOG_PREFIX} Unregistered as the active ChatWidget instance: ${instanceId.current}`,
          );
        }
      };
    }
  }, []);

  // Ensure the container div exists and is properly configured - Run only once on mount
  useEffect(() => {
    // Skip if already mounted or if another instance is active
    if (
      isMounted.current ||
      (window._chatWidgetInstanceId &&
        window._chatWidgetInstanceId !== instanceId.current)
    ) {
      return;
    }

    isMounted.current = true;

    // Check if container already exists, if not create it
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

    // Ensure container has proper styling
    containerElement.style.position = 'relative';
    containerElement.style.zIndex = '999';
    containerElement.style.minHeight = '10px';
    containerElement.style.minWidth = '10px';

    // Add a data attribute that scripts can check for
    containerElement.dataset.initialized = 'true';
  }, [containerId]);

  // Function to handle clearing the error and reopening chat
  const handleClearErrorAndReopen = useCallback(() => {
    setError(null);
    setShowChatErrorModal(false);
    // Re-open the chat widget
    setOpen(true);
  }, [setError, setOpen]);

  // Updated: Handle script loaded now also sets isCXBusReady
  // This is now called when GenesysScriptLoader confirms CXBus is ready
  const handleCXBusReady = useCallback(() => {
    logger.info(
      `${LOG_PREFIX} handleCXBusReady: CXBus is ready as reported by GenesysScriptLoader.`,
    );
    setIsCXBusReady(true);
    setScriptLoadPhase(ScriptLoadPhase.LOADED);

    // Execute any queued commands
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
      cxBusCommandQueue.current = []; // Clear the queue
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

  // Effect for Legacy Event Listeners (genesys:webchat:*)
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

  // Effect for Backwards Compatibility (window.GenesysChat)
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
          useChatStore.getState().actions.setOpen(true); // This will trigger the CXBus command via another useEffect
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
          useChatStore.getState().actions.setOpen(false); // This will trigger the CXBus command via another useEffect
        };
      }
    }
    // No specific cleanup needed here as we are augmenting the window object.
  }, []);

  // Effect for CXBus Setup and Event Subscriptions
  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} useEffect: CXBus setup initiated. isCXBusReady: ${isCXBusReady}`,
    );

    // Skip if we're not the active instance
    if (
      window._chatWidgetInstanceId &&
      window._chatWidgetInstanceId !== instanceId.current
    ) {
      logger.info(
        `${LOG_PREFIX} Not the active instance, skipping CXBus setup.`,
      );
      return;
    }

    // Skip if CXBus is not ready yet
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
        cxBusSubscriptionsSetup.current = true; // Mark as setup

        // Helper function to register a subscription
        const registerSubscription = (
          event: string,
          callback: (...args: any[]) => void,
        ) => {
          // Skip if already subscribed
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

        // Register all required subscriptions
        registerSubscription('WebChat.opened', () => {
          logger.info(
            `${LOG_PREFIX} CXBus event: WebChat.opened. Updating store.`,
          );
          useChatStore.getState().actions.setOpen(true);
          useChatStore.getState().actions.startChat();
          if (onChatOpened) onChatOpened();
        });

        // Add new subscriptions for connection monitoring
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

    // Now that isCXBusReady is true, set up subscriptions
    setupSubscriptions();

    return () => {
      // If we are the active instance and have active subscriptions, clean them up
      if (
        window._chatWidgetInstanceId === instanceId.current &&
        cxBusSubscriptionsSetup.current &&
        window._genesysCXBus
      ) {
        logger.info(`${LOG_PREFIX} Cleaning up CXBus subscriptions.`);

        // Clean up each registered subscription
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
    isCXBusReady, // New dependency
    onChatOpened,
    onChatClosed,
    onError,
    setError,
    standardErrorMessage,
    instanceId, // Added for active instance check
  ]);

  // Modify the isOpen effect to use the command queue
  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} useEffect: isOpen state sync check. isOpen: ${isOpen}, isCXBusReady: ${isCXBusReady}`,
    );

    // Skip if we're not the active instance
    if (
      window._chatWidgetInstanceId &&
      window._chatWidgetInstanceId !== instanceId.current
    ) {
      logger.info(
        `${LOG_PREFIX} Not the active instance, skipping isOpen state sync.`,
      );
      return;
    }

    // Create a command to execute when CXBus is ready
    const executeChatCommand = () => {
      if (!window._genesysCXBus) {
        logger.warn(
          `${LOG_PREFIX} CXBus not available even though isCXBusReady is true. Cannot sync isOpen state to widget.`,
        );
        return;
      }

      try {
        // Type the return of 'WebChat.get' as any to avoid TS errors if structure is not strictly defined
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
        // Potentially dispatch an error to the store if CXBus commands fail
        // setError(new Error('Failed to command Genesys widget via CXBus.'));
      }
    };

    if (isCXBusReady) {
      // CXBus is ready, execute the command immediately
      executeChatCommand();
    } else {
      // CXBus not ready, queue the command for later execution
      logger.info(
        `${LOG_PREFIX} CXBus not ready, queuing isOpen state sync command.`,
      );
      cxBusCommandQueue.current.push(executeChatCommand);
    }
  }, [isOpen, isCXBusReady, instanceId]); // Updated dependencies

  // Ensure we re-check config availability when API state changes
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

    // If scripts are loaded and we're in legacy mode, just initialize the official button
    if (scriptLoadPhase === ScriptLoadPhase.LOADED && chatMode === 'legacy') {
      logger.info(
        `${LOG_PREFIX} Scripts loaded, initializing official Genesys chat button`,
      );

      // First ensure container exists and is properly configured
      let containerElement = document.getElementById(containerId);
      if (!containerElement) {
        logger.info(
          `${LOG_PREFIX} Creating container element with id: ${containerId}`,
        );
        containerElement = document.createElement('div');
        containerElement.id = containerId;
        containerElement.setAttribute('data-chat-container', 'true');
        document.body.appendChild(containerElement);
      }

      // Call the Genesys function to create the official button once
      if (typeof window._forceChatButtonCreate === 'function') {
        logger.info(`${LOG_PREFIX} Calling window._forceChatButtonCreate()`);

        // Try to ensure button is visible by checking if it exists first
        const existingButton = document.querySelector(
          '.cx-widget.cx-webchat-chat-button',
        );
        console.log(
          `${LOG_PREFIX} Existing button before _forceChatButtonCreate:`,
          existingButton,
        );

        try {
          // First add a style to ensure button is visible when created
          const style = document.createElement('style');
          style.textContent = `
            .cx-widget.cx-webchat-chat-button {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
              position: fixed !important;
              bottom: 20px !important;
              right: 20px !important;
              z-index: 9999 !important;
              background-color: #0056b3 !important;
              color: white !important;
              padding: 10px 20px !important;
              border-radius: 4px !important;
              cursor: pointer !important;
              font-weight: bold !important;
            }
          `;
          document.head.appendChild(style);

          // Add a small delay before forcing button creation to allow Genesys to fully initialize
          setTimeout(() => {
            console.log(`${LOG_PREFIX} Attempting button creation after delay`);
            // Type safety check for _forceChatButtonCreate
            const forceChatButtonCreate = window._forceChatButtonCreate;
            const result =
              typeof forceChatButtonCreate === 'function'
                ? forceChatButtonCreate()
                : false;
            console.log(`${LOG_PREFIX} _forceChatButtonCreate result:`, result);

            // Double-check if button now exists after a short delay
            setTimeout(() => {
              const buttonAfterCreate = document.querySelector(
                '.cx-widget.cx-webchat-chat-button',
              );
              console.log(
                `${LOG_PREFIX} Button after _forceChatButtonCreate:`,
                buttonAfterCreate,
              );

              if (!buttonAfterCreate) {
                console.log(
                  `${LOG_PREFIX} Button not found after create call - attempting alternative creation`,
                );

                // Try direct CXBus command if available
                if (typeof window._genesysCXBus?.command === 'function') {
                  console.log(
                    `${LOG_PREFIX} Using CXBus.command("WebChat.showChatButton")`,
                  );
                  window._genesysCXBus.command('WebChat.showChatButton');

                  // Check again after another delay
                  setTimeout(() => {
                    const buttonAfterCXBus = document.querySelector(
                      '.cx-widget.cx-webchat-chat-button',
                    );
                    console.log(
                      `${LOG_PREFIX} Button after CXBus command:`,
                      buttonAfterCXBus,
                    );

                    if (!buttonAfterCXBus) {
                      // Last resort - use document event to trigger button creation
                      console.log(
                        `${LOG_PREFIX} Dispatching genesys:create-button event`,
                      );
                      document.dispatchEvent(
                        new CustomEvent('genesys:create-button'),
                      );
                    }
                  }, 1000);
                }
              }
            }, 1000);
          }, 2000); // 2 second delay before first attempt
        } catch (err) {
          console.error(`${LOG_PREFIX} Error in _forceChatButtonCreate:`, err);
        }
      } else {
        logger.warn(
          `${LOG_PREFIX} _forceChatButtonCreate function not available`,
        );
      }
    }
  }, [scriptLoadPhase, genesysChatConfig, chatMode, containerId]);

  // Log critical state just before rendering GenesysScriptLoader decision
  const chatDataFromStore = useChatStore.getState().config.chatData;

  console.log('[ChatWidget] Pre-render check', {
    isChatEnabled,
    genesysChatConfig,
  });
  logger.info('[ChatWidget] Pre-render check', {
    isChatEnabled,
    genesysChatConfig,
  });

  logger.info(`${LOG_PREFIX} Decision Values (Pre-Render):`, {
    isChatEnabled, // The value from the hook
    storeChatDataIsEligible: chatDataFromStore?.isEligible,
    storeChatDataChatAvailable: chatDataFromStore?.chatAvailable,
    storeHasGenesysConfig: !!genesysChatConfig, // Use the component's derived variable
    isLoading, // from hook
    error, // from hook
    scriptLoadPhase, // from hook
  });

  logger.info(
    `${LOG_PREFIX} Rendering. isLoading: ${isLoading}, configError: ${error?.message}, isChatEnabled: ${isChatEnabled}, genesysChatConfig available: ${!!genesysChatConfig}`,
  );

  // Do not render GenesysScriptLoader if chat is not enabled or config is missing
  if (!isChatEnabled || !genesysChatConfig) {
    if (!isChatEnabled)
      logger.warn(
        `${LOG_PREFIX} Chat is not enabled (eligibility/consent). GenesysScriptLoader will not be rendered.`,
      );
    if (!genesysChatConfig)
      logger.warn(
        `${LOG_PREFIX} genesysChatConfig is not available. GenesysScriptLoader will not be rendered.`,
      );
    // Optionally render a placeholder or status message if chat is loading or errored
    if (isLoading) return <p>Loading chat configuration...</p>;
    if (error) return <p>Error loading chat: {error.message}</p>;
    return null; // Or some other UI indicating chat is unavailable
  }

  logger.info(
    `${LOG_PREFIX} Chat is enabled and config is available. Rendering GenesysScriptLoader.`,
  );

  useEffect(() => {
    logger.info(`${LOG_PREFIX} Current system state:`, {
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
    });

    // Add a check and fallback custom button if the Genesys button doesn't appear
    if (isChatEnabled && scriptLoadPhase === ScriptLoadPhase.LOADED) {
      // Wait 5 seconds for the button to appear, and if it doesn't, create a fallback
      const buttonCheckTimer = setTimeout(() => {
        const genesysButton = document.querySelector(
          '.cx-widget.cx-webchat-chat-button',
        );
        if (!genesysButton) {
          console.log(
            `${LOG_PREFIX} Genesys button not found after 5s - adding fallback button`,
          );

          // Create a custom fallback button
          const fallbackButton = document.createElement('button');
          fallbackButton.innerText = 'Chat with us';
          fallbackButton.id = 'fallback-chat-button';
          fallbackButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #0056b3;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          `;

          // Add click handler to open chat
          fallbackButton.onclick = () => {
            setOpen(true);
            if (window._genesysCXBus?.command) {
              window._genesysCXBus.command('WebChat.open');
            }
          };

          // Add to the document body
          document.body.appendChild(fallbackButton);
        } else {
          console.log(`${LOG_PREFIX} Genesys button found:`, genesysButton);
        }
      }, 5000);

      return () => clearTimeout(buttonCheckTimer);
    }
  }, [genesysChatConfig, scriptLoadPhase, isChatEnabled, setOpen]);

  console.log('[ChatWidget] Component rendered');
  logger.info('[ChatWidget] Component rendered', {});

  return (
    <>
      {/* Container for the Genesys chat widget - managed by useEffect */}
      <div id={containerId} />

      {/* Loader for Genesys scripts, rendered only when config is ready */}
      {isChatEnabled && (
        <GenesysScriptLoader
          chatMode={chatMode}
          cloudConfig={genesysCloudConfig}
          legacyConfig={chatMode === 'legacy' ? genesysChatConfig : undefined}
          onLoad={handleCXBusReady}
          onError={handleScriptError}
          showStatus={showLoaderStatus}
        />
      )}
      {/* Hide CoBrowse elements if needed */}
      {hideCoBrowse && (
        <style>{`
          .cobrowse-card,
          #cobrowse-sessionConfirm,
          #cobrowse-sessionYesModal,
          #cobrowse-contactUsScreen1,
          #cobrowse-contactUsScreen2 {
            display: none !important;
          }
        `}</style>
      )}

      {/* Add custom CSS styles for the official Genesys button */}
      <style>{`
        /* Make the official Genesys chat button visible and styled properly */
        .cx-widget.cx-webchat-chat-button {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          z-index: 9999 !important;
          padding: 10px 20px !important;
          background-color: #0056b3 !important;
          color: white !important;
          border-radius: 30px !important;
          cursor: pointer !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important;
          font-weight: bold !important;
          font-family: Arial, sans-serif !important;
          font-size: 14px !important;
          min-width: 120px !important;
          text-align: center !important;
          border: none !important;
          transition: background-color 0.3s ease !important;
        }
        
        .cx-widget.cx-webchat-chat-button:hover {
          background-color: #003d7a !important;
        }
      `}</style>

      {/* Error message display with OK button to retry */}
      {error && showChatErrorModal && (
        <div
          className="genesys-chat-error"
          data-testid="chat-error"
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '5px',
            padding: '15px 20px',
            width: '300px',
            zIndex: 2000,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ marginBottom: '10px' }}>{error.message}</div>
          <button
            onClick={handleClearErrorAndReopen}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'block',
              width: '100%',
            }}
          >
            OK
          </button>
        </div>
      )}
    </>
  );
}

// Add TypeScript interfaces for Genesys objects
declare global {
  interface Window {
    GenesysChat?: GenesysChat;
    _genesysCXBus?: GenesysCXBus;
    _chatWidgetInstanceId?: string;
    _forceChatButtonCreate?: () => boolean;
  }
}

console.log('[ChatWidget] Module loaded');
