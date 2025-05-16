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

import { GenesysConfig } from '@/types/config';
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

// Static loading tracker to prevent multiple initializations
// This persists across component instances
const GenesysLoadingState = {
  isInitialized: false,
  isLoading: false,
  isLoaded: false,
  error: null as Error | null,
  scriptId: 'genesys-chat-script',
  cssIds: [] as string[],
};

// Define structure for Genesys Cloud initial config
interface GenesysCloudConfig extends GenesysConfig {
  customAttributes?: {
    Firstname?: string;
    lastname?: string;
    MEMBER_ID?: string;
    MEMBER_DOB?: string;
    GROUP_ID?: string;
    PLAN_ID?: string;
    INQ_TYPE?: string;
    isMedicalEligible?: string;
    IsDentalEligible?: string;
    IsVisionEligible?: string;
    IDCardBotName?: string;
    LOB?: string;
  };
}

/**
 * Props for the GenesysScriptLoader component
 */
interface GenesysScriptLoaderProps {
  /** Main Genesys script URL (can be legacy click_to_chat.js or cloud genesys.min.js) */
  scriptUrl?: string;
  /** Array of CSS URLs to load before the script */
  cssUrls?: string[];
  /** Legacy chat configuration */
  legacyConfig?: Partial<ChatSettings>;
  /** Cloud chat configuration */
  cloudConfig?: GenesysCloudConfig;
  /** Callback when scripts are successfully loaded */
  onLoad?: () => void;
  /** Callback when script loading fails */
  onError?: (error: Error) => void;
  /** Whether to show the status indicator */
  showStatus?: boolean;
  /** Explicitly set chat mode to determine loading strategy */
  chatMode?: 'legacy' | 'cloud';
}

/**
 * Adds resource hints to improve connection performance for external resources
 */
