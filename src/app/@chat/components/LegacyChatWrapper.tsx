'use client';
console.log('[Genesys] 💥 Legacy wrapper mounted');
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

  useEffect(() => {
    if (typeof window !== 'undefined' && window.chatSettings) {
      console.log('[Chat] bootstrapUrl:', window.chatSettings.bootstrapUrl);
      console.log('[Chat] widgetUrl:   ', window.chatSettings.widgetUrl);
      console.log('[Chat] clickToChatJs:', window.chatSettings.clickToChatJs);
      console.log(
        '[Chat] clickToChatEndpoint:',
        window.chatSettings.clickToChatEndpoint,
      );
      console.log(
        '[Chat] chatTokenEndpoint:',
        window.chatSettings.chatTokenEndpoint,
      );
      console.log(
        '[Chat] coBrowseEndpoint:',
        window.chatSettings.coBrowseEndpoint,
      );
    }
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
    console.log('[LegacyChatWrapper] useEffect (env+userData) running. userData:', userData);
    console.log('[LegacyChatWrapper] process.env:', {
      NEXT_PUBLIC_LEGACY_CHAT_SCRIPT_URL: process.env.NEXT_PUBLIC_LEGACY_CHAT_SCRIPT_URL,
      NEXT_PUBLIC_GENESYS_WIDGET_URL: process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL,
      NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS: process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS,
      NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT: process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT,
      NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT: process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT,
      NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT: process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT,
      NEXT_PUBLIC_OPS_PHONE: process.env.NEXT_PUBLIC_OPS_PHONE,
      NEXT_PUBLIC_OPS_HOURS: process.env.NEXT_PUBLIC_OPS_HOURS,
    });
    if (!settingsInjected) {
      window.chatSettings = {
        bootstrapUrl: process.env.NEXT_PUBLIC_LEGACY_CHAT_SCRIPT_URL!,
        widgetUrl: process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL!,
        clickToChatJs: process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS!,
        clickToChatEndpoint: process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT!,
        chatTokenEndpoint: process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT!,
        coBrowseEndpoint: process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT!,
        opsPhone: process.env.NEXT_PUBLIC_OPS_PHONE!,
        opsPhoneHours: process.env.NEXT_PUBLIC_OPS_HOURS!,
      };
      // Log all config values to catch [object Object] issues
      Object.entries(window.chatSettings).forEach(([key, value]) => {
        if (typeof value === 'object') {
          console.error(`[LegacyChatWrapper] Config key '${key}' is an object:`, value);
        } else {
          console.debug(`[LegacyChatWrapper] Config key '${key}':`, value);
        }
      });
      console.log('[Legacy] chatSettings injected', window.chatSettings);
      setSettingsInjected(true);
    }
  }, [settingsInjected]);

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

  return settingsInjected &&
    typeof window !== 'undefined' &&
    window.chatSettings ? (
    <>
      {/* ensure CSS link is actually in head */}
      <Script
        id="genesys-legacy-css"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (!document.querySelector('link[href="${(window.chatSettings as any)?.widgetUrl?.replace(/\.js$/, '.css') ?? ''}"]')) {
              var l = document.createElement('link');
              l.rel = 'stylesheet';
              l.href = "${(window.chatSettings as any)?.widgetUrl?.replace(/\.js$/, '.css') ?? ''}";
              document.head.appendChild(l);
            }
          `,
        }}
      />
      <Script
        id="legacy-chat-js"
        src={process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS!}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('[LegacyChatWrapper] About to inject legacy chat script. src:', process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS!);
          console.log(
            '[Legacy] click_to_chat.js loaded from',
            process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS,
          );
          if (typeof (window as any).initializeChatWidget === 'function') {
            (window as any).initializeChatWidget(
              (window as any).jQuery,
              window.chatSettings,
            );
          } else {
            console.error('[Legacy] initializeChatWidget not found on window');
          }
        }}
        onError={(e: any) => {
          console.error('[Legacy] failed to load click_to_chat.js', e);
        }}
      />
    </>
  ) : null;
}
