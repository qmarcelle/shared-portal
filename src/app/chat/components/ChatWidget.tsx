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

export default function ChatWidget({ chatSettings = {} }: ChatWidgetProps) {
  logger.info('[ChatWidget] Component render start', {
    hasChatSettings: !!chatSettings,
    chatSettingsKeys: Object.keys(chatSettings),
  });

  // Prevent multiple configuration loads
  const didInitialize = useRef(false);

  const { genesysChatConfig, isLoading, error, loadChatConfiguration } =
    useChatStore();
  const [scriptError, setScriptError] = useState(false);
  const { userContext, isUserContextLoading } = useUserContext();
  const {
    planContext,
    error: planError,
    isPlanContextLoading,
  } = usePlanContext();

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

  // Handle script and config loading - this runs when genesysChatConfig changes
  useEffect(() => {
    const effectiveConfig =
      chatSettings && Object.keys(chatSettings).length > 0
        ? chatSettings
        : genesysChatConfig;

    logger.info('[ChatWidget] Script load effect triggered', {
      hasEffectiveConfig: !!effectiveConfig,
      configSource:
        chatSettings && Object.keys(chatSettings).length > 0
          ? 'props'
          : 'store',
    });

    if (!effectiveConfig) {
      logger.warn('[ChatWidget] No config present, returning early');
      return;
    }

    // Create a function to load scripts sequentially
    const loadScripts = async () => {
      try {
        // Set config globals before loading scripts
        window.chatSettings = effectiveConfig as any;
        window.gmsServicesConfig = {
          GMSChatURL: () => effectiveConfig.gmsChatUrl,
        };
        logger.info(
          '[ChatWidget] Set window.chatSettings and window.gmsServicesConfig',
          {
            chatSettings: !!window.chatSettings,
            gmsServicesConfig: !!window.gmsServicesConfig,
          },
        );

        // Verify globals are set before proceeding
        if (!window.chatSettings || !window.gmsServicesConfig) {
          throw new Error('Failed to set required global chat configuration');
        }

        // Load CSS first
        await loadStylesheet(effectiveConfig.widgetUrl);
        logger.info('[ChatWidget] CSS loaded successfully');

        // Then load click_to_chat.js
        await loadScript(effectiveConfig.clickToChatJs);
        logger.info('[ChatWidget] click_to_chat.js loaded successfully');

        // For legacy mode, load widgets.min.js
        if (effectiveConfig.chatMode === 'legacy') {
          await loadScript(
            effectiveConfig.genesysWidgetUrl ||
              '/assets/genesys/plugins/widgets.min.js',
          );
          logger.info('[ChatWidget] widgets.min.js loaded successfully');
        }

        logger.info('[ChatWidget] All scripts loaded successfully');
      } catch (e) {
        logger.error('[ChatWidget] Error during script loading sequence', e);
        setScriptError(true);
      }
    };

    // Helper function to load a stylesheet
    const loadStylesheet = (href: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Skip if already loaded
        if (document.querySelector(`link[href="${href}"]`)) {
          logger.info('[ChatWidget] CSS already present, skipping', { href });
          resolve();
          return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.setAttribute('data-genesys-widget', 'true');

        link.onload = () => {
          logger.info('[ChatWidget] CSS loaded', { href });
          resolve();
        };

        link.onerror = (err) => {
          logger.error('[ChatWidget] CSS loading error', { href, err });
          reject(new Error(`Failed to load CSS from ${href}`));
        };

        document.head.appendChild(link);
      });
    };

    // Helper function to load a script
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Skip if already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
          logger.info('[ChatWidget] Script already present, skipping', { src });
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.setAttribute('data-genesys-widget', 'true');

        script.onload = () => {
          logger.info('[ChatWidget] Script loaded', { src });
          resolve();
        };

        script.onerror = (err) => {
          logger.error('[ChatWidget] Script loading error', { src, err });
          reject(new Error(`Failed to load script from ${src}`));
        };

        document.body.appendChild(script);
      });
    };

    // Start the script loading sequence
    loadScripts();

    return () => {
      logger.info('[ChatWidget] Cleanup on unmount');
    };
  }, [genesysChatConfig, chatSettings]);

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
