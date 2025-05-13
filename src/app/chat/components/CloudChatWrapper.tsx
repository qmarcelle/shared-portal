'use client';

// CloudChatWrapper injects the Genesys Cloud Messenger SDK and manages Messenger-specific events.
// Simplified using custom hooks and shared UI components

import { GenesysScript } from '@/app/components/GenesysScript';
import { logger } from '@/utils/logger';
import { useEffect } from 'react';
import { useChatSetup } from '../hooks/useChatSetup';
// ChatUI is deprecated and returns null anyway

export function CloudChatWrapper() {
  // Use the shared setup hook for common functionality
  const {
    userData,
    error,
    scriptsLoaded,
    setScriptsLoaded,
    componentId,
    chatData,
    isLoading,
  } = useChatSetup('cloud');

  // Set up Genesys Messenger functionality after scripts are loaded
  useEffect(() => {
    if (!scriptsLoaded) return;

    logger.info('[CloudChatWrapper] Scripts loaded, setting up Messenger', {
      componentId,
      timestamp: new Date().toISOString(),
    });

    // Note: window.openGenesysChat is now handled by chatUtils.openGenesysChat
    // and installed by GenesysScript component
  }, [scriptsLoaded, componentId]);

  // Note: Chat settings are now managed by chatStore and the centralized chatSettings state
  const settingsInjected = true; // Always consider settings injected since managed by store

  // Handle loading and error states with early returns
  if (isLoading || !settingsInjected) {
    return null; // Don't render anything during loading
  }

  if (error) {
    logger.error('[CloudChatWrapper] Error loading chat', {
      error,
      componentId,
      timestamp: new Date().toISOString(),
    });
    return null;
  }

  if (!chatData) {
    logger.warn('[CloudChatWrapper] Chat configuration not available');
    return null;
  }

  return (
    <div className="cloud-chat-wrapper">
      {/* Use GenesysScript to load necessary scripts */}
      {settingsInjected && (
        <>
          <GenesysScript
            deploymentId={process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID || ''}
            onScriptLoaded={() => {
              logger.info(
                '[CloudChatWrapper] GenesysScript onScriptLoaded callback fired',
                {
                  componentId,
                  timestamp: new Date().toISOString(),
                },
              );
              setScriptsLoaded(true);
            }}
          />

          {/* Genesys scripts handle the UI injection, no visual wrapper needed */}
        </>
      )}
    </div>
  );
}

export default CloudChatWrapper;
