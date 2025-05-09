'use client';

import { getAuthToken } from '@/utils/api/getToken';
import Script from 'next/script';
import { useCallback, useEffect, useState } from 'react';

declare global {
  interface Window {
    __genesysInitialized?: boolean;
  }
}

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
// Ensure chatSettings exists and populate token dynamically
(async () => {
  if (typeof window !== 'undefined' && !window.chatSettings) {
    const token = await getAuthToken();
    // Fetch chat info from your API to get workingHours
    let opsPhoneHours = process.env.NEXT_PUBLIC_OPS_HOURS || 'Mon–Fri 8 am–6 pm';
    try {
      const res = await fetch('/api/chat/getChatInfo?memberId=MEMBER_ID&memberType=byMemberCk');
      if (res.ok) {
        const chatInfo = await res.json();
        opsPhoneHours = chatInfo.workingHours || chatInfo.businessHours?.text || opsPhoneHours;
      }
    } catch (e) {
      console.error('Failed to fetch chat info for opsPhoneHours', e);
    }
    window.chatSettings = {
      clickToChatToken: token,
      clickToChatEndpoint:
        process.env.NEXT_PUBLIC_LEGACY_CHAT_URL ||
        'https://example.com/api/chat',
      coBrowseLicence:
        process.env.NEXT_PUBLIC_COBROWSE_LICENCE ||
        'PLACEHOLDER_COBROWSE_LICENSE',
      opsPhone: process.env.NEXT_PUBLIC_OPS_PHONE || '1-800-000-0000',
      opsPhoneHours,
    };
  }
})();

export function GenesysScript({
  environment = process.env.NEXT_PUBLIC_GENESYS_REGION!,
  deploymentId = process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID!,
  orgId = process.env.NEXT_PUBLIC_GENESYS_ORG_ID!,
  userData = {},
  onScriptLoaded,
}: GenesysScriptProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle script loaded event
  const handleScriptLoaded = useCallback(() => {
    setIsLoaded(true);
    if (onScriptLoaded) onScriptLoaded();
    console.log('Genesys script loaded successfully');

    // Initialize the chat button configuration
    setTimeout(() => {
      if (window._genesys && window._genesys.widgets) {
        console.log('Configuring Genesys chat button');
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
          console.log('Registering chat commands with CXBus');
          window.CXBus.registerPlugin('ChatButton', {
            open: function () {
              console.log('Opening chat via CXBus command');
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
          }
        }, 500);
      }
    }, 1000);
  }, [onScriptLoaded]);

  // Handle Genesys initialization and cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.__genesysInitialized) return;
    window.__genesysInitialized = true;

    // Check if Genesys is already loaded
    if (window.Genesys) {
      setIsLoaded(true);
      if (onScriptLoaded) onScriptLoaded();
    }

    // Create global function for manual triggering
    window.openGenesysChat = function () {
      console.log('Manual chat open requested');
      if (window.CXBus && typeof window.CXBus.command === 'function') {
        window.CXBus.command('WebChat.open');
      } else if (
        window._genesys &&
        window._genesys.widgets &&
        window._genesys.widgets.webchat
      ) {
        window._genesys.widgets.webchat.open();
      } else {
        console.error('CXBus not available for manual triggering');
      }
    };

    const setupCustomData = () => {
      if (window.Genesys && Object.keys(userData).length > 0) {
        try {
          window.Genesys('command', 'Messenger.updateCustomAttributes', {
            customAttributes: userData,
          });
          console.log('Genesys custom attributes pushed:', userData);
        } catch (e) {
          console.error('Error updating Genesys custom attributes:', e);
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
        '✅[Genesys] chat-button found?',
        document.querySelector('.cx-webchat-chat-button'),
      );
    }, 500);

    return () => {
      window.removeEventListener('Genesys::Ready', handleMessengerReady);
      if (window.Genesys) {
        try {
          window.Genesys('command', 'Messenger.close');
        } catch (e) {
          console.error('Error closing Genesys messenger:', e);
        }
      }
    };
  }, [userData, handleScriptLoaded, onScriptLoaded]);

  return (
    <>
      <Script
        id="genesys-bootstrap"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Genesys script tag loaded');
        }}
        onError={(e) => {
          console.error('Genesys script failed to load', e);
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
      {!isLoaded && <div id="genesys-loading-indicator" aria-hidden="true" />}
    </>
  );
}
