'use client';

/**
 * ChatWidget Component
 *
 * This component handles the integration with Genesys chat widget system.
 * It includes multiple strategies to ensure the chat button appears reliably:
 * 1. Properly sequenced CSS and script loading
 * 2. Configuration setup before script loading
 * 3. Multiple fallback mechanisms to guarantee button creation
 *
 * The component has been simplified from a complex implementation with many
 * overlapping fallbacks to a more streamlined approach.
 */

import { usePlanContext } from '@/app/chat/hooks/usePlanContext';
import { useUserContext } from '@/app/chat/hooks/useUserContext';
import { useChatStore } from '@/app/chat/stores/chatStore';
import { logger } from '@/utils/logger';
import { useCallback, useEffect, useRef, useState } from 'react';

// Define a type that allows any chat settings structure
// This is more forgiving than trying to enforce a specific structure
interface ChatWidgetProps {
  chatSettings?: Record<string, any>;
}

// Sequence tracking for initialization loop prevention
let initSequence = 0;
const MAX_ALLOWED_SEQUENCE = 5; // Reasonable maximum for initialization

export default function ChatWidget({ chatSettings = {} }: ChatWidgetProps) {
  logger.info('[ChatWidget] Component render start', {
    hasChatSettings: !!chatSettings,
    chatSettingsKeys: Object.keys(chatSettings),
  });

  // Prevent multiple configuration loads
  const didInitialize = useRef(false);
const mountCount = useRef(0); // Track component mounts

  const { genesysChatConfig, isLoading, error, loadChatConfiguration } =
    useChatStore();
  const [scriptError, setScriptError] = useState(false);
const lastConfig = useRef<any>(null);
  const { userContext, isUserContextLoading } = useUserContext();
  const {
    planContext,
    error: planError,
    isPlanContextLoading,
  } = usePlanContext();

  const didScriptsLoad = useRef(false);

  // Log initial state
  logger.info('[ChatWidget] Initial state', {
    genesysChatConfig,
    isLoading,
    error,
    userContext,
    isUserContextLoading,
    planContext,
    isPlanContextLoading,
    planError,
    hasChatSettings: !!chatSettings,
    didInitialize: didInitialize.current,
  });

  // Memoize the loadChatConfiguration function to prevent dependency changes
  const initializeChat = useCallback(() => {
  // Track and limit execution frequency
  initSequence++;
  console.log(`[Init Sequence ${initSequence}] Starting chat initialization`);
  if (initSequence > MAX_ALLOWED_SEQUENCE) {
    console.error('Too many initialization attempts - breaking potential loop');
    return;
  }
    if (!userContext?.memberId || !planContext?.planId) {
      logger.warn('[ChatWidget] Missing required context for initialization', {
        hasMemberId: !!userContext?.memberId,
        hasPlanId: !!planContext?.planId,
      });
      return;
    }

    logger.info('[ChatWidget] Loading chat configuration with contexts', {
      memberId: userContext.memberId,
      planId: planContext.planId,
    });

    loadChatConfiguration(userContext.memberId, planContext.planId).catch(
      (err) => {
        logger.error('[ChatWidget] Failed to load chat configuration', err);
      },
    );
  }, [userContext?.memberId, planContext?.planId, loadChatConfiguration]);

  // Load chat configuration when contexts are available and only once
  useEffect(() => {
  mountCount.current++;
  console.log(`ChatWidget mounted ${mountCount.current} times`);
  if (mountCount.current > 2) {
    console.error('Excessive component remounts detected');
  }
  return () => {
    console.log('ChatWidget unmounted');
  };
}, []);

// --- Initialization Effect ---
useEffect(() => {
    logger.info('[ChatWidget] Checking if initialization is needed', {
      didInitialize: didInitialize.current,
      isUserContextLoading,
      isPlanContextLoading,
      hasChatSettings: !!chatSettings && Object.keys(chatSettings).length > 0,
    });

    // If we already have chat settings from props, use them
    if (chatSettings && Object.keys(chatSettings).length > 0) {
      logger.info('[ChatWidget] Using chat settings from props', {
        chatSettingsKeys: Object.keys(chatSettings),
      });
      // No need to initialize again since we have settings
      return;
    }

    // Only proceed when all required data is DEFINITELY available
    if (didInitialize.current || isUserContextLoading || isPlanContextLoading) {
      logger.info('[ChatWidget] Initialization deferred', {
        reason: didInitialize.current
          ? 'Already initialized'
          : 'Contexts still loading',
        isUserContextLoading,
        isPlanContextLoading,
      });
      return;
    }

    // Strong validation of context data
    if (userContext?.memberId && planContext?.planId) {
      logger.info('[ChatWidget] Initializing chat with:', {
        memberId: userContext.memberId,
        planId: planContext.planId,
      });

      didInitialize.current = true;
      initializeChat();
    } else {
      logger.warn('[ChatWidget] Missing required context data:', {
        userContext,
        planContext,
        hasMemberId: !!userContext?.memberId,
        hasPlanId: !!planContext?.planId,
      });
    }
  }, [
    userContext,
    planContext,
    isUserContextLoading,
    isPlanContextLoading,
    chatSettings,
    initializeChat,
  ]);

  // Utility to load a script only once by ID
  const scriptLoadTracker = useRef(new Set<string>());
const loadScript = (src: string, id: string) => {
    return new Promise<void>((resolve, reject) => {
      if (document.getElementById(id) || scriptLoadTracker.current.has(id)) {
        console.log(`[ChatWidget] Script ${id} already loaded, skipping`);
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.async = true;
      script.onload = () => {
        scriptLoadTracker.current.add(id);
        console.log(`[ChatWidget] Script ${id} loaded`);
        resolve();
      };
      script.onerror = (err) => {
        console.error(`[ChatWidget] Script ${id} failed to load`, err);
        reject();
      };
      document.head.appendChild(script);
    });
  };

  // Utility to load a stylesheet only once by ID
  const loadStylesheet = (href: string, id: string) => {
    return new Promise<void>((resolve, reject) => {
      if (document.getElementById(id)) {
        console.log(`[ChatWidget] Stylesheet ${id} already loaded, skipping`);
        resolve();
        return;
      }
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => {
        console.log(`[ChatWidget] Stylesheet ${id} loaded`);
        resolve();
      };
      link.onerror = (err) => {
        console.error(`[ChatWidget] Stylesheet ${id} failed to load`, err);
        reject();
      };
      document.head.appendChild(link);
    });
  };

  useEffect(() => {
    // Only load scripts when config is ready and not already loaded
    if (!chatSettings || didScriptsLoad.current) return;

    // Set config globals before loading scripts
    // State update guard: only update globals if config actually changes
    if (JSON.stringify(lastConfig.current) !== JSON.stringify(chatSettings)) {
      window.chatSettings = chatSettings as ChatSettings;
      window.gmsServicesConfig = {
        GMSChatURL: () => chatSettings.gmsChatUrl,
      };
      lastConfig.current = chatSettings;
      console.log('[ChatWidget] window.chatSettings set:', window.chatSettings);
    } else {
      console.log('Skipping redundant chatSettings update');
    }

    const loadAllScripts = async () => {
      try {
        // Load custom CSS after widgets.min.css for proper override
        await loadStylesheet(
          '/assets/genesys/plugins/widgets.min.css',
          'genesys-widgets-css',
        );
        await loadStylesheet(
          '/assets/genesys/styles/bcbst-custom.css',
          'bcbst-custom-css',
        );
        // Load click_to_chat.js
        await loadScript(
          '/assets/genesys/click_to_chat.js',
          'genesys-click-to-chat',
        );
        // For legacy mode, load widgets.min.js
        if (chatSettings.chatMode === 'legacy') {
          await loadScript(
            '/assets/genesys/plugins/widgets.min.js',
            'genesys-widgets',
          );
        }
        didScriptsLoad.current = true;
        console.log('[ChatWidget] All Genesys scripts/styles loaded');
      } catch (err) {
        console.error('[ChatWidget] Error loading Genesys scripts/styles', err);
      }
    };

    loadAllScripts();

    // No Cobrowse triggers here! Only user actions should call Cobrowse functions.

    // Optionally, cleanup event listeners here if you add any
    return () => {
      // No script/style removal to avoid breaking other widgets
    };
  }, [chatSettings]);

  // Early returns for missing dependencies
  const hasEffectiveConfig =
    (chatSettings && Object.keys(chatSettings).length > 0) ||
    !!genesysChatConfig;

  if (isUserContextLoading || isPlanContextLoading) {
    logger.info('[ChatWidget] Contexts still loading');
    return <div>Loading chat configuration...</div>;
  }

  if (!userContext) {
    logger.warn('[ChatWidget] No user context available');
    return null;
  }

  if (!planContext) {
    logger.warn('[ChatWidget] No plan context available');
    return planError ? (
      <div>Error loading chat: {planError.message}</div>
    ) : null;
  }

  if (!hasEffectiveConfig) {
    logger.warn('[ChatWidget] No chat configuration available');
    return null;
  }

  if (scriptError) {
    logger.error('[ChatWidget] Script error state, returning error UI');
    return <div>Failed to load chat widget.</div>;
  }

  logger.info('[ChatWidget] Render complete, returning widget UI');
  if (isLoading) return <div>Loading chat...</div>;
  if (error) return <div>Chat unavailable: {error.message}</div>;
  return (
    <div id="genesys-chat-widget-container">
      {/* Chat widget UI goes here */}
    </div>
  );
}
