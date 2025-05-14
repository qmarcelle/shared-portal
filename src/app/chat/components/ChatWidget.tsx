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
import { useEffect, useState } from 'react';

// We'll use any to avoid type conflicts with other declarations
// in the codebase that we can't see

export default function ChatWidget() {
  const { genesysChatConfig, isLoading, error } = useChatStore();
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    if (!genesysChatConfig) return;
    // Set config globals before loading scripts
    window.chatSettings = genesysChatConfig;
    window.gmsServicesConfig = {
      GMSChatURL: () => genesysChatConfig.gmsChatUrl,
    };
    // For Genesys Cloud mode, set deploymentId/orgId if present
    if (genesysChatConfig.chatMode === 'cloud') {
      if (genesysChatConfig.deploymentId) {
        window.chatSettings.deploymentId = genesysChatConfig.deploymentId;
      }
      if (genesysChatConfig.orgId) {
        window.chatSettings.orgId = genesysChatConfig.orgId;
      }
    }
    // Load CSS
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = genesysChatConfig.widgetUrl;
    document.head.appendChild(css);
    // Load click_to_chat.js (legacy) or cloud script
    let script: HTMLScriptElement;
    if (genesysChatConfig.chatMode === 'cloud') {
      script = document.createElement('script');
      script.src = genesysChatConfig.clickToChatJs; // Use cloud-specific script if needed
      script.async = true;
      script.onerror = () => setScriptError(true);
      document.body.appendChild(script);
    } else {
      script = document.createElement('script');
      script.src = genesysChatConfig.clickToChatJs;
      script.async = true;
      script.onerror = () => setScriptError(true);
      document.body.appendChild(script);
      // Load widgets.min.js after click_to_chat.js
      const widgetsScript: HTMLScriptElement = document.createElement('script');
      widgetsScript.src =
        genesysChatConfig.genesysWidgetUrl ||
        '/assets/genesys/plugins/widgets.min.js';
      widgetsScript.async = true;
      widgetsScript.onerror = () => setScriptError(true);
      document.body.appendChild(widgetsScript);
      // Cleanup widgetsScript
      return () => {
        document.head.removeChild(css);
        document.body.removeChild(script);
        document.body.removeChild(widgetsScript);
      };
    }
    // Cleanup for cloud mode
    return () => {
      document.head.removeChild(css);
      document.body.removeChild(script);
    };
  }, [genesysChatConfig]);

  if (isLoading) return <div>Loading chat...</div>;
  if (error) return <div>Chat unavailable: {error.message}</div>;
  if (scriptError)
    return <div>Chat failed to load. Please try again later.</div>;
  if (!genesysChatConfig) return null;
  return <div id="genesys-chat-root" />;
}
