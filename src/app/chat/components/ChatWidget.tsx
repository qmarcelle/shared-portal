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
 * 4. Using Next.js Script component for proper script loading
 * 5. Direct DOM manipulation for CSS loading (required in App Router)
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
  const [cssLoadFailed, setCssLoadFailed] = useState(false);
  const didInitialize = useRef(false);
  const cssLoaded = useRef(false);

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

  // Set up Genesys configuration when it's ready
  const setupGenesysConfig = useCallback(() => {
    if (!genesysChatConfig || !window) return false;

    logger.info('[ChatWidget] Setting up Genesys configuration', {
      configKeys: Object.keys(genesysChatConfig),
      timestamp: new Date().toISOString(),
    });

    try {
      // Set window.chatSettings with all configuration
      (window as unknown as GenesysWindow).chatSettings = genesysChatConfig;

      logger.info('[ChatWidget] Window configuration set', {
        chatSettingsKeys: Object.keys(
          (window as unknown as GenesysWindow).chatSettings || {},
        ),
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (err) {
      logger.error('[ChatWidget] Error setting up Genesys configuration', {
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      });
      return false;
    }
  }, [genesysChatConfig]);

  /**
   * Load CSS files by directly manipulating the DOM
   *
   * Note: We use direct DOM manipulation instead of the <Head> component because:
   * 1. The <Head> component from next/head is not supported in the App Router
   * 2. CSS must be loaded before the script runs for proper styling
   * 3. This is a client component, so DOM manipulation is safe
   */
  useEffect(() => {
    // Only load CSS once
    if (cssLoaded.current) return;

    try {
      // Load CSS files
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

      // Track loading success for each file
      const cssLoadPromises = cssFiles.map((file) => {
        return new Promise<void>((resolve, reject) => {
          // Skip if already loaded
          if (document.getElementById(file.id)) {
            logger.info(`[ChatWidget] CSS already loaded: ${file.id}`);
            resolve();
            return;
          }

          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = file.href;
          link.id = file.id;

          // Set up load and error handlers
          link.onload = () => {
            logger.info(`[ChatWidget] CSS loaded successfully: ${file.id}`);
            resolve();
          };

          link.onerror = () => {
            logger.error(`[ChatWidget] Failed to load CSS: ${file.id}`);
            reject(new Error(`Failed to load CSS: ${file.id}`));
          };

          document.head.appendChild(link);
        });
      });

      // Handle all CSS load promises
      Promise.all(cssLoadPromises)
        .then(() => {
          logger.info('[ChatWidget] All CSS files loaded successfully');
          cssLoaded.current = true;
        })
        .catch((err) => {
          logger.error('[ChatWidget] Error loading CSS files', {
            error: err instanceof Error ? err.message : String(err),
          });
          setCssLoadFailed(true);
        });
    } catch (err) {
      logger.error('[ChatWidget] Error setting up CSS files', {
        error: err instanceof Error ? err.message : String(err),
      });
      setCssLoadFailed(true);
    }
  }, []);

  // Handle script load success
  const handleScriptLoad = useCallback(() => {
    logger.info('[ChatWidget] Genesys script loaded successfully');

    // Trigger button creation
    logger.info('[ChatWidget] Triggering button creation');

    try {
      // Method 1: Try event dispatch
      document.dispatchEvent(new CustomEvent('genesys:create-button'));

      // Method 2: Try direct function call if available
      const genesysWindow = window as unknown as GenesysWindow;
      if (
        genesysWindow._forceChatButtonCreate &&
        typeof genesysWindow._forceChatButtonCreate === 'function'
      ) {
        genesysWindow._forceChatButtonCreate();
      }

      // Method 3: Try CXBus if available
      if (
        genesysWindow.CXBus &&
        typeof genesysWindow.CXBus.command === 'function'
      ) {
        genesysWindow.CXBus.command('WebChat.open');
      }
    } catch (err) {
      logger.error('[ChatWidget] Error initializing chat button', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }, []);

  // Handle script load error
  const handleScriptError = useCallback(() => {
    logger.error('[ChatWidget] Failed to load Genesys script');
    setScriptLoadFailed(true);
  }, []);

  // Load chat configuration when contexts are ready
  useEffect(() => {
    if (memberId && planId) {
      initializeChat();
    }
  }, [memberId, planId, initializeChat]);

  // Set up configuration when loaded
  useEffect(() => {
    if (genesysChatConfig) {
      logger.info('[ChatWidget] Genesys chat config loaded', {
        configKeys: Object.keys(genesysChatConfig),
        timestamp: new Date().toISOString(),
      });
      setHasConfigLoaded(true);
      setupGenesysConfig();
    }
  }, [genesysChatConfig, setupGenesysConfig]);

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

    if (cssLoadFailed) {
      return (
        <div className="error-state">
          <p>Failed to load Genesys CSS resources</p>
          <button onClick={() => window.location.reload()}>
            Retry Loading Resources
          </button>
        </div>
      );
    }

    if (scriptLoadFailed) {
      return (
        <div className="error-state">
          <p>Failed to load Genesys chat script</p>
          <button onClick={() => window.location.reload()}>
            Retry Loading Script
          </button>
        </div>
      );
    }

    // Simple container for Genesys chat
    return <div id="genesys-chat-container" />;
  };

  return (
    <>
      {/* Load Genesys script when configuration is ready */}
      {hasConfigLoaded && !cssLoadFailed && (
        <Script
          id="genesys-click-to-chat"
          src="assets/genesys/click_to_chat.js"
          strategy="afterInteractive"
          onLoad={handleScriptLoad}
          onError={handleScriptError}
        />
      )}

      {renderContent()}
    </>
  );
}
