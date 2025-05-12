import Script from 'next/script';
import { useCallback, useEffect } from 'react';
import { chatSelectors, useChatStore } from '../chat/stores/chatStore';
import { ScriptLoadPhase } from '../chat/types';
import { openGenesysChat } from '../chat/utils/chatUtils';

interface GenesysScriptProps {
  environment?: string;
  deploymentId: string;
  orgId?: string;
  onScriptLoaded?: () => void;
}

export function GenesysScript({
  environment = process.env.NEXT_PUBLIC_GENESYS_REGION!,
  deploymentId = process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID!,
  orgId = process.env.NEXT_PUBLIC_GENESYS_ORG_ID!,
  onScriptLoaded,
}: GenesysScriptProps) {
  // Get values from the chat store
  const chatMode = chatSelectors.chatMode(useChatStore());
  const chatSettings = useChatStore((state) => state.chatSettings);
  const token = useChatStore((state) => state.token);
  const scriptLoadPhase = useChatStore((state) => state.scriptLoadPhase);
  const setScriptLoadPhase = useChatStore((state) => state.setScriptLoadPhase);

  // Install open function in window for backward compatibility
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Use the centralized utility function
    window.openGenesysChat = openGenesysChat;

    return () => {
      // Clean up global function on unmount
      if (window.openGenesysChat) {
        delete window.openGenesysChat;
      }
    };
  }, []);

  // Handle script loaded event
  const handleScriptLoaded = useCallback(() => {
    setScriptLoadPhase(ScriptLoadPhase.LOADED);
    if (onScriptLoaded) onScriptLoaded();
    console.log('[Genesys] script loaded successfully');

    // Initialize the chat button configuration for legacy mode
    if (chatMode === 'legacy') {
      setTimeout(() => {
        if (window._genesys && window._genesys.widgets) {
          // Configure button appearance and positioning
          if (!window._genesys.widgets.webchat) {
            window._genesys.widgets.webchat = {};
          }

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

          // Register with CXBus if available
          if (
            window.CXBus &&
            typeof window.CXBus.registerPlugin === 'function'
          ) {
            window.CXBus.registerPlugin('ChatButton', {
              open: function () {
                if (
                  window.CXBus &&
                  typeof window.CXBus.command === 'function'
                ) {
                  window.CXBus.command('WebChat.open');
                }
              },
            });
          }
        }
      }, 1000);
    }
  }, [onScriptLoaded, chatMode, setScriptLoadPhase]);

  // Register Genesys global functions and cleanup
  useEffect(() => {
    if (typeof window === 'undefined' || !chatSettings) return;

    // Signal the script is loading
    setScriptLoadPhase(ScriptLoadPhase.LOADING);

    // For cloud mode: set up event listeners
    if (chatMode === 'cloud') {
      const setupCustomData = () => {
        if (window.Genesys && chatSettings) {
          try {
            // Extract userData from chatSettings
            const customAttributes = Object.entries(chatSettings)
              .filter(
                ([key]) =>
                  key !== 'widgetUrl' &&
                  key !== 'bootstrapUrl' &&
                  key !== 'clickToChatJs' &&
                  key !== 'clickToChatEndpoint' &&
                  key !== 'chatTokenEndpoint' &&
                  key !== 'coBrowseEndpoint',
              )
              .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

            window.Genesys('command', 'Messenger.updateCustomAttributes', {
              customAttributes,
            });
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
    }
  }, [chatSettings, handleScriptLoaded, chatMode, setScriptLoadPhase]);

  // Only render scripts when we have chat settings available
  if (!chatSettings) return null;

  // Conditionally render the appropriate script based on chat mode
  return chatMode === 'cloud' ? (
    <Script
      id="genesys-cloud-messenger"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(g,e,n,es,ys){
            g['_genesysJs']=e;
            g[e]=g[e]||function(){
              (g[e].q=g[e].q||[]).push(arguments)
            };
            g[e].t=1*new Date();
            g[e].c=es;
            ys=document.createElement('script');
            ys.async=1;
            ys.src=n;
            ys.charset='utf-8';
            document.head.appendChild(ys);
          })(window, 'Genesys', 'https://apps.${environment}/genesys-bootstrap/genesys.min.js', {
            environment: '${environment}',
            deploymentId: '${deploymentId}',
            debug: true,
          });
        `,
      }}
      onLoad={handleScriptLoaded}
    />
  ) : (
    <Script
      id="genesys-legacy-chat"
      strategy="afterInteractive"
      src={process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL || ''}
      onLoad={handleScriptLoaded}
    />
  );
}
