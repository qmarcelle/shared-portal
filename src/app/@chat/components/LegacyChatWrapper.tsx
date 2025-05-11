'use client';
console.log('[Genesys] 💥 Legacy wrapper mounted');
import '@/../public/assets/genesys/plugins/widgets.min.css';
import { chatSelectors, useChatStore } from '@/app/@chat/stores/chatStore';
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
import { ChatUI } from './ChatUI';

/**
 * Legacy chat implementation wrapper
 * Significantly simplified with custom hooks and shared UI components
 */
export default function LegacyChatWrapper({
  chatSession,
}: {
  chatSession: any;
}) {
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

    // Setup openGenesysChat helper function
    window.openGenesysChat = () => {
      if (window.CXBus && typeof window.CXBus.command === 'function') {
        try {
          window.CXBus.command('WebChat.open');
          logger.info('[LegacyChatWrapper] WebChat.open command sent', {
            componentId,
            timestamp: new Date().toISOString(),
          });
        } catch (e) {
          logger.error('[LegacyChatWrapper] Error opening legacy chat', {
            componentId,
            error: e,
            timestamp: new Date().toISOString(),
          });
        }
      }
    };

    // Configure Genesys widgets if available using utility function
    configureGenesysWidgets();

    // Cleanup on unmount
    return () => {
      if (window.openGenesysChat) delete window.openGenesysChat;
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

  // Handle loading and error states with early returns
  if (isLoading) {
    return <div>Loading chat configuration...</div>;
  }

  if (error) {
    return <div>Chat error: {error.message}</div>;
  }

  if (!chatData) {
    return <div>Chat configuration not available</div>;
  }

  return (
    <>
      <GenesysScript
        deploymentId={process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID || ''}
        userData={userData || {}}
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
      <ChatUI chatSession={chatSession} mode="legacy" />
    </>
  );
}
