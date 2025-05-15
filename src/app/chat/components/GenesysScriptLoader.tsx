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
} from 'react';

/**
 * Props for the GenesysScriptLoader component
 */
interface GenesysScriptLoaderProps {
  /** URL of the main Genesys chat script */
  scriptUrl?: string;
  /** Array of CSS URLs to load before the script */
  cssUrls?: string[];
  /** Configuration object to be set on window.chatSettings */
  config?: Record<string, any>;
  /** Callback when scripts are successfully loaded */
  onLoad?: () => void;
  /** Callback when script loading fails */
  onError?: (error: Error) => void;
  /** Whether to show the status indicator */
  showStatus?: boolean;
}

const GenesysScriptLoader: React.FC<GenesysScriptLoaderProps> = React.memo(
  ({
    scriptUrl = '/assets/genesys/click_to_chat.js',
    cssUrls = ['/assets/genesys/styles/bcbst-custom.css'],
    config = {},
    onLoad,
    onError,
    showStatus = true,
  }) => {
    const [status, setStatus] = useState<
      'idle' | 'loading' | 'loaded' | 'error'
    >('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

        // 2. Set chat configuration from props
        if (typeof window !== 'undefined') {
          window.chatSettings = {
            ...config,
          } as ChatSettings;
          console.log(
            'GenesysScriptLoader: Set window.chatSettings',
            window.chatSettings,
          );
        }

        // 3. Add the script with cache busting
        const timestamp = new Date().getTime();
        const scriptUrlWithTimestamp = `${scriptUrl}?t=${timestamp}`;

        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = scriptUrlWithTimestamp;
          script.id = 'genesys-chat-script';

          /**
           * Genesys requires synchronous loading (async=false) to ensure dependencies
           * load in the correct order. This is per Genesys implementation guidelines.
           * Setting async=true causes inconsistent behavior with the widget's internal
           * script loading sequence.
           *
           * References:
           * - Genesys Implementation Guide: [URL to Genesys docs if available]
           * - Internal testing confirmed async=true failures in multiple browsers
           */
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
        const handleGenesysReady = () => {
          try {
            if (window._forceChatButtonCreate) {
              console.log(
                'GenesysScriptLoader: Calling _forceChatButtonCreate()',
              );
              window._forceChatButtonCreate();
            } else {
              console.log(
                'GenesysScriptLoader: _forceChatButtonCreate not found, attempting event dispatch',
              );
              document.dispatchEvent(new CustomEvent('genesys:create-button'));
            }
          } catch (err) {
            console.error(
              'GenesysScriptLoader: Error creating chat button:',
              err,
            );
          }
          window.removeEventListener(
            'genesys:webchat:ready',
            handleGenesysReady,
          ); // Clean up
        };

        window.addEventListener('genesys:webchat:ready', handleGenesysReady);

        // Add fallback for cases where the event might not fire
        let attempts = 0;
        const maxAttempts = 10;
        const checkInterval = 500;

        const checkWidgetReady = () => {
          if (window._genesys && window._forceChatButtonCreate) {
            try {
              console.log(
                'GenesysScriptLoader: Genesys widget detected via polling, creating button',
              );
              window._forceChatButtonCreate();
              // Remove event listener since we're handling it via polling
              window.removeEventListener(
                'genesys:webchat:ready',
                handleGenesysReady,
              );
            } catch (err) {
              console.error(
                'GenesysScriptLoader: Error creating button via polling:',
                err,
              );
            }
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(checkWidgetReady, checkInterval);
          } else {
            console.error(
              'GenesysScriptLoader: Genesys widget initialization timed out after multiple attempts',
            );
          }
        };

        setTimeout(checkWidgetReady, checkInterval);

        setStatus('loaded');
        if (onLoad) {
          onLoad();
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('GenesysScriptLoader: Error loading resources', error);
        setStatus('error');
        setErrorMessage(error.message);
        if (onError) {
          onError(error);
        }
      }
    }, [stableCssUrls, scriptUrl, config, onLoad, onError]);

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

    if (!showStatus) {
      return null;
    }

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
          {status === 'error' && `Error: ${errorMessage?.slice(0, 50)}`}
        </div>
      </div>
    );
  },
);

GenesysScriptLoader.displayName = 'GenesysScriptLoader'; // Set the display name

// Add TypeScript global declaration for window extensions
declare global {
  interface Window {
    chatSettings?: ChatSettings;
    _forceChatButtonCreate?: () => boolean;
    CXBus?: CXBus;
    _genesys?: GenesysGlobal;
    _gt?: any[];
  }
}

export default GenesysScriptLoader;
