'use client';
import '@/../public/assets/genesys/plugins/widgets.min.css';
import { chatSelectors, useChatStore } from '@/app/chat/stores/chatStore';
import { GenesysScript } from '@/app/components/GenesysScript';
import { logger } from '@/utils/logger';
import { useEffect } from 'react';
import { useChatSetup } from '../hooks/useChatSetup';
import {
  hideInquiryDropdown,
  injectNewMessageBadge,
  injectPlanSwitcher,
} from '../utils/chatDomUtils';
import { configureGenesysWidgets } from '../utils/chatUtils';
// ChatUI is deprecated and returns null anyway

/**
 * Legacy chat implementation wrapper
 * Significantly simplified with custom hooks and shared UI components
 */
export function LegacyChatWrapper({}) {
  // Use the shared setup hook for common functionality
  const {
    userData,
    error,
    scriptsLoaded,
    setScriptsLoaded,
    componentId,
    chatData,
    isLoading,
  } = useChatSetup('legacy');

  const chatMode = chatSelectors.chatMode(useChatStore.getState());

  // Apply DOM customizations after scripts are loaded
  useEffect(() => {
    if (!scriptsLoaded) return;

    logger.info(
      '[LegacyChatWrapper] Scripts loaded, applying DOM customizations',
      {
        componentId,
        timestamp: new Date().toISOString(),
      },
    );

    try {
      // Apply DOM customizations in a single place
      hideInquiryDropdown();
      injectNewMessageBadge();
      injectPlanSwitcher();

      logger.info('[LegacyChatWrapper] Chat DOM customizations applied', {
        componentId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('[LegacyChatWrapper] Failed to apply DOM customizations', {
        componentId,
        error,
        timestamp: new Date().toISOString(),
      });
    }
  }, [scriptsLoaded, componentId]);

  // Setup chat settings and options for Genesys
  useEffect(() => {
    // Skip if not in legacy mode or if scripts aren't loaded or missing userData
    if (chatMode !== 'legacy' || !scriptsLoaded || !userData) return;

    logger.info('[LegacyChatWrapper] Setting up Genesys widgets', {
      componentId,
      timestamp: new Date().toISOString(),
    });

    // Note: window.openGenesysChat is now handled by chatUtils.openGenesysChat
    // and installed by GenesysScript component

    // Configure Genesys widgets if available using utility function
    configureGenesysWidgets();

    // Cleanup on unmount
    return () => {
      if (window.CXBus?.command) {
        try {
          window.CXBus.command('WebChat.close');
        } catch (e) {
          logger.error('[LegacyChatWrapper] Error closing chat session', {
            error: e,
            timestamp: new Date().toISOString(),
          });
        }
      }
    };
  }, [scriptsLoaded, componentId, chatMode, userData]);

  // Note: Chat settings are now managed by chatStore and the centralized chatSettings state
  const settingsInjected = true; // Always consider settings injected since managed by store

  // Handle loading and error states with early returns
  if (isLoading || !settingsInjected) {
    return null; // Don't render anything during loading
  }

  if (error) {
    logger.error('[LegacyChatWrapper] Error loading chat', {
      error,
      componentId,
      timestamp: new Date().toISOString(),
    });
    return null;
  }

  if (!chatData) {
    logger.warn('[LegacyChatWrapper] Chat configuration not available');
    return null;
  }

  return (
    <>
      {settingsInjected && (
        <>
          <GenesysScript
            deploymentId={process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID || ''}
            onScriptLoaded={() => {
              logger.info(
                '[LegacyChatWrapper] GenesysScript onScriptLoaded callback fired',
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
    </>
  );
}
