'use client';

/**
 * @file GenesysScriptLoader.tsx
 * @description This component is dedicated to the orchestrated loading of Genesys chat scripts and their dependencies.
 * As per README.md: "Loads `click_to_chat.js`, sets `window.chatSettings`, manages script lifecycle."
 * Key Responsibilities:
 * - Accepts `genesysChatConfig` (as `config` prop).
 * - Adds DNS prefetch and preconnect resource hints for Genesys domains and jQuery.
 * - Dynamically loads required CSS files.
 * - Sets the fully assembled `genesysChatConfig` onto `window.chatSettings` immediately before injecting `click_to_chat.js`.
 * - Injects and loads the main `public/assets/genesys/click_to_chat.js` script (or a configurable URL).
 * - Handles `onload` and `onerror` for the script tag.
 * - Implements robust polling with exponential backoff to detect when `click_to_chat.js` is ready
 *   (e.g., `window._forceChatButtonCreate` or `window._genesysCXBus` is available).
 * - Calls `window._forceChatButtonCreate()` if available to ensure the chat button is rendered.
 * - Invokes `onLoad` or `onError` callbacks based on the script loading outcome.
 * - Optionally displays a visual status indicator.
 */

import { logger } from '@/utils/logger';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ChatSettings,
  GenesysChatConfig,
  GenesysCXBus,
} from '../types/chat-types';

const LOG_PREFIX = '[GenesysScriptLoader]';

/**
 * Props for the GenesysScriptLoader component
 */
interface GenesysScriptLoaderProps {
  /** URL of the main Genesys chat script */
  scriptUrl?: string;
  /** Array of CSS URLs to load before the script */
  cssUrls?: string[];
  /** Configuration object to be set on window.chatSettings */
  config?: Partial<ChatSettings> | GenesysChatConfig;
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
  logger.info(
    `${LOG_PREFIX} addResourceHints: Adding resource hints for performance.`,
  );
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
      logger.info(
        `${LOG_PREFIX} Added resource hint: ${hint.rel} for ${hint.href}`,
      );
    }
  });
};

