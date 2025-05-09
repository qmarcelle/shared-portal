import Script from 'next/script';
import { useCallback, useEffect, useState } from 'react';
import { useChatStore } from '../@chat/stores/chatStore';

interface GenesysScriptProps {
  environment?: string;
  deploymentId: string;
  orgId?: string;
  userData?: Record<string, string | number>;
  onScriptLoaded?: () => void;
}

export function GenesysScript({
  environment = process.env.NEXT_PUBLIC_GENESYS_REGION!,
  deploymentId = process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID!,
  orgId = process.env.NEXT_PUBLIC_GENESYS_ORG_ID!,
  userData = {},
  onScriptLoaded,
}: GenesysScriptProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [localToken, setLocalToken] = useState<string | undefined>(undefined);

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

  // Fetch token if needed (only for legacy mode)
  useEffect(() => {
    async function fetchTokenIfNeeded() {
      if (chatMode === 'legacy' && !token) {
        try {
          const res = await fetch('/api/chat/token');
          const data = await res.json();
          setLocalToken(data.token || '');
          console.log(
            '[GenesysScript] Token fetched via /api/chat/token:',
            data.token,
          );
        } catch (error) {
          console.error('[GenesysScript] Error fetching token:', error);
        }
      }
    }
    fetchTokenIfNeeded();
  }, [chatMode, token]);

  // Initialize window.chatSettings before script loading
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize chatSettings for legacy mode
    if (chatMode === 'legacy') {
      window.chatSettings = {
        clickToChatEndpoint: process.env.NEXT_PUBLIC_LEGACY_CHAT_URL || '',
        clickToChatToken: token || localToken || '',
        opsPhone: opsPhone,
        opsPhoneHours: opsPhoneHours,
        // Add any other required fields from the store here
      };
      console.log(
        '[Genesys] chatSettings injected for legacy:',
        window.chatSettings,
      );
    }
  }, [chatMode, token, localToken, opsPhone, opsPhoneHours]);

  // Handle script loaded event
  const handleScriptLoaded = useCallback(() => {
    setIsLoaded(true);
    if (onScriptLoaded) onScriptLoaded();
    console.log('[Genesys] script loaded successfully');

    // Initialize the chat button configuration for legacy mode
    if (chatMode === 'legacy') {
      setTimeout(() => {
        if (window._genesys && window._genesys.widgets) {
          // Ensure webchat object exists
          if (!window._genesys.widgets.webchat) {
            console.log('[Genesys] Creating webchat object');
            window._genesys.widgets.webchat = {};
          }

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
          if (
            window.CXBus &&
            typeof window.CXBus.registerPlugin === 'function'
          ) {
            console.log('[Genesys] Registering chat commands with CXBus');
            window.CXBus.registerPlugin('ChatButton', {
              open: function () {
                console.log('[Genesys] Opening chat via CXBus command');
                if (
                  window.CXBus &&
                  typeof window.CXBus.command === 'function'
                ) {
                  window.CXBus.command('WebChat.open');
                }
              },
            });
          }
          setTimeout(() => {
            const chatButton = document.querySelector(
              '.cx-webchat-chat-button',
            );
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
    }
  }, [onScriptLoaded, chatMode]);

  // Register Genesys global functions and cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Create global function for manual triggering
    window.openGenesysChat = function () {
      console.log('[Genesys] Manual chat open requested');
      if (chatMode === 'legacy') {
        if (window.CXBus && typeof window.CXBus.command === 'function') {
          console.log(
            '[Genesys] Opening chat via CXBus.command("WebChat.open")',
          );
          window.CXBus.command('WebChat.open');
        } else if (window._genesys && window._genesys.widgets) {
          // Ensure webchat object exists
          if (!window._genesys.widgets.webchat) {
            console.log('[Genesys] Creating webchat object for manual open');
            window._genesys.widgets.webchat = {
              open: function () {
                console.log('[Genesys] Fallback open method called');
                if (
                  window.CXBus &&
                  typeof window.CXBus.command === 'function'
                ) {
                  window.CXBus.command('WebChat.open');
                }
              },
            };
          }

          if (typeof window._genesys.widgets.webchat.open === 'function') {
            console.log(
              '[Genesys] Opening chat via _genesys.widgets.webchat.open()',
            );
            window._genesys.widgets.webchat.open();
          } else {
            console.error('[Genesys] webchat.open is not a function');
          }
        } else {
          console.error('[Genesys] CXBus not available for manual triggering');
        }
      } else if (chatMode === 'cloud' && window.Genesys) {
        try {
          window.Genesys('command', 'Messenger.open');
          console.log('[Genesys] Opening chat via Genesys Cloud Messenger');
        } catch (e) {
          console.error('[Genesys] Error opening Genesys Cloud Messenger:', e);
        }
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

    // Only add event listener for Cloud mode
    if (chatMode === 'cloud') {
      window.addEventListener('Genesys::Ready', handleMessengerReady);
    }

    return () => {
      window.removeEventListener('Genesys::Ready', handleMessengerReady);
      if (chatMode === 'cloud' && window.Genesys) {
        try {
          window.Genesys('command', 'Messenger.close');
        } catch (e) {
          console.error('[Genesys] Error closing Genesys messenger:', e);
        }
      }
    };
  }, [userData, handleScriptLoaded, chatMode]);

  // Runtime assertion: warn if the wrong Genesys global is present for the current mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (chatMode === 'cloud' && typeof window._genesys !== 'undefined') {
        console.warn(
          '[GenesysScript] WARNING: window._genesys is present in cloud mode. This may indicate a script loading/config issue.',
        );
      }
      if (chatMode === 'legacy' && typeof window.Genesys !== 'undefined') {
        console.warn(
          '[GenesysScript] WARNING: window.Genesys is present in legacy mode. This may indicate a script loading/config issue.',
        );
      }
    }
  }, [chatMode]);

  return (
    <>
      {/* Cloud Messenger mode: only load Genesys Cloud script */}
      {chatMode === 'cloud' && (
        <Script
          id="genesys-bootstrap"
          strategy="afterInteractive"
          onLoad={() => {
            console.log('[Genesys] Cloud script tag loaded');
            handleScriptLoaded();
          }}
          onError={(e) => {
            console.error('[Genesys] Cloud script failed to load', e);
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
            id="genesys-widgets-script"
            src="/assets/genesys/plugins/widgets.min.js"
            strategy="beforeInteractive"
            onLoad={() => console.log('[Genesys] Loaded widgets.min.js')}
          />
          <Script
            id="genesys-clicktochat-script"
            src="/assets/genesys/click_to_chat.js"
            strategy="afterInteractive"
            onLoad={() => {
              console.log('[Genesys] Loaded click_to_chat.js');
              handleScriptLoaded();
            }}
          />
        </>
      )}
      {!isLoaded && <div id="genesys-loading-indicator" aria-hidden="true" />}
    </>
  );
}
