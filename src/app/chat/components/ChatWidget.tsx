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

      // Ensure we have the correct path (relative or absolute)
      const scriptSrc = src.startsWith('/') ? src : `/${src}`;

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

      // Ensure we have the correct path (relative or absolute)
      const stylesheetHref = href.startsWith('/') ? href : `/${href}`;

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
        '/assets/genesys/plugins/widgets.min.css',
        'genesys-widgets-css',
      );

      logger.info('[ChatWidget] Loading bcbst-custom.css');
      await loadStylesheet(
        '/assets/genesys/styles/bcbst-custom.css',
        'bcbst-custom-css',
      );

      // Then load the JS file
      logger.info('[ChatWidget] Loading click_to_chat.js');
      await loadScript(
        '/assets/genesys/click_to_chat.js',
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

    // Set up window objects
    (window as unknown as GenesysWindow).chatSettings = genesysChatConfig;
    (window as unknown as GenesysWindow).gmsServicesConfig = {
      GMSChatURL: () => genesysChatConfig.gmsChatUrl,
    };

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
      const genesysWindow = window as unknown as GenesysWindow;
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
          const genesysWindow = window as unknown as GenesysWindow;
          if (
            genesysWindow._forceChatButtonCreate &&
            typeof genesysWindow._forceChatButtonCreate === 'function'
          ) {
            logger.info('[ChatWidget] Forcing chat button creation after load');
            genesysWindow._forceChatButtonCreate();
          }
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
    }
  }, [genesysChatConfig, initializeGenesysSDK]);

  // Retry mechanism for error recovery
  useEffect(() => {
    if (error && memberId && planId) {
      logger.warn(
        '[ChatWidget] Error loading configuration, scheduling retry',
        {
          error: error.message,
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

  // Render logic with clear loading states
  if (isUserContextLoading || isPlanContextLoading) {
    return (
      <div className="chat-widget-loading">Loading user information...</div>
    );
  }

  if (!memberId || !planId) {
    return (
      <div className="chat-widget-error">Missing user or plan information</div>
    );
  }

  if (isLoading) {
    return (
      <div className="chat-widget-loading">Loading chat configuration...</div>
    );
  }

  if (error) {
    return (
      <div className="chat-widget-error">
        Error loading chat: {error.message}
      </div>
    );
  }

  if (scriptLoadFailed) {
    return <div className="chat-widget-error">Failed to load chat widget</div>;
  }

  // Only render the chat container when configuration is properly loaded
  return hasConfigLoaded ? (
    <div id="genesys-chat-widget-container">
      {/* Chat widget will be mounted here by the Genesys script */}
    </div>
  ) : null;
}