const addResourceHints = () => {
  // Skip if already added
  if (
    document.querySelector(
      'link[rel="preconnect"][href="https://code.jquery.com"]',
    )
  ) {
    logger.info(`${LOG_PREFIX} Resource hints already added, skipping.`);
    return;
  }

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
    scriptUrl,
    cssUrls,
    legacyConfig,
    cloudConfig,
    onLoad,
    onError,
    showStatus = process.env.NODE_ENV === 'development',
    chatMode = 'legacy',
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
      legacyConfigProp: legacyConfig,
      cloudConfigProp: cloudConfig,
      showStatus,
      chatMode,
      existingStatus: GenesysLoadingState.isLoaded
        ? 'already-loaded'
        : GenesysLoadingState.isLoading
          ? 'already-loading'
          : 'not-started',
    });

    // Determine effective URLs based on chat mode
    const effectiveScriptUrl = useMemo(() => {
      if (chatMode === 'cloud') {
        return (
          scriptUrl ||
          'https://apps.usw2.pure.cloud/genesys-bootstrap/genesys.min.js'
        );
      }
      // Legacy mode - use click_to_chat.js
      return scriptUrl || '/assets/genesys/click_to_chat.js';
    }, [chatMode, scriptUrl]);

    // Determine CSS URLs based on chat mode
    const effectiveCssUrls = useMemo(() => {
      if (chatMode === 'cloud') {
        // Cloud mode doesn't need our legacy CSS files
        return cssUrls || [];
      }
      // Legacy mode - ensure we have all required CSS files
      const defaultCssUrls = [
        '/assets/genesys/plugins/widgets.min.css',
        '/assets/genesys/styles/bcbst-custom.css',
      ];
      return cssUrls || defaultCssUrls;
    }, [chatMode, cssUrls]);

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
        // For cloud, readiness might be just window.Genesys object and its methods.
        // For legacy, it's _forceChatButtonCreate or _genesysCXBus
        const isReady =
          chatMode === 'cloud'
            ? typeof window.Genesys === 'function' &&
              typeof window.Genesys.command === 'function'
            : window._forceChatButtonCreate || window._genesysCXBus;

        if (isReady) {
          logger.info(
            `${LOG_PREFIX} Widget readiness detected. Mode: ${chatMode}. Attempts: ${attempts}`,
          );

          if (chatMode === 'legacy' && window._forceChatButtonCreate) {
            try {
              logger.info(
                `${LOG_PREFIX} Calling window._forceChatButtonCreate() for legacy mode.`,
              );
              window._forceChatButtonCreate();
            } catch (err: any) {
              logger.error(
                `${LOG_PREFIX} Error calling _forceChatButtonCreate():`,
                { message: err?.message, error: err },
              );
            }
          }
          // For cloud mode, further configuration via Genesys('config.set', ...) or Genesys('command', ...)
          // would typically happen *after* this onLoad, triggered by the calling component.
          // Or, we could pass a full config object to be applied here.

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

      // Added to prevent re-entry if already loading/loaded/error unless idle.
      if (initialized.current && status !== 'idle') {
        logger.info(
          `${LOG_PREFIX} loadScript: Script loading process already initiated or completed (status: ${status}). Preventing re-entry.`,
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

        // 2. Set window.chatSettings (for legacy mode)
        if (chatMode === 'legacy') {
          setStatus('setting-config');
          logger.info(
            `${LOG_PREFIX} Legacy Mode: Setting window.chatSettings with legacyConfig:`,
            legacyConfig,
          );
          if (typeof window !== 'undefined') {
            window.chatSettings = legacyConfig;
          } else {
            logger.warn(
              `${LOG_PREFIX} Legacy Mode: window object not available. Cannot set window.chatSettings.`,
            );
          }
        } else {
          logger.info(
            `${LOG_PREFIX} Cloud Mode: Skipping window.chatSettings. Config passed in script tag or via Genesys object post-load.`,
            { cloudConfig },
          );
        }

        // 3. Load the main Genesys script
        setStatus('loading-script');
        logger.info(
          `${LOG_PREFIX} Attempting to load main script for ${chatMode} mode: ${effectiveScriptUrl}`,
        );

        let scriptElement: HTMLScriptElement;

        if (chatMode === 'cloud') {
          if (!cloudConfig?.deploymentId || !cloudConfig?.environment) {
            const errMsg =
              'Genesys Cloud mode requires deploymentId and environment in cloudConfig.';
            logger.error(`${LOG_PREFIX} ${errMsg}`);
            setStatus('error');
            setErrorMessage(errMsg);
            if (onError) onError(new Error(errMsg));
            initialized.current = false; // Allow retry if props change
            return;
          }
          // For Genesys Cloud, we create the script tag with embedded configuration
          // as shown in the user-provided snippet.
          const scriptContent = `
            (function (g, e, n, es, ys) {
              g['_genesysJs'] = e;
              g[e] = g[e] || function () {
                (g[e].q = g[e].q || []).push(arguments)
              };
              g[e].t = 1 * new Date();
              g[e].c = es;
              ys = document.createElement('script'); ys.async = 1; ys.src = n; ys.charset = 'utf-8'; document.head.appendChild(ys);
            })(window, 'Genesys', '${effectiveScriptUrl}', {
              environment: '${cloudConfig.environment}',
              deploymentId: '${cloudConfig.deploymentId}'
            });
          `;
          scriptElement = document.createElement('script');
          scriptElement.id = 'genesys-cloud-bootstrap-script';
          scriptElement.type = 'text/javascript';
          scriptElement.charset = 'utf-8';
          scriptElement.textContent = scriptContent;

          // The actual script loading (genesys.min.js) is handled *by* this bootstrap code.
          // So, the 'onload' for this inline script means the bootstrap is added.
          // Readiness of genesys.min.js is then polled by checkReadyWithBackoff.
        } else {
          // Legacy mode
          scriptElement = document.createElement('script');
          scriptElement.src = effectiveScriptUrl;
          scriptElement.id = 'genesys-chat-script'; // Legacy ID
          scriptElement.async = false; // Legacy mode often requires sync
        }

        scriptElement.onload = () => {
          logger.info(
            `${LOG_PREFIX} Main Genesys script element processed for ${chatMode} mode. Source/Content: ${scriptElement.src || 'inline_bootstrap_script'}`,
          );
          setStatus('polling-ready');
          logger.info(
            `${LOG_PREFIX} Script processed. Now polling for widget readiness (checkReadyWithBackoff).`,
          );
          checkReadyWithBackoff();
        };

        scriptElement.onerror = (e) => {
          const errMsg = `Main Genesys script element failed for ${chatMode} mode. Source/Content: ${scriptElement.src || 'inline_bootstrap_script'}`;
          logger.error(`${LOG_PREFIX} ${errMsg}`, { errorEvent: e });
          setStatus('error');
          setErrorMessage(errMsg);
          if (onError) onError(new Error(errMsg));
          initialized.current = false; // Allow retry
        };

        const existingScriptId =
          chatMode === 'cloud'
            ? 'genesys-cloud-bootstrap-script'
            : 'genesys-chat-script';
        const existingScript = document.getElementById(existingScriptId);
        if (existingScript) {
          logger.info(
            `${LOG_PREFIX} Removing existing script: ${existingScriptId}`,
          );
          existingScript.remove();
        }

        document.head.appendChild(scriptElement); // Append to head for cloud, can be body for legacy
        logger.info(
          `${LOG_PREFIX} Added script element to ${chatMode === 'cloud' ? 'head' : 'body'}: ${scriptElement.id}`,
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
    }, [chatMode, effectiveScriptUrl, stableCssUrls, onLoad, onError, status]); // Added status to deps of loadScript

    // Error handling function
    const handleError = useCallback(
      (error: Error) => {
        const message =
          error?.message || 'Unknown error loading Genesys scripts';
        logger.error(`${LOG_PREFIX} Error:`, { message, error });
        setStatus('error');
        setErrorMessage(message);
        if (onError) onError(error);
      },
      [onError],
    );

    // For cloud mode, inject the initialization script
    const injectCloudScript = useCallback(() => {
      if (chatMode !== 'cloud' || !cloudConfig) return;

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.charset = 'utf-8';
      script.textContent = `
        (function (g, e, n, es, ys) {
          g['_genesysJs'] = e;
          g[e] = g[e] || function () {
            (g[e].q = g[e].q || []).push(arguments)
          };
          g[e].t = 1 * new Date();
          g[e].c = es;
          ys = document.createElement('script'); ys.async = 1; ys.src = n; ys.charset = 'utf-8'; document.head.appendChild(ys);
        })(window, 'Genesys', '${effectiveScriptUrl}', {
          environment: '${cloudConfig.environment}',
          deploymentId: '${cloudConfig.deploymentId}'
        });

        // Set up database subscription for custom attributes
        Genesys("subscribe", "Database.ready", function () {
          console.log("Database plugin is ready.");
          Genesys("command", "Database.set", {
            messaging: {
              customAttributes: ${JSON.stringify(cloudConfig.customAttributes || {})}
            }
          });
        });
      `;

      document.head.appendChild(script);
      logger.info(`${LOG_PREFIX} Injected Genesys Cloud initialization script`);
    }, [chatMode, cloudConfig, effectiveScriptUrl]);

    // Initialization logic
    useEffect(() => {
      // Don't re-initialize if already done
      if (initialized.current) {
        logger.info(
          `${LOG_PREFIX} Component already initialized this instance, skipping.`,
        );
        return;
      }

      // Check global state first
      if (GenesysLoadingState.isLoaded) {
        logger.info(
          `${LOG_PREFIX} Genesys already fully loaded in another instance, skipping initialization.`,
        );
        setStatus('loaded');
        if (onLoad) onLoad();
        return;
      }

      if (GenesysLoadingState.isLoading) {
        logger.info(
          `${LOG_PREFIX} Genesys already loading in another instance, waiting for it to complete.`,
        );
        // Start polling to check when it completes
        const checkLoaded = setInterval(() => {
          if (GenesysLoadingState.isLoaded) {
            clearInterval(checkLoaded);
            setStatus('loaded');
            if (onLoad) onLoad();
          } else if (GenesysLoadingState.error) {
            clearInterval(checkLoaded);
            setStatus('error');
            setErrorMessage(GenesysLoadingState.error.message);
            if (onError) onError(GenesysLoadingState.error);
          }
        }, 200);
        return () => clearInterval(checkLoaded);
      }

      // If we get here, we're the first one - mark as loading globally
      GenesysLoadingState.isLoading = true;
      initialized.current = true;

      // The rest of the init function (add guard at the start)
      const init = async () => {
        try {
          // Check if script already exists
          if (document.getElementById(GenesysLoadingState.scriptId)) {
            logger.info(
              `${LOG_PREFIX} Script already exists in DOM, skipping loading.`,
            );
            GenesysLoadingState.isLoaded = true;
            setStatus('loaded');
            if (onLoad) onLoad();
            return;
          }

          // Always add resource hints first
          addResourceHints();

          // Load CSS files if needed
          if (effectiveCssUrls.length > 0) {
            setStatus('loading-css');
            await loadScript();
          }

          setStatus('setting-config');
          if (chatMode === 'cloud') {
            // Cloud mode initialization
            injectCloudScript();
          } else {
            // Legacy mode initialization
            window.chatSettings = legacyConfig;
            setStatus('loading-script');
            await loadScript();
          }

          setStatus('polling-ready');
          checkReadyWithBackoff();
        } catch (error: any) {
          logger.error(`${LOG_PREFIX} Error in initialization:`, {
            message: error?.message,
            stack: error?.stack,
          });
          GenesysLoadingState.error = error;
          GenesysLoadingState.isLoading = false;
          setStatus('error');
          setErrorMessage(error?.message || 'Unknown error in initialization');
          if (onError) onError(error);
        }
      };

      init();

      return () => {
        if (checkIntervalRef.current) {
          clearTimeout(checkIntervalRef.current);
        }
      };
    }, [
      effectiveCssUrls,
      effectiveScriptUrl,
      legacyConfig,
      chatMode,
      injectCloudScript,
      checkReadyWithBackoff,
      handleError,
      loadScript,
    ]);

    useEffect(() => {
      logger.info(
        `${LOG_PREFIX} useEffect for loadScript triggered. Status: ${status}. Config available: ${!!legacyConfig || !!cloudConfig}`,
      );

      const timerId = setTimeout(() => {
        // Only attempt to load script if config is available and we haven't had a terminal error
        if (
          (legacyConfig && Object.keys(legacyConfig).length > 0) ||
          (cloudConfig && Object.keys(cloudConfig).length > 0)
        ) {
          logger.info(
            `${LOG_PREFIX} Config is available. Calling loadScript (after delay).`,
          );
          loadScript();
        } else if (!legacyConfig && !cloudConfig) {
          logger.warn(
            `${LOG_PREFIX} Config not available or empty. Deferring loadScript (after delay).`,
          );
        } else {
          logger.info(
            `${LOG_PREFIX} loadScript not called (after delay). Status: ${status}, Config available: ${!!legacyConfig || !!cloudConfig}`,
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
    chatSettings?: ChatSettings | GenesysChatConfig; // Reflecting that we set it for legacy
    Genesys?: any; // For Genesys Cloud
  }
}
