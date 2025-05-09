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

  // Centralized Genesys script injection: only run once on mount
  useEffect(() => {
    // Only inject the script if not already present
    if (!document.getElementById('genesys-click-to-chat-js')) {
      console.log(
        '[Genesys Debug] Injecting /assets/genesys/click_to_chat.js ...',
      );
      const script = document.createElement('script');
      script.id = 'genesys-click-to-chat-js';
      script.src = '/assets/genesys/click_to_chat.js';
      script.async = true;
      script.onload = () => {
        console.log('[Genesys Debug] click_to_chat.js script loaded!');
        setScriptsLoaded(true);
      };
      script.onerror = (e) => {
        console.error('[Genesys Debug] Failed to load click_to_chat.js', e);
      };
      document.body.appendChild(script);
    } else {
      console.log('[Genesys Debug] click_to_chat.js script already present.');
      setScriptsLoaded(true);
    }
    // Do NOT remove the script on unmount (Genesys expects it to persist)
    // Only clean up chatSettings and openGenesysChat
    return () => {
      if (window.chatSettings) delete window.chatSettings;
      if (window.openGenesysChat) delete window.openGenesysChat;
    };
  }, []); // Only once on mount

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
    // --- LOGGING: Output chatSettings and check required fields ---
    const chatSettings = window.chatSettings;
    console.log(
      '[Genesys Debug] window.chatSettings at script load:',
      chatSettings,
    );
    const requiredFields = [
      'clickToChatEndpoint',
      'chatTokenEndpoint',
      'opsPhone',
      'opsPhoneHours',
    ];
    if (chatSettings) {
      const missingFields = requiredFields.filter(
        (key) => !chatSettings[key] || chatSettings[key] === '',
      );
      if (missingFields.length > 0) {
        console.warn(
          '[Genesys Debug] Missing required chatSettings fields:',
          missingFields,
        );
      } else {
        console.log(
          '[Genesys Debug] All required chatSettings fields are present.',
        );
      }
    } else {
      console.warn('[Genesys Debug] window.chatSettings is undefined!');
    }
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
  }, [userData, componentId, chatMode]);

  if (chatMode !== 'legacy') {
    return null;
  }

  return null;
}
