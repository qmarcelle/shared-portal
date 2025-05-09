'use client';

import Script from 'next/script';
import { useCallback, useEffect, useState } from 'react';
import { useChatStore } from '../stores/chatStore';

declare global {
  interface Window {
    __genesysInitialized?: boolean;
  }
}

/**
 * Props for the GenesysScript component
 */
interface GenesysScriptProps {
  environment?: string;
  deploymentId: string;
  orgId?: string;
  userData?: Record<string, string | number>;
  onScriptLoaded?: () => void;
}

/**
 * GenesysScript component loads the Genesys Cloud Messenger widget
 * and configures it with the provided parameters.
 */
export function GenesysScript({
  environment = process.env.NEXT_PUBLIC_GENESYS_REGION!,
  deploymentId = process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID!,
  orgId = process.env.NEXT_PUBLIC_GENESYS_ORG_ID!,
  userData = {},
  onScriptLoaded,
}: GenesysScriptProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Get values from the chat store
  const opsPhoneHours = useChatStore((state) => state.businessHoursText);
  const opsPhone = process.env.NEXT_PUBLIC_OPS_PHONE || '1-800-000-0000';
  const _chatGroup = useChatStore((state) => state.chatGroup);
  const _isEligible = useChatStore((state) => state.isEligible);
  const chatMode = useChatStore((state) => state.chatMode);
  const _routingInteractionId = useChatStore(
    (state) => state.routingInteractionId,
  );
  const _userData = useChatStore((state) => state.userData);
  const _config = useChatStore((state) => state.config);
  const token = useChatStore((state) => state.token);

  // Debug: Log chatMode on every render
  useEffect(() => {
    console.log('[GenesysScript] Render - chatMode:', chatMode);
  }, [chatMode]);

  // Set window.chatSettings when any relevant value changes
  useEffect(() => {
    console.log(
      '[GenesysScript] useEffect (chatSettings) - chatMode:',
      chatMode,
    );
    if (chatMode === 'legacy' && typeof window !== 'undefined') {
      window.chatSettings = {
        clickToChatEndpoint: process.env.NEXT_PUBLIC_LEGACY_CHAT_URL || '',
        clickToChatToken: token || '',
        coBrowseLicence: process.env.NEXT_PUBLIC_COBROWSE_LICENSE || '',
        opsPhone: opsPhone,
        opsPhoneHours: opsPhoneHours,
        // Add any other required fields from the store here
      };
      console.log(
        '[Genesys] chatSettings injected for legacy:',
        window.chatSettings,
      );
    }
  }, [chatMode, token, opsPhone, opsPhoneHours]);

  // Handle script loaded event
  const handleScriptLoaded = useCallback(() => {
    setIsLoaded(true);
    if (onScriptLoaded) onScriptLoaded();
    console.log('[Genesys] script loaded successfully');

    // Initialize the chat button configuration
    setTimeout(() => {
      if (window._genesys && window._genesys.widgets) {
        console.log('[Genesys] Configuring chat button');
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
        if (window.CXBus && typeof window.CXBus.registerPlugin === 'function') {
          console.log('[Genesys] Registering chat commands with CXBus');
          window.CXBus.registerPlugin('ChatButton', {
            open: function () {
              console.log('[Genesys] Opening chat via CXBus command');
              if (window.CXBus && typeof window.CXBus.command === 'function') {
                window.CXBus.command('WebChat.open');
              }
            },
          });
        }
        setTimeout(() => {
          const chatButton = document.querySelector('.cx-webchat-chat-button');
          console.log('[Genesys] attempting to open chat button', chatButton);
          if (chatButton) {
            console.log('[Genesys] Enhanced chat button visibility');
          } else {
            console.log('[Genesys] Chat button not found in DOM');
          }
        }, 500);
      } else {
        console.log(
          '[Genesys] _genesys.widgets not available after script load',
        );
      }
    }, 1000);
  }, [onScriptLoaded]);

  // Handle Genesys initialization and cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.__genesysInitialized) {
      console.log('[Genesys] Initialization skipped: already initialized');
      return;
    }
    window.__genesysInitialized = true;
    console.log('[Genesys] Initialization started');

    // Check if Genesys is already loaded
    if (window.Genesys) {
      setIsLoaded(true);
      if (onScriptLoaded) onScriptLoaded();
      console.log('[Genesys] Genesys object already present');
    }

    // Create global function for manual triggering
    window.openGenesysChat = function () {
      console.log('[Genesys] Manual chat open requested');
      if (window.CXBus && typeof window.CXBus.command === 'function') {
        console.log('[Genesys] Opening chat via CXBus.command("WebChat.open")');
        window.CXBus.command('WebChat.open');
      } else if (
        window._genesys &&
        window._genesys.widgets &&
        window._genesys.widgets.webchat
      ) {
        console.log(
          '[Genesys] Opening chat via _genesys.widgets.webchat.open()',
        );
        window._genesys.widgets.webchat.open();
      } else {
        console.error('[Genesys] CXBus not available for manual triggering');
      }
    };

    const setupCustomData = () => {
      if (window.Genesys && Object.keys(userData).length > 0) {
        try {
          window.Genesys('command', 'Messenger.updateCustomAttributes', {
            customAttributes: userData,
          });
          console.log('[Genesys] custom attributes pushed:', userData);
        } catch (e) {
          console.error('[Genesys] Error updating custom attributes:', e);
        }
      }
    };

    const handleMessengerReady = () => {
      handleScriptLoaded();
      setupCustomData();
    };

    window.addEventListener('Genesys::Ready', handleMessengerReady);

    setTimeout(() => {
      console.log(
        '[Genesys] chat-button found?',
        document.querySelector('.cx-webchat-chat-button'),
      );
    }, 500);

    return () => {
      window.removeEventListener('Genesys::Ready', handleMessengerReady);
      if (window.Genesys) {
        try {
          window.Genesys('command', 'Messenger.close');
        } catch (e) {
          console.error('[Genesys] Error closing Genesys messenger:', e);
        }
      }
    };
  }, [userData, handleScriptLoaded, onScriptLoaded]);

  // Debug: Log which script block will render
  if (chatMode === 'cloud') {
    console.log('[GenesysScript] Rendering cloud script');
  }
  if (chatMode === 'legacy') {
    console.log('[GenesysScript] Rendering legacy scripts');
  }

  return (
    <>
      {/* Cloud Messenger mode: only load Genesys Cloud script */}
      {chatMode === 'cloud' && (
        <Script
          id="genesys-bootstrap"
          strategy="afterInteractive"
          onLoad={() => {
            console.log('[Genesys] script tag loaded');
          }}
          onError={(e) => {
            console.error('[Genesys] script failed to load', e);
          }}
          dangerouslySetInnerHTML={{
            __html: `
              (function(g,e,n,es,ys){g['_genesysJs']=e;g[e]=g[e]||function(){(g[e].q=g[e].q||[]).push(arguments)};g[e].t=1*new Date();g[e].c=es;ys=document.createElement('script');ys.async=1;ys.src=n;ys.charset='utf-8';document.head.appendChild(ys);
              })(window,'Genesys','https://apps.${environment}.pure.cloud/genesys-bootstrap/genesys.min.js',{
                environment:'${environment}',
                deploymentId:'${deploymentId}',
                orgId:'${orgId}'
              });
            `,
          }}
        />
      )}
      {/* Legacy mode: only load legacy widget scripts after chatSettings is injected */}
      {chatMode === 'legacy' && (
        <>
          <Script
            src="/assets/genesys/plugins/widgets.min.js"
            strategy="beforeInteractive"
            onLoad={() => console.log('[Genesys] loaded widgets.min.js')}
          />
          <Script
            src="/assets/genesys/click_to_chat.js"
            strategy="afterInteractive"
            onLoad={() => console.log('[Genesys] loaded click_to_chat.js')}
          />
        </>
      )}
      {!isLoaded && <div id="genesys-loading-indicator" aria-hidden="true" />}
    </>
  );
}
