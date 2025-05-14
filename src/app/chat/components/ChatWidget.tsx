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

    try {
      // 1. Set window.chatSettings with all configuration
      window.chatSettings = genesysChatConfig;

      // Log configuration for debugging
      logger.info('[ChatWidget] Window configuration set', {
        chatSettingsKeys: Object.keys(window.chatSettings || {}),
        timestamp: new Date().toISOString(),
      });

      // 2. Load CSS files without any conditionals
      const cssFiles = [
        {
          id: 'genesys-widgets-css',
          href: 'assets/genesys/plugins/widgets.min.css',
        },
        {
          id: 'bcbst-custom-css',
          href: 'assets/genesys/styles/bcbst-custom.css',
        },
      ];

      // Load all CSS files
      cssFiles.forEach((file) => {
        // Skip if already loaded
        if (document.getElementById(file.id)) {
          logger.info(`[ChatWidget] CSS already loaded: ${file.id}`);
          return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = file.href;
        link.id = file.id;
        document.head.appendChild(link);

        logger.info(`[ChatWidget] CSS loaded: ${file.id}`);
      });

      // 3. Load the JS file directly
      if (document.getElementById('genesys-click-to-chat')) {
        logger.info('[ChatWidget] Genesys script already loaded');
      } else {
        logger.info('[ChatWidget] Loading Genesys script');
        const script = document.createElement('script');
        script.src = 'assets/genesys/click_to_chat.js';
        script.id = 'genesys-click-to-chat';

        script.onload = () => {
          logger.info('[ChatWidget] Genesys script loaded successfully');

          // Wait a moment for script initialization
          setTimeout(() => {
            // Trigger button creation
            logger.info('[ChatWidget] Triggering button creation');

            // Try event dispatch
            document.dispatchEvent(new CustomEvent('genesys:create-button'));

            // Try direct function call if available
            const genesysWindow = window as unknown as GenesysWindow;
            if (
              genesysWindow._forceChatButtonCreate &&
              typeof genesysWindow._forceChatButtonCreate === 'function'
            ) {
              genesysWindow._forceChatButtonCreate();
            }
          }, 500);
        };

        script.onerror = () => {
          logger.error('[ChatWidget] Failed to load Genesys script');
          setScriptLoadFailed(true);
        };

        document.head.appendChild(script);
      }
    } catch (err) {
      logger.error('[ChatWidget] Error initializing Genesys SDK', {
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      });
      setScriptLoadFailed(true);
    }
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
