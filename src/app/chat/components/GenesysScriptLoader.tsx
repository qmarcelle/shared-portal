'use client';

/**
 * GenesysScriptLoader Component
 *
 * A dedicated component solely for handling Genesys script loading
 * with a clear visual indicator and error reporting.
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'; // Import React

interface GenesysScriptLoaderProps {
  scriptUrl?: string;
  cssUrls?: string[];
}

const GenesysScriptLoader: React.FC<GenesysScriptLoaderProps> = React.memo(
  ({
    scriptUrl = '/assets/genesys/click_to_chat.js',
    cssUrls = [
      '/assets/genesys/plugins/widgets.min.css',
      '/assets/genesys/styles/bcbst-custom.css',
    ],
  }) => {
    const [status, setStatus] = useState<
      'idle' | 'loading' | 'loaded' | 'error'
    >('idle');
    const [error, setError] = useState<string | null>(null);
    const initialized = useRef(false);

    // Memoize cssUrls to prevent unnecessary re-renders if parent re-renders
    const stableCssUrls = useMemo(() => cssUrls, [cssUrls]);

    // Use useCallback for the loadScript function to memoize it
    const loadScript = useCallback(async () => {
      if (initialized.current) {
        console.log('GenesysScriptLoader: Already initialized, skipping');
        return;
      }
      initialized.current = true;

      try {
        setStatus('loading');
        console.log('GenesysScriptLoader: Starting load sequence');

        // 1. Load CSS files first
        for (const cssUrl of stableCssUrls) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = cssUrl;

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
          isCobrowseActive: 'false',
          coBrowseLicence: '',
          cobrowseSource: '',
          cobrowseURL: '',
        };
        console.log(
          'GenesysScriptLoader: Set window.chatSettings',
          (window as any).chatSettings,
        );

        (window as any).startCoBrowseCall = () => {
          console.log('GenesysScriptLoader: Cobrowse disabled');
          return false;
        };
        (window as any).showCobrowseModal = () => {
          console.log('GenesysScriptLoader: Cobrowse modal disabled');
          return false;
        };

        // 3. Add the script with cache busting
        const timestamp = new Date().getTime();
        const scriptUrlWithTimestamp = `${scriptUrl}?t=${timestamp}`;

        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = scriptUrlWithTimestamp;
          script.async = false;
          script.id = 'genesys-chat-script';

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

          const existingScript = document.getElementById('genesys-chat-script');
          if (existingScript) {
            console.log('GenesysScriptLoader: Removing existing script');
            existingScript.remove();
          }

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
              '_forceChatButtonCreate not found, attempting event dispatch',
            );
            // Also try event dispatch
            console.log(
              'GenesysScriptLoader: Dispatching genesys:create-button event',
            );
            document.dispatchEvent(new CustomEvent('genesys:create-button'));
          }

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
            const existingBackupButton = document.querySelector(
              '.genesys-custom-chat-button',
            );
            if (existingBackupButton) {
              existingBackupButton.remove();
            }

            const existingButton = document.querySelector(
              '.cx-widget.cx-webchat-chat-button',
            );
            if (!existingButton) {
              console.log(
                'GenesysScriptLoader: Creating last-resort backup button',
              );
              const backupButton = document.createElement('div');
              backupButton.className = 'genesys-custom-chat-button';
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
    }, [stableCssUrls, scriptUrl]); // Dependencies for useCallback

    useEffect(() => {
      // Add CSS to fix Genesys overlay issues
      const fixOverlayStyle = document.createElement('style');
      fixOverlayStyle.textContent = `
        /* Ensure Genesys elements are visible with proper z-index */
        .cx-widget.cx-webchat-chat-button {
          z-index: 9999 !important;
          display: flex !important;
          position: fixed !important;
          right: 20px !important;
          bottom: 20px !important;
        }

        /* Ensure our custom button is always visible as fallback */
        .genesys-custom-chat-button {
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          background: #0078d4 !important;
          color: white !important;
          padding: 12px 20px !important;
          border-radius: 5px !important;
          z-index: 9998 !important; /* Just below Genesys elements */
          cursor: pointer !important;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3) !important;
          font-family: sans-serif !important;
        }
      `;
      document.head.appendChild(fixOverlayStyle);

      loadScript();

      return () => {
        console.log('GenesysScriptLoader: Component unmounting');
        // We do NOT set initialized.current = false here to prevent reinitialization
      };
    }, [loadScript]); // loadScript is the dependency

    return (
      <div
        style={{
          position: 'fixed',
          bottom: '60px',
          left: '10px',
          zIndex: 9999,
        }}
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
  },
);

GenesysScriptLoader.displayName = 'GenesysScriptLoader'; // Set the display name

export default GenesysScriptLoader;
