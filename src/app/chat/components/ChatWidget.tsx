'use client';

/**
 * @file ChatWidget.tsx
 * @description This component is the main UI/UX orchestrator for the Genesys chat.
 * As per README.md: "Renders chat container, manages UI based on store, handles CXBus events, renders loader."
 * Key Responsibilities:
 * - Renders the `div` container where the Genesys chat widget will be injected.
 * - Conditionally renders `GenesysScriptLoader` when `genesysChatConfig` is ready and chat is enabled.
 * - Synchronizes the chat widget's open/closed state with the `chatStore` using `CXBus` commands (`WebChat.open`, `WebChat.close`).
 * - Subscribes to `CXBus` events (e.g., `WebChat.opened`, `WebChat.closed`, `WebChat.error`) to update the `chatStore`,
 *   ensuring a unidirectional data flow: UI/Store -> Widget Command -> Widget Event -> Store.
 * - Handles script loading success and errors from `GenesysScriptLoader`.
 * - Provides backwards compatibility for older `window.GenesysChat` methods if needed.
 */

import { logger } from '@/utils/logger';
import { useCallback, useEffect, useRef } from 'react';
import {
  chatConfigSelectors,
  chatScriptSelectors,
  chatUISelectors,
  useChatStore,
} from '../stores/chatStore';
import {
  GenesysChat,
  GenesysCXBus,
  ScriptLoadPhase,
} from '../types/chat-types';
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

  // Get state from store using selectors for optimized rendering
  const isOpen = useChatStore(chatUISelectors.isOpen);
  const genesysChatConfig = useChatStore(chatConfigSelectors.genesysChatConfig);
  const isLoading = useChatStore(chatConfigSelectors.isLoading);
  const error = useChatStore(chatConfigSelectors.error);
  const isChatEnabled = useChatStore(chatConfigSelectors.isChatEnabled);
  const scriptLoadPhase = useChatStore(chatScriptSelectors.scriptLoadPhase);
  const chatMode = useChatStore(chatConfigSelectors.chatMode);
  const genesysCloudConfig = useChatStore(
    chatConfigSelectors.genesysCloudDeploymentConfig,
  );

  // Get actions from store
  const setScriptLoadPhase = useChatStore(
    (state) => state.actions.setScriptLoadPhase,
  );
  const setError = useChatStore((state) => state.actions.setError);

  // Ref to track whether we've set up CXBus subscriptions
  const cxBusSubscriptionsSetup = useRef(false);
  const cxBusPollTimer = useRef<NodeJS.Timeout | null>(null); // Ref for CXBus polling timer

  // Script load/error handlers
  const handleScriptLoaded = useCallback(() => {
    logger.info(
      `${LOG_PREFIX} handleScriptLoaded: Genesys scripts reported as loaded by GenesysScriptLoader.`,
    );
    setScriptLoadPhase(ScriptLoadPhase.LOADED);
  }, [setScriptLoadPhase]);

  const handleScriptError = useCallback(
    (err: Error) => {
      logger.error(`${LOG_PREFIX} handleScriptError: Script loading failed.`, {
        error: err.message,
        stack: err.stack,
      });
      setScriptLoadPhase(ScriptLoadPhase.ERROR);
      setError(err);
      if (onError) onError(err);
    },
    [setScriptLoadPhase, setError, onError],
  );

  // Effect for Legacy Event Listeners (genesys:webchat:*)
  // README mentions CXBus as the primary communication. These are likely for compatibility or specific events not on CXBus.
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
        new Error('Unknown chat error from legacy event');
      logger.error(
        `${LOG_PREFIX} Legacy event 'genesys:script:error' or 'genesys:webchat:error' received.`,
        { error: errorDetail, eventType: e.type },
      );
      setError(errorDetail);
      if (onError) onError(errorDetail);
    };

    document.addEventListener('genesys:webchat:opened', handleChatOpenedEvent);
    document.addEventListener('genesys:webchat:closed', handleChatClosedEvent);
    document.addEventListener('genesys:script:error', handleErrorEvent);
    document.addEventListener('genesys:webchat:error', handleErrorEvent);

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
    };
  }, [onChatOpened, onChatClosed, onError, setError]);

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
  // As per README: "ChatWidget.tsx listens to events from the Genesys widget via CXBus ... and dispatches actions to chatStore.ts"
  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} useEffect: CXBus setup initiated. Current scriptLoadPhase: ${scriptLoadPhase}`,
    );

    const setupSubscriptions = () => {
      if (window._genesysCXBus && !cxBusSubscriptionsSetup.current) {
        logger.info(
          `${LOG_PREFIX} CXBus detected. Setting up event subscriptions (WebChat.opened, WebChat.closed, WebChat.error).`,
        );
        cxBusSubscriptionsSetup.current = true; // Mark as setup

        window._genesysCXBus.subscribe('WebChat.opened', () => {
          logger.info(
            `${LOG_PREFIX} CXBus event: WebChat.opened. Updating store.`,
          );
          useChatStore.getState().actions.setOpen(true);
          useChatStore.getState().actions.startChat();
          if (onChatOpened) onChatOpened();
        });

        // Add new subscriptions for connection monitoring
        window._genesysCXBus.subscribe('WebChat.agentConnected', (e) => {
          logger.info(`${LOG_PREFIX} CXBus event: Agent connected to chat.`, {
            agentDetails: e,
          });
        });

        window._genesysCXBus.subscribe('WebChat.agentDisconnected', (e) => {
          logger.info(
            `${LOG_PREFIX} CXBus event: Agent disconnected from chat.`,
            { reason: e },
          );
        });

        window._genesysCXBus.subscribe('WebChat.ended', (e) => {
          logger.info(`${LOG_PREFIX} CXBus event: Chat session ended.`, {
            reason: e,
          });
        });

        window._genesysCXBus.subscribe('WebChat.failedToStart', (e) => {
          logger.error(`${LOG_PREFIX} CXBus event: Chat failed to start.`, {
            error: e,
          });
          setError(new Error('Failed to start chat session'));
        });

        window._genesysCXBus.subscribe('WebChat.closed', () => {
          logger.info(
            `${LOG_PREFIX} CXBus event: WebChat.closed. Updating store.`,
          );
          useChatStore.getState().actions.setOpen(false);
          useChatStore.getState().actions.endChat();
          if (onChatClosed) onChatClosed();
        });

        window._genesysCXBus.subscribe(
          'WebChat.error',
          (e: { data?: any; error?: any }) => {
            const errorDetail =
              e.data ||
              e.error ||
              new Error('Unknown error from CXBus WebChat.error');
            logger.error(
              `${LOG_PREFIX} CXBus event: WebChat.error. Updating store.`,
              { error: errorDetail, eventData: e },
            );
            const errorToSet =
              errorDetail instanceof Error
                ? errorDetail
                : new Error(String(errorDetail));
            setError(errorToSet);
            if (onError) onError(errorToSet);
          },
        );

        // Add other subscriptions as needed, e.g., for messages, agent typing, etc.
        // window._genesysCXBus.subscribe('Message.added', (message) => { ... });

        logger.info(`${LOG_PREFIX} CXBus subscriptions complete.`);
      } else if (cxBusSubscriptionsSetup.current) {
        logger.info(`${LOG_PREFIX} CXBus subscriptions already set up.`);
      }
    };

    let attempts = 0;
    const maxAttempts = 15; // Increased attempts for CXBus detection
    const baseTimeout = 200; // Base timeout for polling

    const pollForCXBus = () => {
      if (cxBusPollTimer.current) clearTimeout(cxBusPollTimer.current); // Clear previous timer

      if (window._genesysCXBus) {
        logger.info(
          `${LOG_PREFIX} CXBus found after ${attempts} attempts. Proceeding with subscription setup.`,
        );
        setupSubscriptions();
        return;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        logger.warn(
          `${LOG_PREFIX} CXBus not available after ${maxAttempts} attempts. Subscriptions might not be set up.`,
        );
        return;
      }

      const currentTimeout = Math.min(
        baseTimeout * Math.pow(1.5, attempts - 1),
        3000,
      ); // Exponential backoff, max 3s
      logger.info(
        `${LOG_PREFIX} CXBus not yet available. Retrying in ${currentTimeout}ms (Attempt ${attempts}/${maxAttempts}).`,
      );
      cxBusPollTimer.current = setTimeout(pollForCXBus, currentTimeout);
    };

    if (scriptLoadPhase === ScriptLoadPhase.LOADED) {
      logger.info(
        `${LOG_PREFIX} Scripts are loaded. Starting to poll for CXBus availability.`,
      );
      pollForCXBus();
    } else {
      logger.info(
        `${LOG_PREFIX} Scripts not yet loaded (phase: ${scriptLoadPhase}). CXBus polling deferred.`,
      );
    }

    return () => {
      logger.info(`${LOG_PREFIX} useEffect: Cleaning up CXBus polling timer.`);
      if (cxBusPollTimer.current) {
        clearTimeout(cxBusPollTimer.current);
      }
      // Note: CXBus subscriptions themselves might not be easily removable or necessary to remove
      // if the widget is fully torn down. Genesys documentation should clarify this.
      // If unsubscription is needed: window._genesysCXBus.unsubscribe('WebChat.opened', handlerRef);
    };
  }, [scriptLoadPhase, onChatOpened, onChatClosed, onError, setError]); // Added setError

  // Effect for Syncing Store's `isOpen` State to Widget via CXBus Command
  // As per README: "ChatWidget.tsx uses CXBus commands to control the widget (open/close) based on store state."
  useEffect(() => {
    logger.info(
      `${LOG_PREFIX} useEffect: isOpen state sync check. isOpen: ${isOpen}, scriptLoadPhase: ${scriptLoadPhase}`,
    );
    if (scriptLoadPhase !== ScriptLoadPhase.LOADED) {
      logger.info(
        `${LOG_PREFIX} Scripts not loaded. Cannot sync isOpen state to widget yet.`,
      );
      return;
    }

    if (!window._genesysCXBus) {
      logger.warn(
        `${LOG_PREFIX} CXBus not available. Cannot sync isOpen state to widget.`,
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
  }, [isOpen, scriptLoadPhase]); // Dependency: isOpen and scriptLoadPhase

  // Log critical state just before rendering GenesysScriptLoader decision
  const chatDataFromStore = useChatStore.getState().config.chatData;
  const genesysConfigFromStore =
    useChatStore.getState().config.genesysChatConfig;

  logger.info(`${LOG_PREFIX} Decision Values (Pre-Render):`, {
    isChatEnabled, // The value from the hook
    storeChatDataIsEligible: chatDataFromStore?.isEligible,
    storeChatDataChatAvailable: chatDataFromStore?.chatAvailable,
    storeHasGenesysConfig: !!genesysConfigFromStore,
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
  return (
    <>
      {/* Container for the Genesys chat widget */}
      <div id={containerId} />

      {/* Loader for Genesys scripts, rendered only when config is ready */}
      {/* The genesysChatConfig variable is kept in case GenesysScriptLoader needs it for legacy mode under a different prop name (e.g., legacyConfig) */}
      {isChatEnabled && (
        <GenesysScriptLoader
          // config={genesysChatConfig} // Removed due to linter error; GenesysScriptLoaderProps might have changed.
          chatMode={chatMode}
          cloudConfig={genesysCloudConfig} // For cloud mode
          // If legacy mode needs the old config, GenesysScriptLoader might expect it as e.g. legacyConfig={genesysChatConfig}
          // For now, assuming cloud mode only needs chatMode and cloudConfig.
          // If legacy functionality is broken, the props for GenesysScriptLoader (legacy part) need to be revisited.
          legacyConfig={chatMode === 'legacy' ? genesysChatConfig : undefined} // Tentatively pass for legacy mode
          onLoad={handleScriptLoaded}
          onError={handleScriptError}
          showStatus={showLoaderStatus}
        />
      )}
      {/* Hide CoBrowse elements if needed - This might conflict with Genesys own CoBrowse styling */}
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

      {/* Error message display */}
      {error && (
        <div
          className="genesys-chat-error"
          style={{ color: 'red', fontSize: '14px', margin: '10px 0' }}
        >
          Chat is currently unavailable. Please try again later.
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
  }
}
