'use client';

/**
 * GenesysScriptLoader Component
 *
 * A dedicated component solely for handling Genesys script loading
 * with a clear visual indicator and error reporting.
 */

import { useEffect, useState } from 'react';

interface GenesysScriptLoaderProps {
  scriptUrl?: string;
  cssUrls?: string[];
}

export default function GenesysScriptLoader({
  scriptUrl = '/assets/genesys/click_to_chat.js',
  cssUrls = [
    '/assets/genesys/plugins/widgets.min.css',
    '/assets/genesys/styles/bcbst-custom.css',
  ],
}: GenesysScriptLoaderProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>(
    'idle',
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadScript = async () => {
      try {
        setStatus('loading');
        console.log('GenesysScriptLoader: Starting load sequence');

        // 1. Load CSS files first
        for (const cssUrl of cssUrls) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = cssUrl;

          // Wait for CSS to load
          await new Promise<void>((resolve, reject) => {
            link.onload = () => {
              console.log(`GenesysScriptLoader: Loaded CSS: ${cssUrl}`);
              resolve();
            };
            link.onerror = () => {
              console.error(
                `GenesysScriptLoader: Failed to load CSS: ${cssUrl}`,
              );
              reject(new Error(`Failed to load CSS: ${cssUrl}`));
            };
            document.head.appendChild(link);
          });
        }

        // 2. Set minimal chat configuration
        (window as any).chatSettings = {
          clickToChatToken: 'test-token',
          clickToChatEndpoint: 'https://example.com/chat',
          routingchatbotEligible: 'true',
          isChatEligibleMember: 'true',
          chatMode: 'legacy',
          genesysWidgetUrl: '/assets/genesys/plugins/widgets.min.js',
          isChatAvailable: 'true',
        };
        console.log(
          'GenesysScriptLoader: Set window.chatSettings',
          (window as any).chatSettings,
        );

        // 3. Add the script with cache busting
        const timestamp = new Date().getTime();
        const scriptUrlWithTimestamp = `${scriptUrl}?t=${timestamp}`;

        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = scriptUrlWithTimestamp;
          script.async = false;

          script.onload = () => {
            console.log(
              `GenesysScriptLoader: Script loaded successfully: ${scriptUrlWithTimestamp}`,
            );
            resolve();
          };

          script.onerror = (e) => {
            console.error(
              `GenesysScriptLoader: Script failed to load: ${scriptUrlWithTimestamp}`,
              e,
            );
            reject(
              new Error(`Script failed to load: ${scriptUrlWithTimestamp}`),
            );
          };

          document.body.appendChild(script);
          console.log(
            `GenesysScriptLoader: Added script to body: ${scriptUrlWithTimestamp}`,
          );
        });

        // 4. Initialize the chat button after script loads
        setTimeout(() => {
          if ((window as any)._forceChatButtonCreate) {
            console.log(
              'GenesysScriptLoader: Calling _forceChatButtonCreate()',
            );
            (window as any)._forceChatButtonCreate();
          } else {
            console.log(
              'GenesysScriptLoader: _forceChatButtonCreate not found',
            );
          }

          // Also try event dispatch
          console.log(
            'GenesysScriptLoader: Dispatching genesys:create-button event',
          );
          document.dispatchEvent(new CustomEvent('genesys:create-button'));

          // Check if widgets.min.js loaded
          console.log(
            'GenesysScriptLoader: Checking if widgets.min.js loaded',
            {
              CXBus: !!(window as any).CXBus,
              _genesys: !!(window as any)._genesys,
              _gt: !!(window as any)._gt,
            },
          );

          // Create a guaranteed backup button if all else fails
          setTimeout(() => {
            const existingButton = document.querySelector(
              '.cx-widget.cx-webchat-chat-button',
            );
            if (!existingButton) {
              console.log(
                'GenesysScriptLoader: Creating last-resort backup button',
              );
              const backupButton = document.createElement('div');
              backupButton.style.cssText =
                'position:fixed;bottom:20px;right:20px;background:#0078d4;color:white;padding:12px 20px;border-radius:5px;z-index:9999;cursor:pointer;box-shadow:0 2px 5px rgba(0,0,0,0.3);font-family:sans-serif;';
              backupButton.textContent = 'Chat with Us';
              backupButton.onclick = () => {
                try {
                  if ((window as any).CXBus && (window as any).CXBus.command) {
                    (window as any).CXBus.command('WebChat.open');
                  } else if (
                    (window as any)._genesys &&
                    (window as any)._genesys.widgets
                  ) {
                    console.log('Attempting to open chat via _genesys.widgets');
                    // Try multiple approaches
                    if ((window as any)._genesys.widgets.webchat?.open) {
                      (window as any)._genesys.widgets.webchat.open();
                    } else if (
                      (window as any)._genesys.widgets.main?.startChat
                    ) {
                      (window as any)._genesys.widgets.main.startChat();
                    } else {
                      alert(
                        'Chat service is initializing. Please try again in a moment.',
                      );
                    }
                  } else {
                    alert(
                      'Chat service is currently unavailable. Please try again later.',
                    );
                  }
                } catch (err) {
                  console.error('Error opening chat:', err);
                }
              };
              document.body.appendChild(backupButton);
            }
          }, 3000);
        }, 1000);

        setStatus('loaded');
      } catch (err) {
        console.error('GenesysScriptLoader: Error loading resources', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    loadScript();

    // Cleanup function
    return () => {
      console.log('GenesysScriptLoader: Component unmounting');
    };
  }, [scriptUrl, cssUrls]);

  // Render a status indicator
  return (
    <div
      style={{ position: 'fixed', bottom: '10px', left: '10px', zIndex: 9999 }}
    >
      <div
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          fontFamily: 'sans-serif',
          backgroundColor:
            status === 'loaded'
              ? '#10b981'
              : status === 'loading'
                ? '#f59e0b'
                : status === 'error'
                  ? '#ef4444'
                  : '#6b7280',
          color: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        {status === 'idle' && 'Script Ready to Load'}
        {status === 'loading' && 'Loading Genesys Script...'}
        {status === 'loaded' && 'Genesys Script Loaded ✓'}
        {status === 'error' && `Error: ${error?.slice(0, 50)}`}
      </div>
    </div>
  );
}
