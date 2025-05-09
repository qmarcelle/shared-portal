'use client';
import '@/../public/assets/genesys/plugins/widgets.min.css';
import { useChatStore } from '@/app/@chat/stores/chatStore';
import { logger } from '@/utils/logger';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import {
  hideInquiryDropdown,
  injectNewMessageBadge,
  injectPlanSwitcher,
} from '../utils/chatDomUtils';

declare global {
  interface Window {
    __genesysInitialized?: boolean;
    initializeChatWidget?: (jQuery: any, chatSettings: any) => void;
    jQuery?: any;
  }
}

// Define the expected type for chatSettings
// All properties optional to match runtime reality
type ChatSettings = {
  [key: string]: any;
  bootstrapUrl?: string;
  widgetUrl?: string;
  clickToChatJs?: string;
  clickToChatEndpoint?: string;
  chatTokenEndpoint?: string;
  coBrowseEndpoint?: string;
  opsPhone?: string;
  opsPhoneHours?: string;
};

/**
 * Legacy chat implementation wrapper
 * Loads Genesys chat.js script with beforeInteractive strategy
 * Ensures proper integration with click_to_chat.js implementation
 */
export default function LegacyChatWrapper() {
  const { userData, formInputs, chatGroup, isPlanSwitcherLocked } =
    useChatStore();
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [genesysReady, setGenesysReady] = useState(false);
  const componentId = Math.random().toString(36).substring(2, 10);
  const chatMode = useChatStore((state) => state.chatMode);
  const [settingsInjected, setSettingsInjected] = useState(false);

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

  // Listen for the genesys-ready event from the main scripts
  useEffect(() => {
    const handleGenesysReady = () => {
      console.log('[Genesys Debug] Genesys scripts are fully loaded and ready');
      setGenesysReady(true);
      setScriptsLoaded(true);
    };

    // Register listener for the custom event
    window.addEventListener('genesys-ready', handleGenesysReady);

    // Backup: also check for existing _genesys.widgets object
    if (window._genesys?.widgets) {
      console.log('[Genesys Debug] _genesys.widgets already available');
      setGenesysReady(true);
      setScriptsLoaded(true);
    }

    return () => {
      window.removeEventListener('genesys-ready', handleGenesysReady);
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

  // Inject chatSettings once for legacy mode
  useEffect(() => {
    if (chatMode !== 'legacy' || settingsInjected) return;
    window.chatSettings = {
      ...userData,
      clickToChatEndpoint: process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT || '',
      chatTokenEndpoint: process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT || '',
      coBrowseEndpoint: process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT || '',
      bootstrapUrl: process.env.NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL || '',
      widgetUrl: process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL || '',
      clickToChatJs: process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS || '',
      opsPhone: process.env.NEXT_PUBLIC_OPS_PHONE || '',
      opsPhoneHours: process.env.NEXT_PUBLIC_OPS_HOURS || '',
    };
    setSettingsInjected(true);
    console.log('[Legacy] chatSettings injected', window.chatSettings);
  }, [chatMode, settingsInjected, userData]);

  // Setup chat settings and options
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

    // Safely access and update chatSettings
    if (typeof window !== 'undefined' && window.chatSettings) {
      const chatSettings = window.chatSettings;
      window.chatSettings = {
        ...chatSettings,
        ...userData,
      };

      // Log current settings
      console.log(
        '[Genesys Debug] Updated chatSettings with user data:',
        window.chatSettings,
      );

      // Check for required fields
      const requiredFields = [
        'clickToChatEndpoint',
        'chatTokenEndpoint',
        'opsPhone',
        'opsPhoneHours',
      ];

      const missingFields = requiredFields.filter(
        (key) =>
          !window.chatSettings ||
          !window.chatSettings[key] ||
          window.chatSettings[key] === '',
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

    // Setup openGenesysChat helper function
    window.openGenesysChat = () => {
      if (window.CXBus && typeof window.CXBus.command === 'function') {
        try {
          window.CXBus.command('WebChat.open');
        } catch (e) {
          console.error('[LegacyChatWrapper] Error opening legacy chat', e);
        }
      }
    };

    // If Genesys is ready, enable the chat button
    if (genesysReady && window._genesys?.widgets?.webchat) {
      console.log('[Genesys Debug] Enabling chat button');
      window._genesys.widgets.webchat.chatButton = {
        enabled: true,
        openDelay: 100,
        effectDuration: 200,
        hideDuringInvite: false,
        template:
          '<div class="cx-widget cx-webchat-chat-button cx-side-button">Chat Now</div>',
      };

      window._genesys.widgets.webchat.position = {
        bottom: { px: 20 },
        right: { px: 20 },
        width: { pct: 50 },
        height: { px: 400 },
      };
    }

    return () => {
      // Only clean up our custom functions, not the scripts
      if (window.openGenesysChat) delete window.openGenesysChat;
    };
  }, [userData, componentId, chatMode, genesysReady]);

  // Effect to enable chat button whenever Genesys becomes ready
  useEffect(() => {
    if (!genesysReady || chatMode !== 'legacy') return;

    console.log(
      '[Genesys Debug] Genesys ready state changed to:',
      genesysReady,
    );

    // Ensure the button is enabled when Genesys is ready
    if (window._genesys?.widgets?.webchat) {
      console.log(
        '[Genesys Debug] Configuring chat button after ready state change',
      );

      window._genesys.widgets.webchat.chatButton = {
        enabled: true,
        openDelay: 100,
        effectDuration: 200,
        hideDuringInvite: false,
        template:
          '<div class="cx-widget cx-webchat-chat-button cx-side-button">Chat Now</div>',
      };

      // Wait a short time and check if the button is in the DOM
      setTimeout(() => {
        const chatButton = document.querySelector('.cx-webchat-chat-button');
        console.log('[Genesys Debug] Chat button in DOM?', !!chatButton);

        if (chatButton) {
          // Type assertion to HTMLElement to safely access style property
          const buttonEl = chatButton as HTMLElement;
          buttonEl.style.display = 'flex';
          buttonEl.style.opacity = '1';
          console.log('[Genesys Debug] Enhanced chat button visibility');
        }
      }, 500);
    }
  }, [genesysReady, chatMode]);

  if (chatMode !== 'legacy') {
    return null;
  }

  return (
    <>
      {/* Inject Genesys widget CSS in the head before scripts */}
      <Script
        id="genesys-legacy-css"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '${process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL?.replace(/\.js$/, '.css') || ''}';
            document.head.appendChild(link);`,
        }}
      />
      {/* Load legacy click_to_chat.js with afterInteractive strategy */}
      <Script
        src={process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('[Legacy] click_to_chat.js loaded');
          if (typeof window.initializeChatWidget === 'function') {
            window.initializeChatWidget(window.jQuery, window.chatSettings);
          } else {
            console.error('[Legacy] initializeChatWidget not found');
          }
        }}
      />
    </>
  );
}
