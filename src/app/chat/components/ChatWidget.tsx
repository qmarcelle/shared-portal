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

// Use type assertion to handle the window.chatSettings assignment
declare global {
  interface Window {
    chatSettings?: any;
    gmsServicesConfig?: {
      GMSChatURL: () => string;
    };
  }
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
  const userContext = useUserContext();
  const { planContext, error: planError } = usePlanContext();

  // Log initial state
  logger.info('[ChatWidget] Initial state', {
    genesysChatConfig,
    isLoading,
    error,
    userContext,
    planContext,
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

    logger.info('[ChatWidget] Loading chat configuration with contexts');
    loadChatConfiguration(userContext.memberId, planContext.planId).catch(
      (err) => {
        logger.error('[ChatWidget] Failed to load chat configuration', err);
      },
    );
  }, [userContext?.memberId, planContext?.planId, loadChatConfiguration]);

  // Load chat configuration when contexts are available, but only once
  useEffect(() => {
    logger.info('[ChatWidget] Checking if initialization is needed', {
      didInitialize: didInitialize.current,
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

    // Only load config once - prevent infinite loop
    if (didInitialize.current) {
      logger.info('[ChatWidget] Already initialized, skipping');
      return;
    }

    if (!userContext?.memberId || !planContext?.planId) {
      logger.warn('[ChatWidget] No context available, waiting for context');
      return;
    }

    // Mark as initialized and load configuration
    didInitialize.current = true;
    initializeChat();
  }, [userContext, planContext, chatSettings, initializeChat]);

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

      // Inject CSS if not already present
      if (!document.querySelector('link[data-genesys-widget]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = effectiveConfig.widgetUrl;
        link.setAttribute('data-genesys-widget', 'true');
        document.head.appendChild(link);
        logger.info('[ChatWidget] Injected Genesys widget CSS', {
          href: effectiveConfig.widgetUrl,
        });
      } else {
        logger.info('[ChatWidget] Genesys widget CSS already present');
      }

      // Inject JS if not already present
      if (!document.querySelector('script[data-genesys-widget]')) {
        const script = document.createElement('script');
        script.src = effectiveConfig.clickToChatJs;
        script.async = true;
        script.setAttribute('data-genesys-widget', 'true');
        script.onload = () =>
          logger.info('[ChatWidget] Genesys widget JS loaded');
        script.onerror = (e) => {
          logger.error('[ChatWidget] Genesys widget JS failed to load', e);
          setScriptError(true);
        };
        document.body.appendChild(script);
        logger.info('[ChatWidget] Injected Genesys widget JS', {
          src: effectiveConfig.clickToChatJs,
        });
      } else {
        logger.info('[ChatWidget] Genesys widget JS already present');
      }
    } catch (e) {
      logger.error('[ChatWidget] Error during script injection', e);
      setScriptError(true);
    }
    return () => {
      logger.info('[ChatWidget] Cleanup on unmount');
    };
  }, [genesysChatConfig, chatSettings]);

  // Early returns for missing dependencies
  const hasEffectiveConfig =
    (chatSettings && Object.keys(chatSettings).length > 0) ||
    !!genesysChatConfig;

  if (!userContext) {
    logger.warn('[ChatWidget] No user context available, returning early');
    return null;
  }

  if (!planContext) {
    logger.warn('[ChatWidget] No plan context available, returning early');
    return planError ? (
      <div>Error loading chat: {planError.message}</div>
    ) : null;
  }

  if (!hasEffectiveConfig) {
    logger.warn(
      '[ChatWidget] No chat configuration available, returning early',
    );
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
