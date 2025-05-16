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

    // Log the props received by the component instance
    logger.info(`${LOG_PREFIX} Component instance created/rendered. Props:`, {
      scriptUrlProp: scriptUrl,
      cssUrlsProp: cssUrls,
      configProp: config,
      showStatus,
    });

    // Determine effective URLs based on props and config
    const effectiveScriptUrl = config?.clickToChatJs || scriptUrl;
    // Ensure effectiveCssUrls is always an array and includes the custom CSS.
    let resolvedCssUrls: string[] = [];
    const baseCssUrl = config?.widgetUrl || cssUrls; // This could be string or string[]

    if (Array.isArray(baseCssUrl)) {
      resolvedCssUrls = [...baseCssUrl];
    } else if (baseCssUrl) {
      resolvedCssUrls = [baseCssUrl];
    }

    const customCssPath = '/assets/genesys/styles/bcbst-custom.css';
    if (!resolvedCssUrls.includes(customCssPath)) {
      resolvedCssUrls.push(customCssPath);
    }
    const effectiveCssUrls = resolvedCssUrls;

    logger.info(`${LOG_PREFIX} Effective URLs determined:`, {
      script: effectiveScriptUrl,
      css: effectiveCssUrls,
    });

    // Memoize cssUrls to prevent unnecessary re-renders if parent re-renders
    const stableCssUrls = useMemo(() => effectiveCssUrls, [effectiveCssUrls]);

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
      if (initialized.current && status !== 'idle') {
        // Allow re-entry if idle (e.g. prop change)
        logger.info(
          `${LOG_PREFIX} loadScript: Already initialized or in progress (status: ${status}). Skipping.`,
        );
        return;
      }
      // If not idle, but initialized.current is true, it means a previous attempt might have started.
      // Resetting initialized.current only if idle allows a fresh attempt if props change and component re-evaluates.
      if (status === 'idle') {
        initialized.current = false;
      }

      if (initialized.current) {
        logger.info(
          `${LOG_PREFIX} loadScript: Still considered initialized from a previous run, and status is not idle. Skipping to avoid re-entry during an active loading sequence.`,
        );
        return;
      }

      initialized.current = true; // Mark as initialized for this attempt
      logger.info(
        `${LOG_PREFIX} loadScript: Starting script loading sequence. Current status: ${status}`,
      );
      setStatus('loading-css'); // Set status early in the process

      try {
        // 0. Add resource hints
        logger.info(`${LOG_PREFIX} Adding resource hints...`);
        addResourceHints();

        // 1. Load CSS files first
        logger.info(
          `${LOG_PREFIX} Effective CSS URLs to load (stableCssUrls value just before loop):`,
          { urls: stableCssUrls },
        );
        logger.info(
          `${LOG_PREFIX} Loading ${stableCssUrls.length} CSS file(s)...`,
          { urls: stableCssUrls },
        );
        if (stableCssUrls.length === 0) {
          logger.info(`${LOG_PREFIX} No CSS URLs to load.`);
        }
        for (const cssUrl of stableCssUrls) {
          if (!cssUrl) {
            logger.warn(`${LOG_PREFIX} Empty CSS URL found, skipping.`);
            continue;
          }
          logger.info(`${LOG_PREFIX} Attempting to load CSS: ${cssUrl}`);
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

        // 2. Set window.chatSettings
        setStatus('setting-config');
        logger.info(
          `${LOG_PREFIX} Setting window.chatSettings with config:`,
          config,
        );
        if (typeof window !== 'undefined') {
          window.chatSettings = config;
        } else {
          logger.warn(
            `${LOG_PREFIX} window object not available. Cannot set window.chatSettings.`,
          );
        }

        // 3. Load the main Genesys script
        setStatus('loading-script');
        logger.info(
          `${LOG_PREFIX} Attempting to load main script: ${effectiveScriptUrl}`,
        );
        const script = document.createElement('script');
        script.src = effectiveScriptUrl;
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
            `${LOG_PREFIX} Main Genesys script loaded successfully: ${effectiveScriptUrl}`,
          );
          // After script loads, start polling for widget readiness
          setStatus('polling-ready');
          logger.info(
            `${LOG_PREFIX} Script loaded. Now polling for widget readiness (checkReadyWithBackoff).`,
          );
          checkReadyWithBackoff(); // This will eventually call onLoad or onError
        };

        script.onerror = (e) => {
          const errMsg = `Main Genesys script failed to load: ${effectiveScriptUrl}`;
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
        console.log(
          `GenesysScriptLoader: Added script to body: ${effectiveScriptUrl}`,
        );
      } catch (err: any) {
        logger.error(`${LOG_PREFIX} Error in loadScript sequence:`, {
          message: err?.message,
          originalError: err,
        });
        setStatus('error');
        setErrorMessage(
          err?.message || 'An unknown error occurred during script loading.',
        );
        if (onError)
          onError(err instanceof Error ? err : new Error(String(err)));
      }
    }, [config, effectiveScriptUrl, stableCssUrls, onLoad, onError, status]); // Added status to deps of loadScript

    useEffect(() => {
      logger.info(
        `${LOG_PREFIX} useEffect for loadScript triggered. Status: ${status}. Config available: ${!!config}`,
      );

      const timerId = setTimeout(() => {
        // Only attempt to load script if config is available and we haven't had a terminal error
        if (
          config &&
          Object.keys(config).length > 0 &&
          status !== 'error' &&
          status !== 'loaded'
        ) {
          logger.info(
            `${LOG_PREFIX} Config is available. Calling loadScript (after delay).`,
          );
          loadScript();
        } else if (!config || Object.keys(config).length === 0) {
          logger.warn(
            `${LOG_PREFIX} Config not available or empty. Deferring loadScript (after delay).`,
          );
        } else {
          logger.info(
            `${LOG_PREFIX} loadScript not called (after delay). Status: ${status}, Config available: ${!!config}`,
          );
        }
      }, 500); // Introduce a 500ms delay, adjust as needed

      // Cleanup polling interval and the new timer on component unmount or if dependencies change
      return () => {
        clearTimeout(timerId); // Clear the timeout
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
