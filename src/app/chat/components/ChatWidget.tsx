'use client';

/**
 * ChatWidget Component
 *
 * Provides a React interface to the Genesys chat functionality.
 * Uses GenesysScriptLoader to load chat scripts and manages the container div.
 * Acts as the central coordinator between store state and CXBus commands.
 */

import { logger } from '@/utils/logger';
import { useCallback, useEffect, useRef } from 'react';
import {
  chatConfigSelectors,
  chatScriptSelectors,
  chatUISelectors,
  useChatStore,
} from '../stores/chatStore';
import { GenesysChat, GenesysCXBus, ScriptLoadPhase } from '../types';
import GenesysScriptLoader from './GenesysScriptLoader';

interface ChatWidgetProps {
  /** Custom container ID (default: 'genesys-chat-container') */
  containerId?: string;
  /** Hide CoBrowse functionality */
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
  showLoaderStatus = false,
  onChatOpened,
  onChatClosed,
  onError,
}: ChatWidgetProps) {
  // Get state from store using selectors for optimized rendering
  const isOpen = useChatStore(chatUISelectors.isOpen);
  const genesysChatConfig = useChatStore(chatConfigSelectors.genesysChatConfig);
  const isLoading = useChatStore(chatConfigSelectors.isLoading);
  const error = useChatStore(chatConfigSelectors.error);
  const isChatEnabled = useChatStore(chatConfigSelectors.isChatEnabled);
  const scriptLoadPhase = useChatStore(chatScriptSelectors.scriptLoadPhase);

  // Get actions from store
  const setScriptLoadPhase = useChatStore(
    (state) => state.actions.setScriptLoadPhase,
  );
  const setError = useChatStore((state) => state.actions.setError);

  // Ref to track whether we've set up CXBus subscriptions
  const cxBusSubscriptionsSetup = useRef(false);

  // Script load/error handlers
  const handleScriptLoaded = useCallback(() => {
    logger.info('[ChatWidget] Scripts loaded successfully');
    setScriptLoadPhase(ScriptLoadPhase.LOADED);
  }, [setScriptLoadPhase]);

  const handleScriptError = useCallback(
    (err: Error) => {
      logger.error('[ChatWidget] Script loading error:', err);
      setScriptLoadPhase(ScriptLoadPhase.ERROR);
      setError(err);
      if (onError) onError(err);
    },
    [setScriptLoadPhase, setError, onError],
  );

  // Set up chat event listeners for backwards compatibility
  useEffect(() => {
    const handleChatOpened = () => {
      // Update store state
      useChatStore.getState().actions.setOpen(true);
      useChatStore.getState().actions.startChat();
      // Then trigger callback
      if (onChatOpened) onChatOpened();
    };

    const handleChatClosed = () => {
      // Update store state
      useChatStore.getState().actions.setOpen(false);
      useChatStore.getState().actions.endChat();
      // Then trigger callback
      if (onChatClosed) onChatClosed();
    };

    const handleError = (e: Event) => {
      const customEvent = e as CustomEvent;
      logger.error('[ChatWidget] Chat error:', customEvent.detail?.error);

      const errorObj =
        customEvent.detail?.error || new Error('Unknown chat error');
      setError(errorObj);
      if (onError) onError(errorObj);
    };

    // Add event listeners
    document.addEventListener('genesys:webchat:opened', handleChatOpened);
    document.addEventListener('genesys:webchat:closed', handleChatClosed);
    document.addEventListener('genesys:script:error', handleError);
    document.addEventListener('genesys:webchat:error', handleError);

    // Clean up event listeners
    return () => {
      document.removeEventListener('genesys:webchat:opened', handleChatOpened);
      document.removeEventListener('genesys:webchat:closed', handleChatClosed);
      document.removeEventListener('genesys:script:error', handleError);
      document.removeEventListener('genesys:webchat:error', handleError);
    };
  }, [onChatOpened, onChatClosed, onError, setError]);

  // Expose methods to window for external access - backwards compatibility only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Do not define window.GenesysChat here, as it will conflict with click_to_chat.js
      // Instead, rely on the CXBus subscriptions and commands set up in the other useEffect

      // For backwards compatibility with code that might be using these methods:
      const originalGenesysChat = window.GenesysChat || {};

      // Store the original methods if they exist
      const originalOpenChat = originalGenesysChat.openChat;
      const originalCloseChat = originalGenesysChat.closeChat;

      // Create backup methods that use our store if the originals don't exist
      if (!originalOpenChat) {
        logger.info('[ChatWidget] Adding compatibility openChat method');
        if (!window.GenesysChat) window.GenesysChat = {};
        window.GenesysChat.openChat = () => {
          logger.info('[ChatWidget] External openChat called (compatibility)');
          useChatStore.getState().actions.setOpen(true);
          // CXBus command will be triggered by the isOpen effect
        };
      }

      if (!originalCloseChat) {
        logger.info('[ChatWidget] Adding compatibility closeChat method');
        if (!window.GenesysChat) window.GenesysChat = {};
        window.GenesysChat.closeChat = () => {
          logger.info('[ChatWidget] External closeChat called (compatibility)');
          useChatStore.getState().actions.setOpen(false);
          // CXBus command will be triggered by the isOpen effect
        };
      }
    }
  }, []);

  // Add useEffect to sync with CXBus when it becomes available
  useEffect(() => {
    // Function to check for CXBus availability and subscribe to events
    const setupCXBusSubscriptions = () => {
      if (window._genesysCXBus && !cxBusSubscriptionsSetup.current) {
        logger.info('[ChatWidget] CXBus detected, setting up subscriptions');
        cxBusSubscriptionsSetup.current = true;

        // Subscribe to WebChat.closed event (instead of relying on genesys:webchat:closed)
        window._genesysCXBus.subscribe('WebChat.closed', () => {
          logger.info('[ChatWidget] WebChat.closed event via CXBus');
          useChatStore.getState().actions.setOpen(false);
          useChatStore.getState().actions.endChat();
          if (onChatClosed) onChatClosed();
        });

        // Also subscribe to other relevant CXBus events
        window._genesysCXBus.subscribe('WebChat.opened', () => {
          logger.info('[ChatWidget] WebChat.opened event via CXBus');
          useChatStore.getState().actions.setOpen(true);
          useChatStore.getState().actions.startChat();
          if (onChatOpened) onChatOpened();
        });
      }
    };

    // Set up exponential backoff polling to check for CXBus availability
    let attempts = 0;
    const maxAttempts = 10;
    let timeout = 100; // Start with 100ms

    const checkCXBusAvailability = () => {
      if (window._genesysCXBus) {
        setupCXBusSubscriptions();
        return;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        logger.warn('[ChatWidget] CXBus not available after maximum attempts');
        return;
      }

      // Exponential backoff with max of 2000ms
      timeout = Math.min(timeout * 1.5, 2000);
      setTimeout(checkCXBusAvailability, timeout);
    };

    // Start polling when script is loaded
    if (scriptLoadPhase === ScriptLoadPhase.LOADED) {
      checkCXBusAvailability();
    }

    // Clean up on unmount
    return () => {
      // No cleanup needed for this effect
    };
  }, [onChatOpened, onChatClosed, scriptLoadPhase]);

  // Update the isOpen effect to command the widget directly via CXBus when store state changes
  useEffect(() => {
    // Only proceed if scripts are loaded
    if (scriptLoadPhase !== ScriptLoadPhase.LOADED || !window._genesysCXBus) {
      return;
    }

    try {
      if (isOpen) {
        logger.info(
          '[ChatWidget] Opening chat via CXBus due to store state change',
        );
        window._genesysCXBus.command('WebChat.open');
      } else {
        // We only explicitly close the chat if the store indicates it should be closed
        // This is to prevent accidental closures
        logger.info(
          '[ChatWidget] Closing chat via CXBus due to store state change',
        );
        window._genesysCXBus.command('WebChat.close');
      }
    } catch (err) {
      logger.error('[ChatWidget] Error commanding chat via CXBus', err);
    }
  }, [isOpen, scriptLoadPhase]);

  return (
    <>
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

      {/* Error message display */}
      {error && (
        <div
          className="genesys-chat-error"
          style={{ color: 'red', fontSize: '14px', margin: '10px 0' }}
        >
          Chat is currently unavailable. Please try again later.
        </div>
      )}

      {/* Container for Genesys chat widget */}
      <div id={containerId} className="genesys-chat-container" />

      {/* Only load script if configuration is ready and user is eligible */}
      {genesysChatConfig && isChatEnabled && (
        <GenesysScriptLoader
          config={genesysChatConfig}
          onLoad={handleScriptLoaded}
          onError={handleScriptError}
          showStatus={showLoaderStatus}
        />
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
