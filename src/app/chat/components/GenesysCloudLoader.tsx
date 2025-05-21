'use client';

/**
 * @file GenesysCloudLoader.tsx
 * @description This component handles loading the Genesys Cloud chat implementation
 * based on the configuration in CHAT_INTEGRATION.md.
 */

import { generateGenesysCloudScript } from '@/app/chat/config/genesysCloudConfig';
import { logger } from '@/utils/logger';
import { useEffect, useRef, useState } from 'react';
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const initialized = useRef(false);

  // Get user data from chat store if available
  const storeChatData = useChatStore((state) => state.config.chatData);

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

    const loadGenesysCloudScript = () => {
      logger.info(`${LOG_PREFIX} Loading Genesys Cloud script`, {
        useProdDeployment,
      });

      try {
        // Check if script already exists
        const existingScript = document.getElementById('genesys-cloud-script');
        if (existingScript) {
          logger.info(`${LOG_PREFIX} Genesys Cloud script already exists`);
          setIsLoaded(true);
          if (onLoad) onLoad();
          return;
        }

        // Create script element
        const script = document.createElement('script');
        script.id = 'genesys-cloud-script';
        script.type = 'text/javascript';
        script.async = true;

        // Generate script content from the cloud configuration
        const scriptContent = generateGenesysCloudScript(useProdDeployment);
        script.textContent = scriptContent;

        // Set up load and error handlers
        const handleLoad = () => {
          logger.info(`${LOG_PREFIX} Genesys Cloud script loaded successfully`);
          setIsLoaded(true);

          // Register callback for when Genesys is ready
          if (window.Genesys) {
            // Add optional chaining and type check to avoid TypeScript error
            window.Genesys?.('command', 'messenger.ready', () => {
              logger.info(`${LOG_PREFIX} Genesys messenger is ready`);

              // Set user data if available
              if (userData || storeChatData) {
                const combinedUserData = {
                  ...(userData || {}),
                  ...(storeChatData || {}),
                };

                if (Object.keys(combinedUserData).length > 0) {
                  logger.info(`${LOG_PREFIX} Setting user data`, {
                    keys: Object.keys(combinedUserData),
                  });
                  window.Genesys?.('command', 'messenger.updateUser', {
                    customAttributes: combinedUserData,
                  });
                }
              }

              if (onLoad) onLoad();
            });
          } else {
            logger.warn(
              `${LOG_PREFIX} window.Genesys not available after script load`,
            );
            if (onLoad) onLoad();
          }
        };

        const handleError = (event: Event | string) => {
          const errorMsg =
            event instanceof Event ? 'Script loading error' : event;
          const scriptError = new Error(`${LOG_PREFIX} ${errorMsg}`);
          logger.error(`${LOG_PREFIX} Failed to load Genesys Cloud script`, {
            error: scriptError,
          });
          setError(scriptError);
          if (onError) onError(scriptError);
        };

        script.onload = handleLoad;
        script.onerror = (event) => handleError(event);

        // Append script to document
        document.head.appendChild(script);
        scriptRef.current = script;

        // Add preconnect for performance
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = 'https://apps.usw2.pure.cloud';
        preconnect.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect);

        logger.info(`${LOG_PREFIX} Genesys Cloud script appended to document`);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        logger.error(`${LOG_PREFIX} Error during script initialization`, {
          error: err,
        });
        setError(err);
        if (onError) onError(err);
      }
    };

    loadGenesysCloudScript();

    // Cleanup function
    return () => {
      // We don't remove the script on unmount as it's a global resource
      // that other components might depend on
      logger.info(`${LOG_PREFIX} Component unmounting`);
    };
  }, [
    onLoad,
    onError,
    useProdDeployment,
    userData,
    storeChatData,
    isChatActuallyEnabled,
  ]);

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
