'use client';
import { useChatStore } from '@/app/@chat/stores/chatStore';
import { logger } from '@/utils/logger';
import { useEffect, useState } from 'react';
import {
  hideInquiryDropdown,
  injectNewMessageBadge,
  injectPlanSwitcher,
} from '../utils/chatDomUtils';

declare global {
  interface Window {
    __genesysInitialized?: boolean;
  }
}

/**
 * Legacy chat implementation wrapper
 * Loads Genesys chat.js script with beforeInteractive strategy
 * Ensures proper integration with click_to_chat.js implementation
 */
export default function LegacyChatWrapper() {
  const { userData, formInputs, chatGroup, isPlanSwitcherLocked } =
    useChatStore();
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const componentId = Math.random().toString(36).substring(2, 10);
  const chatMode = useChatStore((state) => state.chatMode);

  useEffect(() => {
    logger.info('[LegacyChatWrapper] Component mounted', {
      componentId,
      hasUserData: !!userData,
      hasFormInputs: Array.isArray(formInputs) && formInputs.length > 0,
      chatGroup,
      timestamp: new Date().toISOString(),
    });
    return () => {
      logger.info('[LegacyChatWrapper] Component unmounting', {
        componentId,
        timestamp: new Date().toISOString(),
      });
    };
  }, []);

  useEffect(() => {
    if (!scriptsLoaded) return;
    logger.info(
      '[LegacyChatWrapper] Scripts loaded, applying DOM customizations',
      {
        componentId,
        timestamp: new Date().toISOString(),
      },
    );
    const applyCustomizations = () => {
      try {
        hideInquiryDropdown();
        injectNewMessageBadge();
        injectPlanSwitcher();
        logger.info('[LegacyChatWrapper] Chat DOM customizations applied', {
          componentId,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        logger.error('[LegacyChatWrapper] Failed to apply DOM customizations', {
          componentId,
          error,
          timestamp: new Date().toISOString(),
        });
      }
    };
    applyCustomizations();
    const timer = setTimeout(applyCustomizations, 1000);
    return () => clearTimeout(timer);
  }, [scriptsLoaded, componentId]);

  useEffect(() => {
    if (chatMode !== 'legacy') return;
    // Defensive: close any previous chat session
    if (typeof window.CXBus?.command === 'function') {
      try {
        window.CXBus.command('WebChat.close');
      } catch (e) {
        console.error('Error closing chat:', e);
      }
    }
    logger.info('[LegacyChatWrapper] Setting up chat settings', {
      componentId,
      hasUserData: !!userData,
      timestamp: new Date().toISOString(),
    });
    window.chatSettings = {
      bootstrapUrl: '',
      widgetUrl: '',
      clickToChatJs: '',
      clickToChatEndpoint: process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT || '',
      chatTokenEndpoint: process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT || '',
      coBrowseEndpoint: process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT || '',
      opsPhone: process.env.NEXT_PUBLIC_OPS_PHONE || '',
      opsPhoneHours: process.env.NEXT_PUBLIC_OPS_HOURS || '',
      ...userData,
    };
    logger.info('[LegacyChatWrapper] Chat settings initialized', {
      componentId,
      memberClientID: window.chatSettings?.memberClientID || '',
      isChatAvailable: window.chatSettings?.isChatAvailable || 'false',
      endpoint: window.chatSettings?.clickToChatEndpoint || 'N/A',
      hasSettings: !!window.chatSettings,
      timestamp: new Date().toISOString(),
    });
    // Provide openGenesysChat logic
    window.openGenesysChat = () => {
      if (window.CXBus && typeof window.CXBus.command === 'function') {
        try {
          window.CXBus.command('WebChat.open');
        } catch (e) {
          console.error('[LegacyChatWrapper] Error opening legacy chat', e);
        }
      }
    };
    // Load the legacy chat script
    const legacyScript = document.createElement('script');
    legacyScript.src = process.env.NEXT_PUBLIC_LEGACY_CHAT_SCRIPT_URL || '';
    legacyScript.async = true;
    legacyScript.onload = () => {
      logger.info('[LegacyChatWrapper] Legacy chat script loaded', {
        componentId,
        timestamp: new Date().toISOString(),
      });
      setScriptsLoaded(true);
    };
    legacyScript.onerror = (e) => {
      logger.error('[LegacyChatWrapper] Failed to load legacy chat script', {
        componentId,
        error: e,
        timestamp: new Date().toISOString(),
      });
    };
    document.body.appendChild(legacyScript);
    return () => {
      document.body.removeChild(legacyScript);
      if (window.chatSettings) delete window.chatSettings;
      if (window.openGenesysChat) delete window.openGenesysChat;
      logger.info('[LegacyChatWrapper] Cleanup complete', {
        componentId,
        timestamp: new Date().toISOString(),
      });
    };
  }, [userData, componentId, chatMode]);

  if (chatMode !== 'legacy') {
    return null;
  }

  return null;
}