const GenesysScriptLoader: React.FC<GenesysScriptLoaderProps> = React.memo(
  ({
    scriptUrl = '/assets/genesys/click_to_chat.js', // Default path to the core script
    cssUrls = ['/assets/genesys/styles/bcbst-custom.css'], // Default custom CSS
    config = {},
    onLoad,
    onError,
    showStatus = process.env.NODE_ENV === 'development', // Show status in dev by default
  }) => {
    const [status, setStatus] = useState<
      | 'idle'
      | 'loading-css'
      | 'setting-config'
      | 'loading-script'
      | 'polling-ready'
      | 'loaded'
      | 'error'
    >('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const initialized = useRef(false); // Prevents re-initialization on re-renders
    const checkIntervalRef = useRef<NodeJS.Timeout | null>(null); // For polling timer

    logger.info(
      `${LOG_PREFIX} Component instance created/rendered. Initial status: idle.`,
      { scriptUrl, cssUrlsCount: cssUrls.length, showStatus },
    );

    // Memoize cssUrls to prevent unnecessary re-renders if parent re-renders
    const stableCssUrls = useMemo(() => cssUrls, [cssUrls]);

    /**
     * Checks if Genesys is ready with exponential backoff
     * This reduces CPU usage while still ensuring we detect when scripts are ready
     */
    const checkReadyWithBackoff = useCallback(() => {
      logger.info(
        `${LOG_PREFIX} checkReadyWithBackoff: Starting polling for widget readiness.`,
      );
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
          logger.info(
            `${LOG_PREFIX} Widget readiness detected (found _forceChatButtonCreate or _genesysCXBus). Attempts: ${attempts}`,
          );

          try {
            if (window._forceChatButtonCreate) {
              logger.info(
                `${LOG_PREFIX} Calling window._forceChatButtonCreate() to ensure button creation.`,
              );
              window._forceChatButtonCreate();
            }
          } catch (err: any) {
            logger.error(
              `${LOG_PREFIX} Error calling _forceChatButtonCreate():`,
              { message: err?.message, error: err },
            );
            // Don't necessarily fail the whole load for this, widget might still work via CXBus
          }

          setStatus('loaded');
          logger.info(
            `${LOG_PREFIX} Status set to LOADED. Calling onLoad callback.`,
          );
          if (onLoad) onLoad();
          return;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          logger.error(
            `${LOG_PREFIX} Failed to detect widget readiness after ${maxAttempts} attempts. Polling stopped.`,
          );
          if (status !== 'error') {
            // Avoid overwriting an earlier script load error
            setStatus('error');
            const errMsg =
              'Timeout waiting for chat widget initialization after script load.';
            setErrorMessage(errMsg);
            logger.warn(`${LOG_PREFIX} ${errMsg}. Calling onError callback.`);
            if (onError) onError(new Error(errMsg));
          }
          return;
        }

        timeout = Math.min(timeout * 1.5, 2000);
        logger.info(
          `${LOG_PREFIX} Widget not ready. Retrying in ${timeout}ms (Attempt ${attempts}/${maxAttempts}).`,
        );
        checkIntervalRef.current = setTimeout(checkFn, timeout);
      };

      checkFn(); // Start the first check
    }, [onLoad, onError, status]); // Added status to dependencies

    const loadScript = useCallback(async () => {
      if (initialized.current) {
        logger.info(
          `${LOG_PREFIX} loadScript: Already initialized or in progress. Skipping.`,
        );
        return;
      }
      initialized.current = true; // Mark as initialized to prevent multiple executions
      logger.info(
        `${LOG_PREFIX} loadScript: Starting script loading sequence.`,
      );

      try {
        // 0. Add resource hints
        logger.info(`${LOG_PREFIX} Adding resource hints...`);
        addResourceHints();

        // 1. Load CSS files first
        setStatus('loading-css');
        logger.info(
          `${LOG_PREFIX} Effective CSS URLs to load:`,
          { urls: stableCssUrls }, // Log the URLs being used
        );
        logger.info(
          `${LOG_PREFIX} Loading ${stableCssUrls.length} CSS file(s)...`,
          { urls: stableCssUrls },
        );
        for (const cssUrl of stableCssUrls) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = cssUrl;

          await new Promise<void>((resolve, reject) => {
            link.onload = () => {
              logger.info(`${LOG_PREFIX} Loaded CSS successfully: ${cssUrl}`);
              resolve();
            };
            link.onerror = (errEvent) => {
              const errMsg = `Failed to load CSS: ${cssUrl}`;
              logger.error(`${LOG_PREFIX} ${errMsg}`, { errorEvent: errEvent });
              reject(new Error(errMsg));
            };
            document.head.appendChild(link);
          });
        }
        logger.info(`${LOG_PREFIX} All CSS files loaded successfully.`);

        // 2. Set chat configuration on window object
        setStatus('setting-config');
        logger.info(
          `${LOG_PREFIX} Setting window.chatSettings with provided config.`,
          { configKeys: config ? Object.keys(config) : 'undefined' },
        );
        if (typeof window !== 'undefined') {
          window.chatSettings = config;
        }

        // 3. Load the main script
        setStatus('loading-script');
        logger.info(
          `${LOG_PREFIX} Effective script URL to load:`,
          { url: scriptUrl }, // Log the script URL being used
        );
        logger.info(`${LOG_PREFIX} Loading script: ${scriptUrl}`);
        const script = document.createElement('script');
        script.src = scriptUrl;
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
          logger.info(
            `${LOG_PREFIX} Main Genesys script loaded successfully: ${scriptUrl}`,
          );
          // After script loads, start polling for widget readiness
          setStatus('polling-ready');
          logger.info(
            `${LOG_PREFIX} Script loaded. Now polling for widget readiness (checkReadyWithBackoff).`,
          );
          checkReadyWithBackoff(); // This will eventually call onLoad or onError
        };

        script.onerror = (e) => {
          const errMsg = `Main Genesys script failed to load: ${scriptUrl}`;
          logger.error(`${LOG_PREFIX} ${errMsg}`, { errorEvent: e });
          setStatus('error');
          setErrorMessage(errMsg);
          if (onError) onError(new Error(errMsg));
        };

        const existingScript = document.getElementById('genesys-chat-script');
        if (existingScript) {
          console.log('GenesysScriptLoader: Removing existing script');
          existingScript.remove();
        }

        document.body.appendChild(script);
        console.log(`GenesysScriptLoader: Added script to body: ${scriptUrl}`);
      } catch (err: any) {
        logger.error(`${LOG_PREFIX} Error during script loading sequence:`, {
          message: err?.message,
          error: err,
        });
        setStatus('error');
        setErrorMessage(
          err.message || 'An unknown error occurred during script loading.',
        );
        if (onError)
          onError(err instanceof Error ? err : new Error(String(err)));
      }
    }, [
      config,
      stableCssUrls,
      scriptUrl,
      onLoad,
      onError,
      checkReadyWithBackoff,
    ]); // Added checkReadyWithBackoff

    // Effect to trigger script loading when component mounts or config changes
    useEffect(() => {
      logger.info(
        `${LOG_PREFIX} useEffect: Triggering loadScript. Current status: ${status}. Initialized: ${initialized.current}`,
      );
      if (status === 'idle' && !initialized.current) {
        // Only load if idle and not already initialized
        loadScript();
      }
      // Do not re-run if config, scriptUrl etc. change after initial load, by design of `initialized.current`
      // If re-load on config change is desired, `initialized.current` logic needs adjustment and cleanup of old scripts.

      // Cleanup function for the polling interval when the component unmounts
      return () => {
        if (checkIntervalRef.current) {
          logger.info(
            `${LOG_PREFIX} useEffect: Cleaning up polling timer on unmount.`,
          );
          clearTimeout(checkIntervalRef.current);
        }
      };
    }, [loadScript, status]); // Added status to dependencies

    if (!showStatus) {
      return null; // Render nothing if status indicator is hidden
    }

    // Render status indicator
    logger.info(`${LOG_PREFIX} Rendering status indicator. Status: ${status}`);
    return (
      <div
        className="genesys-script-loader-status"
        style={{
          padding: '5px',
          fontSize: '12px',
          border: '1px solid #eee',
          margin: '5px 0',
        }}
      >
        {status === 'idle' && <p>Genesys Chat: Idle</p>}
        {status === 'loading-css' && <p>Genesys Chat: Loading CSS...</p>}
        {status === 'setting-config' && <p>Genesys Chat: Configuring...</p>}
        {status === 'loading-script' && <p>Genesys Chat: Loading script...</p>}
        {status === 'polling-ready' && (
          <p>Genesys Chat: Verifying widget readiness...</p>
        )}
        {status === 'loaded' && (
          <p style={{ color: 'green' }}>Genesys Chat: Loaded successfully.</p>
        )}
        {status === 'error' && (
          <p style={{ color: 'red' }}>
            Genesys Chat: Error - {errorMessage || 'Failed to load'}
          </p>
        )}
      </div>
    );
  },
);

GenesysScriptLoader.displayName = 'GenesysScriptLoader';

export default GenesysScriptLoader;

// Extend window interface for Genesys specific properties
declare global {
  interface Window {
    _forceChatButtonCreate?: () => boolean;
    _genesysCXBus?: GenesysCXBus;
    chatSettings?: ChatSettings | GenesysChatConfig; // Reflecting that we set it
  }
}
