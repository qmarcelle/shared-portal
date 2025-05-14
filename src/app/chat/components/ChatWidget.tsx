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
 * 4. Using Next.js Script component for reliable script loading
 */

import { usePlanContext } from '@/app/chat/hooks/usePlanContext';
import { useUserContext } from '@/app/chat/hooks/useUserContext';
import { useChatStore } from '@/app/chat/stores/chatStore';
import { logger } from '@/utils/logger';
import Script from 'next/script';
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
  const [cssLoaded, setCssLoaded] = useState(false);
  const [scriptState, setScriptState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );
  const didInitialize = useRef(false);
  const cssInjected = useRef(false);

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

  // Set up window configuration when genesysChatConfig is available
  useEffect(() => {
    if (genesysChatConfig && window) {
      logger.info('[ChatWidget] Setting window.chatSettings', {
        configKeys: Object.keys(genesysChatConfig),
        timestamp: new Date().toISOString(),
      });

      try {
        // Set up window objects with complete configuration
        (window as unknown as GenesysWindow).chatSettings = genesysChatConfig;

        // Log success
        logger.info('[ChatWidget] Window configuration set successfully');
        setHasConfigLoaded(true);
      } catch (err) {
        logger.error('[ChatWidget] Error setting window configuration', {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });
      }
    }
  }, [genesysChatConfig]);

  // Inject CSS files
  useEffect(() => {
    if (cssInjected.current) return;

    // Function to inject CSS
    const injectCSS = () => {
      try {
        logger.info('[ChatWidget] Injecting CSS files');

        const cssFiles = [
          {
            id: 'genesys-widgets-css',
            href: '/assets/genesys/plugins/widgets.min.css',
          },
          {
            id: 'bcbst-custom-css',
            href: '/assets/genesys/styles/bcbst-custom.css',
          },
        ];

        cssFiles.forEach((file) => {
          if (document.getElementById(file.id)) {
            logger.info(`[ChatWidget] CSS already exists: ${file.id}`);
            return;
          }

          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = file.href;
          link.id = file.id;
          document.head.appendChild(link);

          logger.info(`[ChatWidget] CSS injected: ${file.id}`);
        });

        cssInjected.current = true;
        setCssLoaded(true);
      } catch (err) {
        logger.error('[ChatWidget] Error injecting CSS', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    };

    injectCSS();
  }, []);

  // Manual script initialization after script loads
  const initializeScript = useCallback(() => {
    logger.info('[ChatWidget] Initializing chat button');

    try {
      setTimeout(() => {
        const genesysWindow = window as unknown as GenesysWindow;

        // Method 1: Try event dispatch
        document.dispatchEvent(new CustomEvent('genesys:create-button'));
        logger.info('[ChatWidget] genesys:create-button event dispatched');

        // Method 2: Try direct function call if available
        if (
          genesysWindow._forceChatButtonCreate &&
          typeof genesysWindow._forceChatButtonCreate === 'function'
        ) {
          genesysWindow._forceChatButtonCreate();
          logger.info('[ChatWidget] _forceChatButtonCreate function called');
        }

        // Method 3: Try CXBus if available
        if (
          genesysWindow.CXBus &&
          typeof genesysWindow.CXBus.command === 'function'
        ) {
          genesysWindow.CXBus.command('WebChat.open');
          logger.info('[ChatWidget] CXBus.command(WebChat.open) called');
        }
      }, 500);
    } catch (err) {
      logger.error('[ChatWidget] Error initializing chat button', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }, []);

  // Load chat configuration when contexts are ready
  useEffect(() => {
    if (memberId && planId) {
      initializeChat();
    }
  }, [memberId, planId, initializeChat]);

  // Render with Script component when config is loaded
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

    if (scriptLoadFailed || scriptState === 'error') {
      return (
        <div className="error-state">
          <p>Failed to load Genesys chat script</p>
          <button onClick={() => window.location.reload()}>
            Retry Loading Script
          </button>
        </div>
      );
    }

    // Render with Next.js Script component when configuration is loaded
    return (
      <div id="genesys-chat-container">
        {hasConfigLoaded && (
          <Script
            id="genesys-chat-script"
            src="/assets/genesys/click_to_chat.js"
            strategy="afterInteractive"
            onLoad={() => {
              logger.info(
                '[ChatWidget] Script loaded successfully via next/script',
              );
              setScriptState('ready');
              initializeScript();
            }}
            onError={(err) => {
              logger.error(
                '[ChatWidget] Script failed to load via next/script',
                { error: err },
              );
              setScriptState('error');
              setScriptLoadFailed(true);
            }}
          />
        )}
      </div>
    );
  };

  return renderContent();
}
