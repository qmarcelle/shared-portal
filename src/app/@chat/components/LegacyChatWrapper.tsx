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
    // --- PATCH: Dynamically load /assets/genesys/click_to_chat.js ---
    if (!document.getElementById('genesys-click-to-chat-js')) {
      const script = document.createElement('script');
      script.id = 'genesys-click-to-chat-js';
      script.src = '/assets/genesys/click_to_chat.js';
      script.async = true;
      script.onload = () => {
        logger.info('[LegacyChatWrapper] click_to_chat.js loaded', {
          componentId,
          timestamp: new Date().toISOString(),
        });
        setScriptsLoaded(true);
      };
      script.onerror = (e) => {
        logger.error('[LegacyChatWrapper] Failed to load click_to_chat.js', {
          componentId,
          error: e,
          timestamp: new Date().toISOString(),
        });
      };
      document.body.appendChild(script);
    } else {
      setScriptsLoaded(true);
    }
    // Do NOT remove the script on unmount (Genesys expects it to persist)
    return () => {
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
