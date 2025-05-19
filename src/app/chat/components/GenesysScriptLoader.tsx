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
import { useChatStore } from '../stores/chatStore';
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
  buttonDetected: false,
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
        `%c[GenesysScriptLoader] MOUNTED. InstanceId: ${instanceId.current}`,
        'color: blue; font-weight: bold;',
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
          `${LOG_PREFIX} Instance ${instanceId.current} will be PASSIVE. Active instance is ${GenesysLoadingState.activeInstanceId}.`,
        );
        // eslint-disable-next-line no-console
        console.log(
          `%c[GenesysScriptLoader] Instance ${instanceId.current} will be PASSIVE. Active: ${GenesysLoadingState.activeInstanceId}`,
          'color: orange;',
        );
        return;
      }

      // Register as the active instance
      GenesysLoadingState.activeInstanceId = instanceId.current;
      logger.info(
        `${LOG_PREFIX} Instance ${instanceId.current} registered as ACTIVE.`,
      );
      // eslint-disable-next-line no-console
      console.log(
        `%c[GenesysScriptLoader] Instance ${instanceId.current} registered as ACTIVE.`,
        'color: green; font-weight: bold;',
      );

      return () => {
        // Only unregister if we're still the active instance
        if (GenesysLoadingState.activeInstanceId === instanceId.current) {
          GenesysLoadingState.activeInstanceId = null;
          logger.info(
            `${LOG_PREFIX} Instance ${instanceId.current} UNREGISTERED as active.`,
          );
          // eslint-disable-next-line no-console
          console.log(
            `%c[GenesysScriptLoader] Instance ${instanceId.current} UNREGISTERED as active.`,
            'color: red; font-weight: bold;',
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
      // Legacy mode - load click_to_chat.js which will handle loading widgets.min.js
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
     * Returns a Promise that resolves when CXBus is ready
     */
    const waitForCXBus = useCallback(() => {
      logger.info(
        `${LOG_PREFIX} waitForCXBus: Starting polling for CXBus availability (simplified check).`,
      );
      setStatus('polling-cxbus');

      // Clear any existing interval
      if (checkIntervalRef.current) {
        clearTimeout(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }

      let attempts = 0;
      const maxAttempts = 20;
      let timeout = 250;

      // Create a promise that resolves when CXBus is available
      return new Promise<void>((resolve, reject) => {
        const checkCXBusOnly = () => {
          if (typeof window._genesysCXBus !== 'undefined') {
            logger.info(
              `${LOG_PREFIX} CXBus detected after ${attempts} attempts. CXBus ready (simplified check).`,
              {
                cxBusObject: !!window._genesysCXBus,
                commandFunction:
                  typeof window._genesysCXBus?.command === 'function',
                subscribeFunction:
                  typeof window._genesysCXBus?.subscribe === 'function',
              },
            );
            GenesysLoadingState.cxBusReady = true;
            setStatus('loaded'); // Or a new state like 'cxbus-ready-waiting-for-click-to-chat'

            if (checkIntervalRef.current) {
              clearTimeout(checkIntervalRef.current);
              checkIntervalRef.current = null;
            }
            resolve(); // Resolve as soon as CXBus is found
            return;
          }

          attempts++;
          if (attempts >= maxAttempts) {
            logger.error(
              `${LOG_PREFIX} Failed to detect CXBus after ${maxAttempts} attempts (simplified check). Giving up.`,
              {
                existingScriptTag: !!document.getElementById(
                  GenesysLoadingState.scriptId,
                ),
                scriptLoadState: ChatLoadingState.scriptState,
                windowObjects: {
                  hasCXBus: typeof window._genesysCXBus !== 'undefined',
                },
              },
            );
            setStatus('error');
            const errMsg =
              'Timeout waiting for CXBus (simplified check) after widgets.min.js was loaded.';
            setErrorMessage(errMsg);
            GenesysLoadingState.cxBusReady = false;
            reject(new Error(errMsg));
            return;
          }

          timeout = Math.min(timeout * 1.5, 2000);
          logger.info(
            `${LOG_PREFIX} CXBus not ready yet (simplified check). Retrying in ${timeout}ms (Attempt ${attempts}/${maxAttempts}).`,
            {
              windowObjects: {
                hasCXBus: typeof window._genesysCXBus !== 'undefined',
              },
            },
          );
          checkIntervalRef.current = setTimeout(checkCXBusOnly, timeout);
        };
        checkCXBusOnly();
      });
    }, [setStatus, setErrorMessage]);

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

    // Helper function to load a script and return a promise
    const loadScriptAsync = (
      src: string,
      id: string,
      async = true,
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        if (document.getElementById(id)) {
          logger.info(`${LOG_PREFIX} Script ${id} already in DOM. Resolving.`);
          resolve();
          return;
        }

        const scriptElement = document.createElement('script');
        scriptElement.src = src;
        scriptElement.id = id;
        scriptElement.async = async;
        scriptElement.onload = () => {
          logger.info(`${LOG_PREFIX} Script loaded successfully: ${src}`);
          resolve();
        };
        scriptElement.onerror = (e) => {
          const errMsg = `Failed to load script: ${src}`;
          logger.error(`${LOG_PREFIX} ${errMsg}`, { errorEvent: e });
          reject(new Error(errMsg));
        };
        document.head.appendChild(scriptElement);
        logger.info(`${LOG_PREFIX} Appending script: ${src} with ID ${id}`);
      });
    };

    const loadScript = useCallback(async () => {
      // Extra: Log before shouldLoadScripts
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.log(
          `%c[GenesysScriptLoader] ${instanceId.current} ENTERING loadScript function. Status: ${status}`,
          'color: purple; font-weight: bold;',
        );
        // eslint-disable-next-line no-console
        console.log(
          '[GenesysScriptLoader] About to check shouldLoadScripts. Current ChatLoadingState:',
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
          `${LOG_PREFIX} Scripts loading SKIPPED for instance ${instanceId.current} based on sequential loader state.`,
        );
        // eslint-disable-next-line no-console
        console.log(
          `%c[GenesysScriptLoader] ${instanceId.current} Scripts loading SKIPPED. shouldLoadScripts was false.`,
          'color: brown;',
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
            try {
              await waitForCXBus();
              if (onLoad) onLoad();
            } catch (error) {
              if (onError)
                onError(
                  error instanceof Error ? error : new Error(String(error)),
                );
            }
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
            waitForCXBus()
              .then(() => {
                if (onLoad) onLoad();
              })
              .catch((error) => {
                if (onError) onError(error);
              });
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

        // Define configureAndLoadScript inside the continueLoadProcess function
        const configureAndLoadScript = async () => {
          try {
            // 2. Set window.chatSettings (for legacy mode)
            if (chatMode === 'legacy') {
              setStatus('setting-config');
              logger.info(
                `${LOG_PREFIX} Legacy Mode: Setting window.chatSettings with legacyConfig:`,
                legacyConfig,
              );

              // Log detailed legacy configuration for troubleshooting
              if (legacyConfig) {
                logger.info(
                  `${LOG_PREFIX} Legacy Mode - Critical Configuration Details:`,
                  {
                    clickToChatEndpoint:
                      legacyConfig.clickToChatEndpoint || 'NOT SET',
                    clickToChatToken: legacyConfig.clickToChatToken
                      ? 'PRESENT'
                      : 'MISSING',
                    targetContainer: legacyConfig.targetContainer || 'NOT SET',
                    isChatAvailable: legacyConfig.isChatAvailable,
                    isChatEligibleMember: legacyConfig.isChatEligibleMember,
                    isCobrowseActive: legacyConfig.isCobrowseActive,
                    cobrowseSource: legacyConfig.cobrowseSource,
                    widgetUrl: legacyConfig.widgetUrl,
                    genesysWidgetUrl: legacyConfig.genesysWidgetUrl,
                  },
                );
              }

              if (typeof window !== 'undefined') {
                // Make sure chatMode is properly set in the legacyConfig with all required fields
                const configWithMode = {
                  ...legacyConfig,
                  chatMode: 'legacy', // Explicitly set chatMode to legacy

                  // Ensure all required user/member fields are set
                  memberFirstname:
                    legacyConfig?.memberFirstname ||
                    legacyConfig?.firstName ||
                    '',
                  memberLastName:
                    legacyConfig?.memberLastName ||
                    legacyConfig?.lastName ||
                    '',
                  subscriberID:
                    legacyConfig?.subscriberID ||
                    legacyConfig?.subscriberId ||
                    '',
                  sfx: legacyConfig?.sfx || legacyConfig?.suffix || '',
                  formattedFirstName:
                    legacyConfig?.formattedFirstName ||
                    legacyConfig?.firstName ||
                    '',
                  MEMBER_ID:
                    legacyConfig?.MEMBER_ID ||
                    `${legacyConfig?.subscriberID || legacyConfig?.subscriberId || ''}-${legacyConfig?.sfx || legacyConfig?.suffix || ''}`,
                  memberMedicalPlanID: legacyConfig?.memberMedicalPlanID || '',
                  groupId: legacyConfig?.groupId || '',
                };
                window.chatSettings = configWithMode as ChatSettings;
                // Verify after setting
                logger.info(
                  `${LOG_PREFIX} Legacy Mode: window.chatSettings set, verifying:`,
                  {
                    isSet: !!window.chatSettings,
                    keysCount: window.chatSettings
                      ? Object.keys(window.chatSettings).length
                      : 0,
                  },
                );
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

            if (chatMode === 'legacy') {
              // Legacy Mode: jQuery -> click_to_chat.js
              // click_to_chat.js is now responsible for loading widgets.min.js and full Genesys init.
              try {
                logger.info(
                  `${LOG_PREFIX} Legacy Mode: Loading jQuery (prerequisite for click_to_chat.js)...`,
                );
                await loadScriptAsync(
                  'https://code.jquery.com/jquery-3.6.0.min.js',
                  'jquery-script',
                );
                logger.info(`${LOG_PREFIX} Legacy Mode: jQuery LOADED.`);

                logger.info(
                  `${LOG_PREFIX} Legacy Mode: ATTEMPTING to load click_to_chat.js (will handle widgets.min.js)...`,
                );
                await loadScriptAsync(
                  effectiveScriptUrl, // This should be '/assets/genesys/click_to_chat.js'
                  GenesysLoadingState.scriptId, // 'genesys-chat-script'
                  false, // click_to_chat.js is often not designed to be fully async itself
                );
                logger.info(
                  `${LOG_PREFIX} Legacy Mode: click_to_chat.js script tag added/loaded. Full initialization is now up to click_to_chat.js.`,
                );

                // NO LONGER WAITING FOR CXBUS HERE - click_to_chat.js handles all Genesys readiness.
                // NO LONGER LOADING widgets.min.js HERE - click_to_chat.js handles it.

                GenesysLoadingState.scriptLoaded = true; // Mark that the entry script is loaded
                // GenesysLoadingState.cxBusReady = true; // We can't guarantee CXBus is ready yet. click_to_chat.js manages this.

                markScriptLoadComplete(true); // Mark this stage of loading as complete in sequential loader

                // The onLoad prop now signifies that click_to_chat.js has been initiated.
                // Actual Genesys readiness will be managed by click_to_chat.js.
                if (onLoad) onLoad();
              } catch (error) {
                const errMsg = `Failed during legacy script loading sequence (jQuery or click_to_chat.js entry point).`;
                logger.error(`${LOG_PREFIX} ${errMsg}`, { error });
                setStatus('error');
                setErrorMessage(
                  error instanceof Error ? error.message : String(error),
                );
                markScriptLoadComplete(false);
                if (onError)
                  onError(
                    error instanceof Error ? error : new Error(String(error)),
                  );
              }
            } else {
              // Cloud Mode (remains largely the same, but waitForCXBus might need review if cloud has similar issues)
              // Cloud mode script setup (original logic)
              const scriptElement: HTMLScriptElement =
                document.createElement('script');
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

              scriptElement.onload = () => {
                logger.info(
                  `${LOG_PREFIX} Main Genesys script element processed for ${chatMode} mode.`,
                );
                GenesysLoadingState.scriptLoaded = true;
                markScriptLoadComplete(true);
                // For cloud, CXBus might come from the main script. Polling is appropriate here.
                waitForCXBus()
                  .then(() => {
                    if (onLoad) onLoad();
                  })
                  .catch((error) => {
                    if (onError) onError(error);
                  });
              };
              scriptElement.onerror = (e) => {
                const errMsg = `Main Genesys script element failed for ${chatMode} mode.`;
                logger.error(`${LOG_PREFIX} ${errMsg}`, { errorEvent: e });
                setStatus('error');
                setErrorMessage(errMsg);
                GenesysLoadingState.scriptLoaded = false;
                GenesysLoadingState.cxBusReady = false;
                markScriptLoadComplete(false);
                if (onError) onError(new Error(errMsg));
              };
              document.head.appendChild(scriptElement);
              logger.info(
                `${LOG_PREFIX} Added script element for cloud: ${scriptElement.id}`,
              );
            }
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

    // Add early validation of chat mode to ensure it's properly enforced
    useEffect(() => {
      // Skip if we're not the active instance
      if (
        GenesysLoadingState.activeInstanceId &&
        GenesysLoadingState.activeInstanceId !== instanceId.current
      ) {
        logger.info(
          `${LOG_PREFIX} Instance ${instanceId.current} is NOT ACTIVE, skipping chat mode validation.`,
        );
        // eslint-disable-next-line no-console
        console.log(
          `%c[GenesysScriptLoader] ${instanceId.current} NOT ACTIVE (in validation useEffect). Skipping chat mode validation.`,
          'color: orange;',
        );
        return;
      }

      // Early validation of chat mode and configuration
      logger.info(
        `${LOG_PREFIX} Validating chat mode for instance ${instanceId.current}: ${chatMode}`,
      );
      // eslint-disable-next-line no-console
      console.log(
        `%c[GenesysScriptLoader] ${instanceId.current} Validating chat mode: ${chatMode}`,
        'color: blue;',
      );

      if (chatMode !== 'legacy' && chatMode !== 'cloud') {
        const errorMsg = `Invalid chat mode: ${chatMode}. Only 'legacy' or 'cloud' are supported.`;
        logger.error(`${LOG_PREFIX} ${errorMsg}`);
        setStatus('error');
        setErrorMessage(errorMsg);
        if (onError) onError(new Error(errorMsg));
        return;
      }

      // Validate config matches mode
      if (chatMode === 'legacy' && !legacyConfig) {
        const errorMsg = 'Legacy mode specified but legacyConfig is missing.';
        logger.error(`${LOG_PREFIX} ${errorMsg}`);
        setStatus('error');
        setErrorMessage(errorMsg);
        if (onError) onError(new Error(errorMsg));
        return;
      }

      if (chatMode === 'cloud' && !cloudConfig) {
        const errorMsg = 'Cloud mode specified but cloudConfig is missing.';
        logger.error(`${LOG_PREFIX} ${errorMsg}`);
        setStatus('error');
        setErrorMessage(errorMsg);
        if (onError) onError(new Error(errorMsg));
        return;
      }

      logger.info(
        `${LOG_PREFIX} Chat mode validation successful for mode: ${chatMode}`,
      );
    }, [
      chatMode,
      legacyConfig,
      cloudConfig,
      onError,
      instanceId,
      setStatus,
      setErrorMessage,
    ]);

    // Add event tracking for Genesys events
    useEffect(() => {
      if (typeof window === 'undefined') return;

      logger.info(`${LOG_PREFIX} Setting up Genesys event listeners`);

      // Track BCBST script events
      const events = [
        'genesys:loaded',
        'genesys:ready',
        'genesys:error',
        'genesys:webchat:ready',
        'genesys:webchat:opened',
        'genesys:webchat:closed',
        'genesys:webchat:error',
        'genesys:webchat:failedToStart',
      ];

      const eventHandlers: { [key: string]: (e: Event) => void } = {};

      events.forEach((eventName) => {
        const handler = (e: Event) => {
          logger.info(`${LOG_PREFIX} Event detected: ${eventName}`, {
            detail: (e as CustomEvent).detail || 'no detail',
            timestamp: new Date().toISOString(),
          });
        };

        eventHandlers[eventName] = handler;
        document.addEventListener(eventName, handler);
      });

      // Watch for DOM changes that might affect widget elements
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            const chatButtons = document.querySelectorAll(
              '.cx-widget.cx-webchat-chat-button',
            );
            if (chatButtons.length > 0 && !GenesysLoadingState.buttonDetected) {
              GenesysLoadingState.buttonDetected = true;
              logger.info(
                `${LOG_PREFIX} Chat button elements found in DOM: ${chatButtons.length}`,
                {
                  buttonClasses: Array.from(chatButtons).map(
                    (btn) => (btn as HTMLElement).className,
                  ),
                  buttonIds: Array.from(chatButtons).map(
                    (btn) => (btn as HTMLElement).id,
                  ),
                  buttonVisible: Array.from(chatButtons).map((btn) => {
                    const style = window.getComputedStyle(btn as HTMLElement);
                    return (
                      style.display !== 'none' && style.visibility !== 'hidden'
                    );
                  }),
                },
              );

              // Update button state in store
              if (typeof window !== 'undefined' && window.useChatStore) {
                window.useChatStore
                  .getState()
                  .actions.setButtonState('created');
              }
            }
          }
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });

      // Expose diagnostics for BCBST developers in development mode
      if (process.env.NODE_ENV === 'development') {
        const currentConfig =
          chatMode === 'legacy' ? legacyConfig : cloudConfig;

        window._chatDiagnostics = {
          getState: () => ({
            scriptLoaded: GenesysLoadingState.scriptLoaded,
            cxBusReady: GenesysLoadingState.cxBusReady,
            buttonDetected: GenesysLoadingState.buttonDetected,
            chatMode,
            config: currentConfig as any, // Use any type to avoid type errors
            chatLoadingState: { ...ChatLoadingState } as any,
            domState: {
              scriptElement: !!document.getElementById('genesys-chat-script'),
              cssElements: GenesysLoadingState.cssIds.map(
                (id) => !!document.getElementById(id),
              ),
              chatButton: !!document.querySelector(
                '.cx-widget.cx-webchat-chat-button',
              ),
              widgetContainer: !!document.getElementById(
                'genesys-chat-container',
              ),
            },
          }),
          forceButtonCreate: () => {
            if (window._forceChatButtonCreate)
              return window._forceChatButtonCreate();
            return false;
          },
          logCXBusState: () => {
            if (window._genesysCXBus) {
              console.log('CXBus available:', window._genesysCXBus);
              try {
                const state = window._genesysCXBus.command('WebChat.get');
                console.log('WebChat state:', state);
              } catch (e) {
                console.error('Error getting WebChat state:', e);
              }
            } else {
              console.log('CXBus not available');
            }
          },
        };
      }

      return () => {
        // Clean up event listeners
        events.forEach((eventName) => {
          document.removeEventListener(eventName, eventHandlers[eventName]);
        });

        observer.disconnect();
      };
    }, [chatMode, legacyConfig, cloudConfig]);

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
    Genesys?: (command: string, ...args: unknown[]) => unknown; // For Genesys Cloud
    _chatWidgetInstanceId?: string; // For tracking active ChatWidget instance
    checkWidgetsReady?: () => boolean; // For checking if widgets are ready
    BCBST?: {
      isChatReady?: () => boolean;
      [key: string]: any;
    };
    useChatStore?: typeof useChatStore;
  }
}
