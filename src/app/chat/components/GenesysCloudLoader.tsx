'use client';

/**
 * @file GenesysCloudLoader.tsx
 * @description This component handles loading the Genesys Cloud chat implementation
 * based on the configuration in CHAT_INTEGRATION.md.
 */

import { generateGenesysCloudScript } from '@/app/chat/config/genesysCloudConfig';
import { logger } from '@/utils/logger';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useChatStore } from '../stores/chatStore';

const LOG_PREFIX = '[GenesysCloudLoader]';

interface GenesysCloudLoaderProps {
  /**
   * Whether to use the production deployment ID
   */
  useProdDeployment?: boolean;

  /**
   * Callback when script is loaded successfully
   */
  onLoad?: () => void;

  /**
   * Callback when script loading fails
   */
  onError?: (error: Error) => void;

  /**
   * Additional user data to pass to the widget
   */
  userData?: Record<string, string>;

  /**
   * Whether the chat is actually enabled
   */
  isChatActuallyEnabled?: boolean;
}

/**
 * Component that loads the Genesys Cloud chat widget
 */
export function GenesysCloudLoader({
  useProdDeployment = false,
  onLoad,
  onError,
  userData,
  isChatActuallyEnabled,
}: GenesysCloudLoaderProps) {
  const [error, setError] = useState<Error | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const initialized = useRef(false);

  // Get user data from chat store if available
  const storeChatData = useChatStore((state) => state.config.chatData);

  // Create preconnect link for performance optimization
  const createPreconnectLink = useCallback(() => {
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://apps.usw2.pure.cloud';
    preconnect.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect);
  }, []);

  // **CLOUD FLOW STEP 14** - Handle successful script load and Genesys initialization
  const handleScriptLoad = useCallback(() => {
    logger.info(
      `${LOG_PREFIX} [CLOUD FLOW] Genesys Cloud script loaded successfully. Establishing messenger connection.`,
    );

    // **CLOUD FLOW STEP 15** - Register callback for when Genesys messenger is ready
    if (window.Genesys) {
      window.Genesys?.('command', 'messenger.ready', () => {
        logger.info(
          `${LOG_PREFIX} [CLOUD FLOW] Genesys messenger is ready and connected. Chat widget is now active.`,
        );

        // **CLOUD FLOW STEP 16** - Apply user context and member data to chat session
        if (userData || storeChatData) {
          const combinedUserData = {
            ...(userData || {}),
            ...(storeChatData || {}),
          };

          if (Object.keys(combinedUserData).length > 0) {
            logger.info(
              `${LOG_PREFIX} [CLOUD FLOW] Setting member context data for personalized chat experience.`,
              {
                keys: Object.keys(combinedUserData),
              },
            );
            window.Genesys?.('command', 'messenger.updateUser', {
              customAttributes: combinedUserData,
            });
          }
        }

        // **CLOUD FLOW COMPLETE** - Chat system fully operational
        logger.info(
          `${LOG_PREFIX} [CLOUD FLOW] Chat system fully operational. Members can now initiate chat sessions.`,
        );
        if (onLoad) onLoad();
      });
    } else {
      logger.warn(
        `${LOG_PREFIX} [CLOUD FLOW] window.Genesys not available after script load. Chat may not function properly.`,
      );
      if (onLoad) onLoad();
    }
  }, [userData, storeChatData, onLoad]);

  // Handle script loading errors
  const handleScriptError = useCallback(
    (event: Event | string) => {
      const errorMsg = event instanceof Event ? 'Script loading error' : event;
      const scriptError = new Error(`${LOG_PREFIX} ${errorMsg}`);
      logger.error(`${LOG_PREFIX} Failed to load Genesys Cloud script`, {
        error: scriptError,
      });
      setError(scriptError);
      if (onError) onError(scriptError);
    },
    [onError],
  );

  // Create and configure the Genesys script element
  const createGenesysScript = useCallback(
    (scriptContent: string) => {
      const script = document.createElement('script');
      script.id = 'genesys-cloud-script';
      script.type = 'text/javascript';
      script.async = true;
      script.textContent = scriptContent;
      script.onload = handleScriptLoad;
      script.onerror = handleScriptError;
      return script;
    },
    [handleScriptLoad, handleScriptError],
  );

  // **CLOUD FLOW STEP 10** - Main Genesys Cloud script loading and injection
  const loadGenesysCloudScript = useCallback(() => {
    logger.info(
      `${LOG_PREFIX} [CLOUD FLOW] Starting Genesys Cloud script loading. This will inject messenger and establish chat connectivity.`,
      {
        useProdDeployment,
        isChatActuallyEnabled,
        hasUserData: !!userData,
      },
    );

    try {
      // Check if script already exists to prevent duplicate loading
      const existingScript = document.getElementById('genesys-cloud-script');
      if (existingScript) {
        logger.info(
          `${LOG_PREFIX} [CLOUD FLOW] Genesys Cloud script already exists. Skipping duplicate injection.`,
        );
        if (onLoad) onLoad();
        return;
      }

      // **CLOUD FLOW STEP 11** - Generate Genesys Cloud messenger script from configuration
      logger.info(
        `${LOG_PREFIX} [CLOUD FLOW] Generating Genesys messenger script using deployment configuration.`,
      );
      const scriptContent = generateGenesysCloudScript(useProdDeployment);

      // **CLOUD FLOW STEP 12** - Create and configure script element for injection
      const script = createGenesysScript(scriptContent);

      // **CLOUD FLOW STEP 13** - Inject script into document head
      logger.info(
        `${LOG_PREFIX} [CLOUD FLOW] Injecting Genesys messenger script into document. Waiting for messenger.ready event.`,
      );
      document.head.appendChild(script);
      scriptRef.current = script;

      // **PERFORMANCE OPTIMIZATION** - Add DNS preconnect for faster resource loading
      createPreconnectLink();

      logger.info(
        `${LOG_PREFIX} [CLOUD FLOW] Script injection complete. Flow continues: Script Load → messenger.ready → Chat Widget Active.`,
      );
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error(
        `${LOG_PREFIX} [CLOUD FLOW] Script initialization failed. Chat system will be unavailable.`,
        {
          error: err,
        },
      );
      setError(err);
      if (onError) onError(err);
    }
  }, [
    useProdDeployment,
    onLoad,
    onError,
    createGenesysScript,
    createPreconnectLink,
    isChatActuallyEnabled,
    userData,
  ]);

  // Effect to load the Genesys Cloud script
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (isChatActuallyEnabled === false) {
      logger.info(
        `${LOG_PREFIX} Will NOT load scripts because isChatActuallyEnabled is false.`,
      );
      return;
    }

    loadGenesysCloudScript();

    // Cleanup function
    return () => {
      // We don't remove the script on unmount as it's a global resource
      // that other components might depend on
      logger.info(`${LOG_PREFIX} Component unmounting`);
    };
  }, [loadGenesysCloudScript, isChatActuallyEnabled]);

  // Show loading/error UI if needed
  if (error) {
    return (
      <div className="genesys-cloud-error">
        Error loading chat: {error.message}
      </div>
    );
  }

  // No need to return any visible UI - this is just a script loader
  return null;
}

// Add TypeScript interface for Genesys Cloud global
declare global {
  interface Window {
    // Use more specific type for Genesys to avoid conflicts
    Genesys?: (command: string, ...args: unknown[]) => unknown;
    _genesysJs?: string;
  }
}

export default GenesysCloudLoader;
