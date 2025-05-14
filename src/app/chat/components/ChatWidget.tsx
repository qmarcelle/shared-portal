'use client';

/**
 * ChatWidget Component
 *
 * This component handles the integration with Genesys chat widget system.
 * It ensures proper configuration is loaded before attempting to render the chat widget,
 * preventing initialization loops and configuration errors.
 *
 * Key improvements:
 * 1. Stable configuration loading that waits for both user and plan contexts
 * 2. Clear loading states with informative messages
 * 3. Proper initialization sequencing with error handling
 * 4. Direct script loading without complex conditionals
 */

import { usePlanContext } from '@/app/chat/hooks/usePlanContext';
import { useUserContext } from '@/app/chat/hooks/useUserContext';
import { useChatStore } from '@/app/chat/stores/chatStore';
import { logger } from '@/utils/logger';
import { useCallback, useEffect, useRef, useState } from 'react';

// Define Genesys-specific properties for typechecking
interface GenesysWindow {
  chatSettings?: Record<string, any>;
  gmsServicesConfig?: {
    GMSChatURL: () => string;
  };
  _forceChatButtonCreate?: () => boolean;
  CXBus?: Record<string, any>;
}

// Define a type that allows any chat settings structure
interface ChatWidgetProps {
  chatSettings?: Record<string, any>;
}

export default function ChatWidget({ chatSettings = {} }: ChatWidgetProps) {
  logger.info('[ChatWidget] Component render start', {
    hasChatSettings: !!chatSettings,
    chatSettingsKeys: Object.keys(chatSettings),
  });

  // Track component state
  const [hasConfigLoaded, setHasConfigLoaded] = useState(false);
  const [scriptLoadFailed, setScriptLoadFailed] = useState(false);
  const didInitialize = useRef(false);

  // Get chat configuration from store
  const { genesysChatConfig, isLoading, error, loadChatConfiguration } =
    useChatStore();

  // Get user and plan contexts
  const { userContext, isUserContextLoading } = useUserContext();
  const {
    planContext,
    isPlanContextLoading,
    error: planError,
  } = usePlanContext();

  // Extract member and plan IDs for configuration loading
  const memberId = userContext?.memberId;
  const planId = planContext?.planId;

  // Initialize chat configuration
  const initializeChat = useCallback(() => {
    if (
      memberId &&
      planId &&
      !genesysChatConfig &&
      !isLoading &&
      !error &&
      !didInitialize.current
    ) {
      logger.info('[ChatWidget] Initializing chat configuration', {
        memberId,
        planId,
        timestamp: new Date().toISOString(),
      });
      didInitialize.current = true;
      loadChatConfiguration(memberId, planId);
    }
  }, [
    loadChatConfiguration,
    memberId,
    planId,
    genesysChatConfig,
    isLoading,
    error,
  ]);

  // Initialize Genesys SDK when configuration is ready
  const initializeGenesysSDK = useCallback(() => {
    if (!genesysChatConfig || !window) return;

    logger.info('[ChatWidget] Initializing Genesys SDK', {
      configKeys: Object.keys(genesysChatConfig),
      timestamp: new Date().toISOString(),
    });

    // Set up window objects with complete configuration
    const genesysWindow = window as unknown as GenesysWindow;

    // Assign the full config object to window.chatSettings
    genesysWindow.chatSettings = genesysChatConfig;

    // Set up service configuration
    genesysWindow.gmsServicesConfig = {
      GMSChatURL: () =>
        genesysChatConfig.gmsChatUrl ||
        genesysChatConfig.clickToChatEndpoint ||
        '',
    };

    // Log the current window config for debugging
    logger.info('[ChatWidget] Window configuration set', {
      chatSettings: !!genesysWindow.chatSettings,
      gmsServicesConfig: !!genesysWindow.gmsServicesConfig,
      settingsKeys: genesysWindow.chatSettings
        ? Object.keys(genesysWindow.chatSettings)
        : [],
    });

    // Load CSS files first - no conditional checks
    const widgetsCSS = document.createElement('link');
    widgetsCSS.rel = 'stylesheet';
    widgetsCSS.href = 'assets/genesys/plugins/widgets.min.css';
    widgetsCSS.id = 'genesys-widgets-css';
    document.head.appendChild(widgetsCSS);

    const customCSS = document.createElement('link');
    customCSS.rel = 'stylesheet';
    customCSS.href = 'assets/genesys/styles/bcbst-custom.css';
    customCSS.id = 'bcbst-custom-css';
    document.head.appendChild(customCSS);

    // Then load the JS file
    const clickToChat = document.createElement('script');
    clickToChat.src = 'assets/genesys/click_to_chat.js';
    clickToChat.id = 'genesys-click-to-chat';
    clickToChat.onload = () => {
      logger.info('[ChatWidget] Genesys script loaded successfully');

      // Try to initialize after script loads
      setTimeout(() => {
        // Dispatch event to trigger button creation
        const event = new CustomEvent('genesys:create-button');
        document.dispatchEvent(event);

        // Also try direct function call
        if (
          genesysWindow._forceChatButtonCreate &&
          typeof genesysWindow._forceChatButtonCreate === 'function'
        ) {
          genesysWindow._forceChatButtonCreate();
        }
      }, 500);
    };

    // Handle load error
    clickToChat.onerror = () => {
      logger.error('[ChatWidget] Failed to load Genesys script');
      setScriptLoadFailed(true);
    };

    document.head.appendChild(clickToChat);
  }, [genesysChatConfig]);

  // Load chat configuration when contexts are ready
  useEffect(() => {
    if (memberId && planId) {
      initializeChat();
    }
  }, [memberId, planId, initializeChat]);

  // Initialize SDK when configuration is loaded
  useEffect(() => {
    if (genesysChatConfig) {
      logger.info('[ChatWidget] Genesys chat config loaded', {
        configKeys: Object.keys(genesysChatConfig),
        timestamp: new Date().toISOString(),
      });
      setHasConfigLoaded(true);
      initializeGenesysSDK();
    }
  }, [genesysChatConfig, initializeGenesysSDK]);

  // Render logic with clear loading states
  const renderContent = () => {
    if (!memberId || !planId) {
      return (
        <div className="waiting-state">
          <p>Waiting for user and plan information...</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="loading-state">
          <p>Loading Chat Configuration...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-state">
          <p>Error loading chat configuration: {error.toString()}</p>
          <button
            onClick={() => {
              didInitialize.current = false;
              loadChatConfiguration(memberId, planId);
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    if (scriptLoadFailed) {
      return (
        <div className="error-state">
          <p>Failed to load Genesys chat resources</p>
          <button onClick={initializeGenesysSDK}>Retry Loading Scripts</button>
        </div>
      );
    }

    // Simple container for Genesys chat
    return <div id="genesys-chat-container" />;
  };

  return renderContent();
}
