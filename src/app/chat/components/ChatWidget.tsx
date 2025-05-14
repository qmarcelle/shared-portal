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
 * 4. Explicit Genesys SDK initialization after config is ready
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
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  // Script loading utilities
  const scriptLoadTracker = useRef(new Set<string>());

  const loadScript = useCallback((src: string, id: string) => {
    return new Promise<void>((resolve, reject) => {
      if (document.getElementById(id) || scriptLoadTracker.current.has(id)) {
        logger.info(`[ChatWidget] Script ${id} already loaded, skipping`);
        resolve();
        return;
      }

      // Ensure path is correctly formatted for Next.js static assets
      // Note: Next.js serves files from /public at the root URL path
      const scriptSrc = src.startsWith('/')
        ? src.substring(1) // Remove leading slash if present
        : src;

      logger.info(`[ChatWidget] Loading script from: ${scriptSrc}`);

      const script = document.createElement('script');
      script.id = id;
      script.src = scriptSrc;
      script.async = true;
      script.onload = () => {
        scriptLoadTracker.current.add(id);
        logger.info(`[ChatWidget] Script ${id} loaded successfully`);
        resolve();
      };
      script.onerror = (err) => {
        const errorMsg = `Failed to load script: ${scriptSrc}`;
        logger.error(`[ChatWidget] ${errorMsg}`, err);
        reject(new Error(errorMsg));
      };
      document.head.appendChild(script);
    });
  }, []);

  const loadStylesheet = useCallback((href: string, id: string) => {
    return new Promise<void>((resolve, reject) => {
      if (document.getElementById(id)) {
        logger.info(`[ChatWidget] Stylesheet ${id} already loaded, skipping`);
        resolve();
        return;
      }

      // Ensure path is correctly formatted for Next.js static assets
      // Note: Next.js serves files from /public at the root URL path
      const stylesheetHref = href.startsWith('/')
        ? href.substring(1) // Remove leading slash if present
        : href;

      logger.info(`[ChatWidget] Loading stylesheet from: ${stylesheetHref}`);

      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = stylesheetHref;

      link.onload = () => {
        logger.info(`[ChatWidget] Stylesheet ${id} loaded successfully`);
        resolve();
      };
      link.onerror = (err) => {
        const errorMsg = `Failed to load stylesheet: ${stylesheetHref}`;
        logger.error(`[ChatWidget] ${errorMsg}`, err);
        reject(new Error(errorMsg));
      };

      document.head.appendChild(link);
    });
  }, []);

  const loadAllScripts = useCallback(async () => {
    try {
      logger.info('[ChatWidget] Starting to load Genesys resources');

      // First load the CSS files
      logger.info('[ChatWidget] Loading widgets.min.css');
      await loadStylesheet(
        'assets/genesys/plugins/widgets.min.css',
        'genesys-widgets-css',
      );

      logger.info('[ChatWidget] Loading bcbst-custom.css');
      await loadStylesheet(
        'assets/genesys/styles/bcbst-custom.css',
        'bcbst-custom-css',
      );

      // Then load the JS file
      logger.info('[ChatWidget] Loading click_to_chat.js');
      await loadScript(
        'assets/genesys/click_to_chat.js',
        'genesys-click-to-chat',
      );

      // Attempt to verify the scripts were loaded correctly
      const verifyScripts = () => {
        const widgetsCSS = document.getElementById('genesys-widgets-css');
        const customCSS = document.getElementById('bcbst-custom-css');
        const clickToChat = document.getElementById('genesys-click-to-chat');

        logger.info('[ChatWidget] Script verification:', {
          widgetsCSS: !!widgetsCSS,
          customCSS: !!customCSS,
          clickToChat: !!clickToChat,
        });

        if (!widgetsCSS || !customCSS || !clickToChat) {
          logger.warn(
            '[ChatWidget] Some resources may not have loaded correctly',
          );
        }
      };

      // Run verification after a small delay to ensure DOM is updated
      setTimeout(verifyScripts, 500);

      logger.info('[ChatWidget] All Genesys scripts/styles loaded');
      return true;
    } catch (err) {
      logger.error('[ChatWidget] Error loading Genesys scripts/styles', err);
      setScriptLoadFailed(true);
      return false;
    }
  }, [loadScript, loadStylesheet]);

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

    // Check if scripts are already loaded in the DOM (could be from a previous initialization)
    const areScriptsAlreadyLoaded = () => {
      const widgetsCSS = document.getElementById('genesys-widgets-css');
      const customCSS = document.getElementById('bcbst-custom-css');
      const clickToChat = document.getElementById('genesys-click-to-chat');

      return !!widgetsCSS && !!customCSS && !!clickToChat;
    };

    if (areScriptsAlreadyLoaded()) {
      logger.info(
        '[ChatWidget] Genesys scripts already loaded in DOM, skipping load',
      );
      // If scripts are already loaded, we might need to trigger initialization manually
      if (
        genesysWindow._forceChatButtonCreate &&
        typeof genesysWindow._forceChatButtonCreate === 'function'
      ) {
        logger.info('[ChatWidget] Forcing chat button creation');
        genesysWindow._forceChatButtonCreate();
      }
      return;
    }

    // Load necessary scripts and styles
    loadAllScripts()
      .then(() => {
        logger.info('[ChatWidget] Genesys scripts loaded successfully');

        // After scripts are loaded, check if we need to force create the chat button
        setTimeout(() => {
          if (
            genesysWindow._forceChatButtonCreate &&
            typeof genesysWindow._forceChatButtonCreate === 'function'
          ) {
            logger.info('[ChatWidget] Forcing chat button creation after load');
            genesysWindow._forceChatButtonCreate();
          }

          // Also dispatch an event that the click_to_chat.js script listens for
          const event = new CustomEvent('genesys:create-button');
          document.dispatchEvent(event);
        }, 1000);
      })
      .catch((err) => {
        logger.error('[ChatWidget] Failed to load Genesys scripts', {
          error: err,
        });
        setScriptLoadFailed(true);
      });
  }, [genesysChatConfig, loadAllScripts]);

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

      // Add debug function to window for direct script loading test
      if (process.env.NODE_ENV === 'development') {
        (window as any).debugGenesysLoading = () => {
          logger.info('[ChatWidget] Manual debug loading triggered');
          // Set config
          (window as any).chatSettings = genesysChatConfig;
          // Try loading scripts directly
          const widgetsCSS = document.createElement('link');
          widgetsCSS.rel = 'stylesheet';
          widgetsCSS.href = 'assets/genesys/plugins/widgets.min.css';
          document.head.appendChild(widgetsCSS);

          const customCSS = document.createElement('link');
          customCSS.rel = 'stylesheet';
          customCSS.href = 'assets/genesys/styles/bcbst-custom.css';
          document.head.appendChild(customCSS);

          const clickToChat = document.createElement('script');
          clickToChat.src = 'assets/genesys/click_to_chat.js';
          document.head.appendChild(clickToChat);

          logger.info('[ChatWidget] Debug loading complete');
          return 'Debug loading triggered';
        };
      }
    }
  }, [genesysChatConfig, initializeGenesysSDK]);

  // Retry mechanism for error recovery
  useEffect(() => {
    if (error && memberId && planId) {
      logger.warn(
        '[ChatWidget] Error loading configuration, scheduling retry',
        {
          error: error.toString(),
          timestamp: new Date().toISOString(),
        },
      );

      retryTimeoutRef.current = setTimeout(() => {
        logger.info('[ChatWidget] Retrying chat configuration load');
        didInitialize.current = false;
        loadChatConfiguration(memberId, planId);
      }, 5000);
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [error, memberId, planId, loadChatConfiguration]);

  // Add direct script loading on component mount
  useEffect(() => {
    if (!hasConfigLoaded || !genesysChatConfig) return;

    const loadScriptsDirectly = () => {
      logger.info('[ChatWidget] Attempting direct script loading as fallback');

      // Try a different approach with <script> tags in sequence
      // 1. Load CSS files
      const widgetsCSS = document.createElement('link');
      widgetsCSS.rel = 'stylesheet';
      widgetsCSS.href = 'assets/genesys/plugins/widgets.min.css';
      widgetsCSS.id = 'genesys-widgets-css-direct';
      document.head.appendChild(widgetsCSS);

      const customCSS = document.createElement('link');
      customCSS.rel = 'stylesheet';
      customCSS.href = 'assets/genesys/styles/bcbst-custom.css';
      customCSS.id = 'bcbst-custom-css-direct';
      document.head.appendChild(customCSS);

      // 2. Load main script last
      const clickToChat = document.createElement('script');
      clickToChat.src = 'assets/genesys/click_to_chat.js';
      clickToChat.id = 'genesys-click-to-chat-direct';
      clickToChat.onload = () => {
        logger.info('[ChatWidget] Direct script loading complete');

        // Try to create the chat button after script loads
        setTimeout(() => {
          const event = new CustomEvent('genesys:create-button');
          document.dispatchEvent(event);
        }, 500);
      };
      document.head.appendChild(clickToChat);
    };

    // Try direct loading a few seconds after initialization
    // This serves as a fallback if the async loading approach fails
    setTimeout(loadScriptsDirectly, 3000);
  }, [hasConfigLoaded, genesysChatConfig]);

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

    // Render debug info in development environment
    const showDebugInfo = process.env.NODE_ENV === 'development';
    return (
      <div id="genesys-chat-container">
        {hasConfigLoaded && showDebugInfo && (
          <div
            className="debug-info"
            style={{ padding: '10px', margin: '5px', border: '1px solid #ccc' }}
          >
            <p>Genesys Chat Config Loaded</p>
            <button
              onClick={() => {
                logger.info(
                  '[ChatWidget] Manual chat button creation triggered',
                );
                // Create event to trigger chat button creation
                const event = new CustomEvent('genesys:create-button');
                document.dispatchEvent(event);
                // Try direct function call as well
                const genesysWindow = window as unknown as GenesysWindow;
                if (genesysWindow._forceChatButtonCreate) {
                  genesysWindow._forceChatButtonCreate();
                }
              }}
              style={{ padding: '5px', margin: '5px' }}
            >
              Force Create Chat Button
            </button>
          </div>
        )}
      </div>
    );
  };

  return renderContent();
}
