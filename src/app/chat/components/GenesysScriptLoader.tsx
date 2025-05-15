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
import { ChatSettings, GenesysCXBus } from '../types/chat-types';

/**
 * Props for the GenesysScriptLoader component
 */
interface GenesysScriptLoaderProps {
  /** URL of the main Genesys chat script */
  scriptUrl?: string;
  /** Array of CSS URLs to load before the script */
  cssUrls?: string[];
  /** Configuration object to be set on window.chatSettings */
  config?: Partial<ChatSettings>;
  /** Callback when scripts are successfully loaded */
  onLoad?: () => void;
  /** Callback when script loading fails */
  onError?: (error: Error) => void;
  /** Whether to show the status indicator */
  showStatus?: boolean;
}

/**
 * Adds resource hints to improve connection performance for external resources
 */
const addResourceHints = () => {
  const hints = [
    {
      rel: 'preconnect',
      href: 'https://code.jquery.com',
      crossOrigin: 'anonymous',
    },
    { rel: 'dns-prefetch', href: 'https://code.jquery.com' },
    {
      rel: 'preconnect',
      href: 'https://apps.mypurecloud.com',
      crossOrigin: 'anonymous',
    },
    { rel: 'dns-prefetch', href: 'https://apps.mypurecloud.com' },
    {
      rel: 'preconnect',
      href: 'https://js.cobrowse.io',
      crossOrigin: 'anonymous',
    },
    { rel: 'dns-prefetch', href: 'https://js.cobrowse.io' },
  ];

  // Only add hints if they don't already exist
  hints.forEach((hint) => {
    const existingHint = document.querySelector(
      `link[rel="${hint.rel}"][href="${hint.href}"]`,
    );
    if (!existingHint) {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.crossOrigin) {
        link.crossOrigin = hint.crossOrigin;
      }
      document.head.appendChild(link);
      console.log(
        `[GenesysScriptLoader] Added resource hint: ${hint.rel} for ${hint.href}`,
      );
    }
  });
};

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
    const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Memoize cssUrls to prevent unnecessary re-renders if parent re-renders
    const stableCssUrls = useMemo(() => cssUrls, [cssUrls]);

    /**
     * Checks if Genesys is ready with exponential backoff
     * This reduces CPU usage while still ensuring we detect when scripts are ready
     */
    const checkReadyWithBackoff = useCallback(() => {
      let attempts = 0;
      const maxAttempts = 10;
      let timeout = 100; // Start with 100ms

      // Clear any existing interval
      if (checkIntervalRef.current) {
        clearTimeout(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }

      const checkFn = () => {
        if (window._forceChatButtonCreate || window._genesysCXBus) {
          // Script is ready
          console.log(
            '[GenesysScriptLoader] Widget ready detected via backoff polling',
          );

          try {
            if (window._forceChatButtonCreate) {
              console.log(
                '[GenesysScriptLoader] Calling _forceChatButtonCreate()',
              );
              window._forceChatButtonCreate();
            }
          } catch (err) {
            console.error('[GenesysScriptLoader] Error creating button:', err);
          }

          setStatus('loaded');
          if (onLoad) onLoad();
          return;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          console.error(
            '[GenesysScriptLoader] Failed to detect widget readiness after maximum attempts',
          );
          if (status !== 'error') {
            setStatus('error');
            setErrorMessage('Timeout waiting for chat widget initialization');
            if (onError) onError(new Error('Widget initialization timeout'));
          }
          return;
        }

        // Exponential backoff with max of 2000ms
        timeout = Math.min(timeout * 1.5, 2000);
        console.log(
          `[GenesysScriptLoader] Widget not ready, retrying in ${timeout}ms (attempt ${attempts}/${maxAttempts})`,
        );
        checkIntervalRef.current = setTimeout(checkFn, timeout);
      };

      checkFn();
    }, [onLoad, onError, status]);

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

        // Add resource hints for faster connections
        addResourceHints();

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
          // Use type assertion to any to avoid conflicts with other declarations
          (window as any).chatSettings = {
            ...config,
          };
          console.log(
            'GenesysScriptLoader: Set window.chatSettings',
            (window as any).chatSettings,
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

        // 4. Use backoff polling strategy to detect when widget is ready
        checkReadyWithBackoff();
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('GenesysScriptLoader: Error loading resources', error);
        setStatus('error');
        setErrorMessage(error.message);
        if (onError) {
          onError(error);
        }
      }
    }, [
      stableCssUrls,
      scriptUrl,
      config,
      onLoad,
      onError,
      checkReadyWithBackoff,
    ]);

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
        }
      `;
      document.head.appendChild(fixOverlayStyle);

      // Load script on mount
      loadScript();

      // Clean up on unmount - remove any pending timers
      return () => {
        if (checkIntervalRef.current) {
          clearTimeout(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
      };
    }, [loadScript]);

    // Only render status indicator if showStatus is true
    if (!showStatus) {
      return null;
    }

    // Render appropriate UI based on loading state
    return (
      <div className="genesys-script-loader" data-status={status}>
        {status === 'loading' && (
          <div className="loader-indicator">Loading chat widget...</div>
        )}
        {status === 'error' && (
          <div className="loader-error">
            Failed to load chat: {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

GenesysScriptLoader.displayName = 'GenesysScriptLoader';

export default GenesysScriptLoader;

// Extend Window interface to avoid conflicts with other declarations
declare global {
  interface Window {
    _forceChatButtonCreate?: () => boolean;
    _genesysCXBus?: GenesysCXBus;
  }
}
