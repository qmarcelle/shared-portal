'use client';

// CloudChatWrapper injects the Genesys Cloud Messenger SDK and manages Messenger-specific events.
// Simplified using custom hooks and shared UI components

import { GenesysScript } from '@/app/components/GenesysScript';
import { logger } from '@/utils/logger';
import { useEffect } from 'react';
import { useChatSetup } from '../hooks/useChatSetup';
import { ChatUI } from './ChatUI';

export default function CloudChatWrapper({
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
  } = useChatSetup('cloud');

  // Set up Genesys Messenger functionality after scripts are loaded
  useEffect(() => {
    if (!scriptsLoaded) return;

    logger.info('[CloudChatWrapper] Scripts loaded, setting up Messenger', {
      componentId,
      timestamp: new Date().toISOString(),
    });

    try {
      // Configure Genesys Cloud Messenger
      window.openGenesysChat = () => {
        if (window.Genesys) {
          try {
            window.Genesys('command', 'Messenger.open');
            logger.info('[CloudChatWrapper] Messenger.open command sent', {
              componentId,
              timestamp: new Date().toISOString(),
            });
          } catch (e) {
            logger.error('[CloudChatWrapper] Error opening Genesys Messenger', {
              componentId,
              error: e,
              timestamp: new Date().toISOString(),
            });
          }
        } else {
          logger.warn('[CloudChatWrapper] Genesys not available yet', {
            componentId,
            timestamp: new Date().toISOString(),
          });
        }
      };
    } catch (err) {
      logger.error('[CloudChatWrapper] Error setting up Genesys Messenger', {
        componentId,
        error: err,
        timestamp: new Date().toISOString(),
      });
    }

    return () => {
      // Clean up helper functions
      if (window.openGenesysChat) {
        delete window.openGenesysChat;
      }
    };
  }, [scriptsLoaded, componentId]);

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
    <div className="cloud-chat-wrapper">
      {/* Use GenesysScript to load necessary scripts */}
      <GenesysScript
        deploymentId={process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID || ''}
        userData={userData || {}}
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

      <ChatUI chatSession={chatSession} mode="cloud" />
    </div>
  );
}
