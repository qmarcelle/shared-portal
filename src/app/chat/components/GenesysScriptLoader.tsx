'use client';

/**
 * @file GenesysScriptLoader.tsx
 * @description This component is dedicated to the orchestrated loading of Genesys chat scripts and their dependencies.
 * Key Responsibilities:
 * - Accepts `genesysChatConfig` (as `config` prop).
 * - Adds DNS prefetch and preconnect resource hints for Genesys domains and jQuery.
 * - Dynamically loads required CSS files.
 * - Sets the fully assembled `genesysChatConfig` onto `window.chatSettings` immediately before injecting `click_to_chat.js`.
 * - Injects and loads the main `public/assets/genesys/click_to_chat.js` script (or a configurable URL).
 * - Handles `onload` and `onerror` for the script tag.
 * - Polls for `window._genesysCXBus` to become available after script loading.
 * - Invokes `onLoad` or `onError` callbacks based on script loading and CXBus readiness outcome.
 * - Optionally displays a visual status indicator.
 */

import {
  ChatLoadingState,
  markScriptLoadComplete,
  markScriptLoadStarted,
  shouldLoadScripts,
} from '@/app/chat/utils/chatSequentialLoader';
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
  scriptLoaded: false,
  cxBusReady: false, // New flag to track CXBus availability
  scriptId: 'genesys-chat-script',
  cssIds: [] as string[],
  activeInstanceId: null as string | null,
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
  chatMode?: 'legacy' | 'cloud' | 'standard';
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
      | 'polling-cxbus' // New state for polling CXBus
      | 'loaded'
      | 'error'
    >('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const initialized = useRef(false); // Prevents re-initialization on re-renders
    const checkIntervalRef = useRef<NodeJS.Timeout | null>(null); // For polling timer
    const instanceId = useRef<string>(`genesys-script-loader-${Date.now()}`);

    // Log the props received by the component instance
    logger.info(`${LOG_PREFIX} Component instance created/rendered. Props:`, {
      scriptUrlProp: scriptUrl,
      cssUrlsProp: cssUrls,
      legacyConfigProp: legacyConfig,
      cloudConfigProp: cloudConfig,
      showStatus,
      chatMode,
      existingStatus: ChatLoadingState.scriptState.isComplete
        ? 'already-loaded'
        : 'not-started',
      instanceId: instanceId.current,
    });
    // Extra: Log when component is mounted
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log(
        '[GenesysScriptLoader] Component mounted. InstanceId:',
        instanceId.current,
      );
    }

    // Check if this should be the active instance
    useEffect(() => {
      // If there's already an active instance and it's not us, become passive
      if (
        GenesysLoadingState.activeInstanceId &&
        GenesysLoadingState.activeInstanceId !== instanceId.current
      ) {
        logger.info(
          `${LOG_PREFIX} Another instance is active (${GenesysLoadingState.activeInstanceId}). This instance (${instanceId.current}) will be passive.`,
        );
        return;
      }

      // Register as the active instance
      GenesysLoadingState.activeInstanceId = instanceId.current;
      logger.info(
        `${LOG_PREFIX} Registered as active GenesysScriptLoader instance: ${instanceId.current}`,
      );

      return () => {
        // Only unregister if we're still the active instance
        if (GenesysLoadingState.activeInstanceId === instanceId.current) {
          GenesysLoadingState.activeInstanceId = null;
          logger.info(
            `${LOG_PREFIX} Unregistered as active GenesysScriptLoader instance: ${instanceId.current}`,
          );
        }
      };
    }, []);

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
     * Wait for CXBus to be available with exponential backoff
     */
    const waitForCXBus = useCallback(() => {
      logger.info(
        `${LOG_PREFIX} waitForCXBus: Starting polling for CXBus availability`,
      );
      setStatus('polling-cxbus');

      let attempts = 0;
      const maxAttempts = 20;
      let timeout = 250; // Start with 250ms

      // Clear any existing interval
      if (checkIntervalRef.current) {
        clearTimeout(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }

      const checkCXBus = () => {
        // Check if CXBus is available
        if (typeof window._genesysCXBus !== 'undefined') {
          logger.info(
            `${LOG_PREFIX} CXBus detected after ${attempts} attempts. CXBus ready.`,
          );

          // Mark CXBus as ready in global state
          GenesysLoadingState.cxBusReady = true;

          setStatus('loaded');

          // Clear any running timeout
          if (checkIntervalRef.current) {
            clearTimeout(checkIntervalRef.current);
            checkIntervalRef.current = null;
          }

          // Call onLoad callback
          if (onLoad) {
            logger.info(
              `${LOG_PREFIX} Calling onLoad callback now that CXBus is ready`,
            );
            onLoad();
          }

          // Try to call _forceChatButtonCreate if available
          if (window._forceChatButtonCreate) {
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

          return;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          logger.error(
            `${LOG_PREFIX} Failed to detect CXBus after ${maxAttempts} attempts. Giving up.`,
          );

          setStatus('error');
          const errMsg = 'Timeout waiting for CXBus after script was loaded.';
          setErrorMessage(errMsg);

          // Do not change scriptLoaded flag, as the script did load
          // Just mark that CXBus is not ready
          GenesysLoadingState.cxBusReady = false;

          if (onError) {
            onError(new Error(errMsg));
          }
          return;
        }

        // Exponential backoff with a maximum delay
        timeout = Math.min(timeout * 1.5, 2000);

        logger.info(
          `${LOG_PREFIX} CXBus not ready yet. Retrying in ${timeout}ms (Attempt ${attempts}/${maxAttempts}).`,
        );

        checkIntervalRef.current = setTimeout(checkCXBus, timeout);
      };

      // Start the first check
      checkCXBus();
    }, [onLoad, onError]);

    const config = chatMode === 'legacy' ? legacyConfig : cloudConfig;

    // Function to load CSS
    const loadCssFiles = async () => {
      // Skip if CSS files are already loaded
      if (GenesysLoadingState.cssIds.length === stableCssUrls.length) {
        logger.info(
          `${LOG_PREFIX} All CSS files already loaded (${GenesysLoadingState.cssIds.length}). Skipping.`,
        );
        return;
      }

      if (stableCssUrls.length > 0) {
        logger.info(
          `${LOG_PREFIX} Loading ${stableCssUrls.length} CSS files:`,
          stableCssUrls,
        );

        for (let i = 0; i < stableCssUrls.length; i++) {
          const cssUrl = stableCssUrls[i];
          try {
            // Generate a unique ID for this CSS
            const cssId = `genesys-chat-css-${i}`;

            // Skip if this specific CSS is already loaded
            if (
              document.getElementById(cssId) ||
              GenesysLoadingState.cssIds.includes(cssId)
            ) {
              logger.info(
                `${LOG_PREFIX} CSS ${cssId} already loaded. Skipping.`,
              );
              continue;
            }

            // Extra: Log before appending CSS
            if (typeof window !== 'undefined') {
              // eslint-disable-next-line no-console
              console.log('[GenesysScriptLoader] Appending CSS:', cssUrl);
            }

            // Create link element
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = cssUrl;
            link.id = cssId;

            // Add to document
            document.head.appendChild(link);
            GenesysLoadingState.cssIds.push(cssId);
            logger.info(`${LOG_PREFIX} Added CSS: ${cssUrl} with ID ${cssId}`);
          } catch (cssErr) {
            logger.warn(`${LOG_PREFIX} Error loading CSS ${cssUrl}:`, cssErr);
            // Continue despite CSS errors - they're not critical
          }
        }
      } else {
        logger.info(`${LOG_PREFIX} No CSS files to load.`);
      }
    };

    const loadScript = useCallback(async () => {
      // Extra: Log before shouldLoadScripts
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.log('[GenesysScriptLoader] About to check shouldLoadScripts');
        // eslint-disable-next-line no-console
        console.log(
          '[GenesysScriptLoader] ChatLoadingState:',
          JSON.stringify(ChatLoadingState),
        );
      }
      // First check if we should load scripts based on our sequential loader state
      const canLoadScripts = shouldLoadScripts();
      // Extra: Log after shouldLoadScripts
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.log(
          '[GenesysScriptLoader] shouldLoadScripts returned:',
          canLoadScripts,
        );
      }
      logger.info(
        `${LOG_PREFIX} Script loading check - shouldLoadScripts returned: ${canLoadScripts}`,
        {
          apiStateComplete: ChatLoadingState.apiState.isComplete,
          apiStateEligible: ChatLoadingState.apiState.isEligible,
          scriptStateComplete: ChatLoadingState.scriptState.isComplete,
          scriptStateLoadAttempts: ChatLoadingState.scriptState.loadAttempts,
        },
      );

      if (!canLoadScripts) {
        logger.info(
          `${LOG_PREFIX} Scripts loading skipped based on sequential loader state.`,
        );

        // If scripts are already loaded successfully, we should still check for CXBus
        if (
          ChatLoadingState.scriptState.isComplete &&
          GenesysLoadingState.scriptLoaded
        ) {
          logger.info(
            `${LOG_PREFIX} Scripts already loaded, checking for CXBus.`,
          );

          // Check if CXBus is also ready
          if (GenesysLoadingState.cxBusReady) {
            logger.info(
              `${LOG_PREFIX} CXBus already marked as ready, calling onLoad callback.`,
            );
            if (onLoad) onLoad();
          } else if (typeof window._genesysCXBus !== 'undefined') {
            // CXBus exists but wasn't marked as ready
            logger.info(
              `${LOG_PREFIX} CXBus found but not marked as ready. Marking as ready and calling onLoad.`,
            );
            GenesysLoadingState.cxBusReady = true;
            if (onLoad) onLoad();
          } else {
            // Script loaded but CXBus not ready yet, start polling
            logger.info(
              `${LOG_PREFIX} Scripts loaded but CXBus not ready. Starting polling for CXBus.`,
            );
            waitForCXBus();
          }
        }
        return;
      }

      if (initialized.current && status !== 'idle') {
        // Allow re-entry if idle (e.g. prop change)
        logger.info(
          `${LOG_PREFIX} loadScript: Already initialized or in progress (status: ${status}). Skipping.`,
        );
        return;
      }

      // Check if a script is already in the DOM - prevent duplicate loading
      const existingScript = document.getElementById('genesys-chat-script');
      if (existingScript && !ChatLoadingState.scriptState.isComplete) {
        logger.info(
          `${LOG_PREFIX} Script already in DOM but not marked complete. Waiting for completion.`,
        );

        // Wait a bit then check if the script is loaded
        setTimeout(() => {
          if (window._genesysCXBus) {
            logger.info(
              `${LOG_PREFIX} Script appears to be loaded, proceeding to CXBus polling.`,
            );
            setStatus('polling-cxbus');
            waitForCXBus();
          } else {
            logger.info(
              `${LOG_PREFIX} Script still not ready, continuing with load process.`,
            );
            continueLoadProcess();
          }
        }, 500);
        return;
      }

      // Proceed with the load process
      continueLoadProcess();

      function continueLoadProcess() {
        // Mark as initialized for this attempt
        initialized.current = true;

        // Update sequential loader state
        markScriptLoadStarted();

        logger.info(
          `${LOG_PREFIX} loadScript: Starting script loading sequence. Current status: ${status}`,
        );
        setStatus('loading-css');

        // Define loadCssFiles inside the continueLoadProcess function so it's in scope
        const loadCssFiles = async () => {
          // Skip if CSS files are already loaded
          if (GenesysLoadingState.cssIds.length === stableCssUrls.length) {
            logger.info(
              `${LOG_PREFIX} All CSS files already loaded (${GenesysLoadingState.cssIds.length}). Skipping.`,
            );
            return;
          }

          if (stableCssUrls.length > 0) {
            logger.info(
              `${LOG_PREFIX} Loading ${stableCssUrls.length} CSS files:`,
              stableCssUrls,
            );

            for (let i = 0; i < stableCssUrls.length; i++) {
              const cssUrl = stableCssUrls[i];
              try {
                // Generate a unique ID for this CSS
                const cssId = `genesys-chat-css-${i}`;

                // Skip if this specific CSS is already loaded
                if (
                  document.getElementById(cssId) ||
                  GenesysLoadingState.cssIds.includes(cssId)
                ) {
                  logger.info(
                    `${LOG_PREFIX} CSS ${cssId} already loaded. Skipping.`,
                  );
                  continue;
                }

                // Create link element
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = cssUrl;
                link.id = cssId;

                // Add to document
                document.head.appendChild(link);
                GenesysLoadingState.cssIds.push(cssId);
                logger.info(
                  `${LOG_PREFIX} Added CSS: ${cssUrl} with ID ${cssId}`,
                );
              } catch (cssErr) {
                logger.warn(
                  `${LOG_PREFIX} Error loading CSS ${cssUrl}:`,
                  cssErr,
                );
                // Continue despite CSS errors - they're not critical
              }
            }
          } else {
            logger.info(`${LOG_PREFIX} No CSS files to load.`);
          }
        };

        // Define configureAndLoadScript inside the continueLoadProcess function
        const configureAndLoadScript = () => {
          try {
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

            // Extra: Log before appending script
            if (typeof window !== 'undefined') {
              // eslint-disable-next-line no-console
              console.log(
                '[GenesysScriptLoader] Appending script:',
                effectiveScriptUrl,
              );
            }

            const scriptElement: HTMLScriptElement =
              document.createElement('script');

            if (chatMode === 'cloud') {
              // Cloud mode script setup
              scriptElement.id = 'genesys-cloud-bootstrap-script';
              scriptElement.type = 'text/javascript';
              scriptElement.charset = 'utf-8';
              scriptElement.textContent = `
                (function (g, e, n, es, ys) {
                  g['_genesysJs'] = e;
                  g[e] = g[e] || function () {
                    (g[e].q = g[e].q || []).push(arguments)
                  };
                  g[e].t = 1 * new Date();
                  g[e].c = es;
                  ys = document.createElement('script'); ys.async = 1; ys.src = n; ys.charset = 'utf-8'; document.head.appendChild(ys);
                })(window, 'Genesys', '${effectiveScriptUrl}', {
                  environment: '${cloudConfig?.environment || ''}',
                  deploymentId: '${cloudConfig?.deploymentId || ''}'
                });
              `;
            } else {
              // Legacy mode
              scriptElement.src = effectiveScriptUrl;
              scriptElement.id = 'genesys-chat-script';
              scriptElement.async = false;
            }

            scriptElement.onload = () => {
              logger.info(
                `${LOG_PREFIX} Main Genesys script element processed for ${chatMode} mode.`,
              );

              // Extra: Log script loaded
              if (typeof window !== 'undefined') {
                // eslint-disable-next-line no-console
                console.log(
                  '[GenesysScriptLoader] Script loaded successfully:',
                  effectiveScriptUrl,
                );
              }

              // Mark script as loaded
              GenesysLoadingState.scriptLoaded = true;

              // Update sequential loader state
              markScriptLoadComplete(true);

              // Start polling for CXBus
              waitForCXBus();
            };

            scriptElement.onerror = (e) => {
              const errMsg = `Main Genesys script element failed for ${chatMode} mode.`;
              logger.error(`${LOG_PREFIX} ${errMsg}`, { errorEvent: e });
              setStatus('error');
              setErrorMessage(errMsg);

              // Extra: Log script load error
              if (typeof window !== 'undefined') {
                // eslint-disable-next-line no-console
                console.error(
                  '[GenesysScriptLoader] Script failed to load:',
                  effectiveScriptUrl,
                  e,
                );
              }

              // Update state flags
              GenesysLoadingState.scriptLoaded = false;
              GenesysLoadingState.cxBusReady = false;

              // Mark as failed in the sequential loader
              markScriptLoadComplete(false);

              if (onError) onError(new Error(errMsg));
            };

            // Remove existing script if present
            const existingScript = document.getElementById(
              'genesys-chat-script',
            );
            if (existingScript) {
              logger.info(`${LOG_PREFIX} Removing existing script.`);
              existingScript.remove();
            }

            document.head.appendChild(scriptElement);
            logger.info(
              `${LOG_PREFIX} Added script element: ${scriptElement.id}`,
            );
          } catch (err: any) {
            const error = err instanceof Error ? err : new Error(String(err));
            logger.error(`${LOG_PREFIX} Error in script loading:`, {
              message: error.message,
              originalError: err,
            });
            setStatus('error');
            setErrorMessage(error.message || 'Failed to load script');

            // Mark as failed in the sequential loader
            markScriptLoadComplete(false);

            if (onError) onError(error);
          }
        };

        // Load the script and set up everything
        loadCssFiles()
          .then(() => {
            // Continue with the rest of the loading process
            configureAndLoadScript();
          })
          .catch((err) => {
            const error = err instanceof Error ? err : new Error(String(err));
            logger.error(`${LOG_PREFIX} Error in CSS loading:`, {
              message: error.message,
              originalError: err,
            });
            setStatus('error');
            setErrorMessage(error.message || 'Failed to load CSS files');

            // Mark as failed in the sequential loader
            markScriptLoadComplete(false);

            if (onError) onError(error);
          });
      }
    }, [
      chatMode,
      effectiveScriptUrl,
      stableCssUrls,
      legacyConfig,
      cloudConfig,
      onLoad,
      onError,
      status,
      waitForCXBus,
      instanceId,
    ]);

    // Error handling function
    const handleError = useCallback(
      (error: Error) => {
        const message =
          error?.message || 'Unknown error loading Genesys scripts';
        logger.error(`${LOG_PREFIX} Error:`, { message, error });
        setStatus('error');
        setErrorMessage(message);

        // Mark as failed in the sequential loader
        markScriptLoadComplete(false);

        if (onError) onError(error);
      },
      [onError],
    );

    // Initialization logic
    useEffect(() => {
      // Only proceed if this is the active instance
      if (GenesysLoadingState.activeInstanceId !== instanceId.current) {
        logger.info(
          `${LOG_PREFIX} This is not the active instance. Skipping initialization.`,
        );
        return;
      }

      // Check if scripts are already loaded according to our sequential loader
      if (
        ChatLoadingState.scriptState.isComplete &&
        GenesysLoadingState.scriptLoaded
      ) {
        logger.info(
          `${LOG_PREFIX} Scripts already loaded according to ChatLoadingState.`,
        );

        if (GenesysLoadingState.cxBusReady) {
          logger.info(
            `${LOG_PREFIX} CXBus already ready. Setting status to loaded and calling onLoad.`,
          );
          setStatus('loaded');
          if (onLoad) onLoad();
        } else if (typeof window._genesysCXBus !== 'undefined') {
          logger.info(
            `${LOG_PREFIX} CXBus detected but not marked as ready. Marking as ready and calling onLoad.`,
          );
          GenesysLoadingState.cxBusReady = true;
          setStatus('loaded');
          if (onLoad) onLoad();
        } else {
          logger.info(
            `${LOG_PREFIX} Scripts loaded but CXBus not ready. Starting polling for CXBus.`,
          );
          waitForCXBus();
        }
        return;
      }

      // If scripts are currently loading in another component instance, wait
      if (ChatLoadingState.scriptState.isLoading) {
        logger.info(
          `${LOG_PREFIX} Scripts already loading in another instance, waiting.`,
        );
        return;
      }

      // This instance will handle initialization if allowed by sequential loader
      if (shouldLoadScripts()) {
        logger.info(
          `${LOG_PREFIX} Ready to initialize scripts based on sequential loader state.`,
        );
        loadScript();
      } else {
        logger.info(
          `${LOG_PREFIX} Scripts loading not allowed by sequential loader state.`,
        );
      }

      return () => {
        if (checkIntervalRef.current) {
          clearTimeout(checkIntervalRef.current);
        }
      };
    }, [loadScript, onLoad, waitForCXBus, shouldLoadScripts, checkIntervalRef]);

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
        {status === 'polling-cxbus' && (
          <p>Genesys Chat: Waiting for CXBus...</p>
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
    _chatWidgetInstanceId?: string; // For tracking active ChatWidget instance
  }
}
