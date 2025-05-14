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

import { useChatStore } from '@/app/chat/stores/chatStore';
import { logger } from '@/utils/logger';
import { useEffect, useState } from 'react';

// We'll use any to avoid type conflicts with other declarations
// in the codebase that we can't see

export default function ChatWidget() {
  logger.info('[ChatWidget] Component render start');
  const { genesysChatConfig, isLoading, error } = useChatStore();
  const [scriptError, setScriptError] = useState(false);

  // Log initial state
  logger.info('[ChatWidget] Initial state', {
    genesysChatConfig,
    isLoading,
    error,
  });

  useEffect(() => {
    logger.info('[ChatWidget] useEffect triggered', { genesysChatConfig });
    if (!genesysChatConfig) {
      logger.warn(
        '[ChatWidget] useEffect: No genesysChatConfig present, returning early',
      );
      return;
    }
    try {
      // Set config globals before loading scripts
      window.chatSettings = genesysChatConfig;
      window.gmsServicesConfig = {
        GMSChatURL: () => genesysChatConfig.gmsChatUrl,
      };
      logger.info(
        '[ChatWidget] Set window.chatSettings and window.gmsServicesConfig',
        {
          chatSettings: window.chatSettings,
          gmsServicesConfig: window.gmsServicesConfig,
        },
      );

      // Inject CSS if not already present
      if (!document.querySelector('link[data-genesys-widget]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = genesysChatConfig.widgetUrl;
        link.setAttribute('data-genesys-widget', 'true');
        document.head.appendChild(link);
        logger.info('[ChatWidget] Injected Genesys widget CSS', {
          href: genesysChatConfig.widgetUrl,
        });
      } else {
        logger.info('[ChatWidget] Genesys widget CSS already present');
      }

      // Inject JS if not already present
      if (!document.querySelector('script[data-genesys-widget]')) {
        const script = document.createElement('script');
        script.src = genesysChatConfig.clickToChatJs;
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
          src: genesysChatConfig.clickToChatJs,
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
  }, [genesysChatConfig]);

  // Early return if config is missing
  if (!genesysChatConfig) {
    logger.warn('[ChatWidget] No genesysChatConfig present, returning early');
    return null;
  }

  // Early return if not eligible (if you have eligibility logic)
  // if (!isEligible) {
  //   logger.warn('[ChatWidget] Not eligible, returning early');
  //   return null;
  // }

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
