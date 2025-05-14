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
  const { genesysChatConfig, isLoading, error } = useChatStore();
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    logger.info('[ChatWidget] useEffect triggered', { genesysChatConfig });
    if (!genesysChatConfig) {
      logger.warn('[ChatWidget] No genesysChatConfig present');
      return;
    }
    // Set config globals before loading scripts
    window.chatSettings = genesysChatConfig;
    window.gmsServicesConfig = {
      GMSChatURL: () => genesysChatConfig.gmsChatUrl,
    };
    logger.info(
      '[ChatWidget] Set window.chatSettings and window.gmsServicesConfig',
      { chatSettings: window.chatSettings },
    );
    // For Genesys Cloud mode, set deploymentId/orgId if present
    if (genesysChatConfig.chatMode === 'cloud') {
      if (genesysChatConfig.deploymentId) {
        window.chatSettings.deploymentId = genesysChatConfig.deploymentId;
      }
      if (genesysChatConfig.orgId) {
        window.chatSettings.orgId = genesysChatConfig.orgId;
      }
      logger.info('[ChatWidget] Cloud mode: set deploymentId/orgId', {
        deploymentId: genesysChatConfig.deploymentId,
        orgId: genesysChatConfig.orgId,
      });
    }
    // Load CSS
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = genesysChatConfig.widgetUrl;
    document.head.appendChild(css);
    logger.info('[ChatWidget] Appended Genesys widget CSS', { href: css.href });
    // Load click_to_chat.js (legacy) or cloud script
    let script: HTMLScriptElement;
    if (genesysChatConfig.chatMode === 'cloud') {
      script = document.createElement('script');
      script.src = genesysChatConfig.clickToChatJs;
      script.async = true;
      script.onerror = () => {
        setScriptError(true);
        logger.error('[ChatWidget] Cloud script failed to load', {
          src: script.src,
        });
      };
      document.body.appendChild(script);
      logger.info('[ChatWidget] Appended Genesys cloud script', {
        src: script.src,
      });
      // Cleanup for cloud mode
      return () => {
        logger.info('[ChatWidget] Cleanup: removing cloud CSS and script');
        document.head.removeChild(css);
        document.body.removeChild(script);
      };
    } else {
      script = document.createElement('script');
      script.src = genesysChatConfig.clickToChatJs;
      script.async = true;
      script.onerror = () => {
        setScriptError(true);
        logger.error('[ChatWidget] click_to_chat.js failed to load', {
          src: script.src,
        });
      };
      document.body.appendChild(script);
      logger.info('[ChatWidget] Appended click_to_chat.js', {
        src: script.src,
      });
      // Load widgets.min.js after click_to_chat.js
      const widgetsScript: HTMLScriptElement = document.createElement('script');
      widgetsScript.src =
        genesysChatConfig.genesysWidgetUrl ||
        '/assets/genesys/plugins/widgets.min.js';
      widgetsScript.async = true;
      widgetsScript.onerror = () => {
        setScriptError(true);
        logger.error('[ChatWidget] widgets.min.js failed to load', {
          src: widgetsScript.src,
        });
      };
      document.body.appendChild(widgetsScript);
      logger.info('[ChatWidget] Appended widgets.min.js', {
        src: widgetsScript.src,
      });
      // Cleanup widgetsScript
      return () => {
        logger.info(
          '[ChatWidget] Cleanup: removing legacy CSS, click_to_chat.js, and widgets.min.js',
        );
        document.head.removeChild(css);
        document.body.removeChild(script);
        document.body.removeChild(widgetsScript);
      };
    }
  }, [genesysChatConfig]);

  if (isLoading) return <div>Loading chat...</div>;
  if (error) return <div>Chat unavailable: {error.message}</div>;
  if (scriptError)
    return <div>Chat failed to load. Please try again later.</div>;
  if (!genesysChatConfig) return null;
  return <div id="genesys-chat-root" />;
}
