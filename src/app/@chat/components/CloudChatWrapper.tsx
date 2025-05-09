'use client';

// CloudChatWrapper injects the Genesys Cloud Messenger SDK and manages Messenger-specific events.
// All script loading, Messenger events, and errors are logged for traceability and debugging.

import { useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';

export default function CloudChatWrapper() {
  const { userData } = useChatStore();

  useEffect(() => {
    // Build chatSettings from env and userData
    window.chatSettings = {
      bootstrapUrl: process.env.NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL || '',
      widgetUrl: process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL || '',
      clickToChatJs: process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS || '',
      clickToChatEndpoint: process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT || '',
      chatTokenEndpoint: process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT || '',
      coBrowseEndpoint: process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT || '',
      opsPhone: process.env.NEXT_PUBLIC_OPS_PHONE || '',
      opsPhoneHours: process.env.NEXT_PUBLIC_OPS_HOURS || '',
      ...userData,
    };
    console.debug('[CloudChatWrapper] chatSettings:', window.chatSettings);

    // Load Genesys Cloud bootstrap script
    const bootstrapScript = document.createElement('script');
    bootstrapScript.src = window.chatSettings.bootstrapUrl || '';
    bootstrapScript.async = true;
    bootstrapScript.onload = () => {
      console.debug('[CloudChatWrapper] Genesys bootstrap loaded');
      // Load widgets script
      const widgetScript = document.createElement('script');
      widgetScript.src = window.chatSettings
        ? window.chatSettings.widgetUrl || ''
        : '';
      widgetScript.async = true;
      widgetScript.onload = () => {
        console.debug('[CloudChatWrapper] Genesys widgets loaded');
      };
      widgetScript.onerror = (e) => {
        console.error('[CloudChatWrapper] Failed to load widgets script', e);
      };
      document.body.appendChild(widgetScript);
    };
    bootstrapScript.onerror = (e) => {
      console.error('[CloudChatWrapper] Failed to load bootstrap script', e);
    };
    document.body.appendChild(bootstrapScript);

    // Provide openGenesysChat logic
    window.openGenesysChat = () => {
      if (window.Genesys) {
        try {
          window.Genesys('command', 'Messenger.open');
        } catch (e) {
          console.error(
            '[CloudChatWrapper] Error opening Genesys Messenger',
            e,
          );
        }
      }
    };

    return () => {
      // Cleanup scripts and chatSettings
      document.body.removeChild(bootstrapScript);
      const widgetUrl = window.chatSettings?.widgetUrl || '';
      if (widgetUrl) {
        const widgetScript = document.querySelector(
          'script[src="' + widgetUrl + '"]',
        );
        if (widgetScript) document.body.removeChild(widgetScript);
      }
      if (window.chatSettings) delete window.chatSettings;
      if (window.openGenesysChat) delete window.openGenesysChat;
      console.debug('[CloudChatWrapper] Cleanup complete');
    };
  }, [userData]);

  return null;
}
