'use client';

// CloudChatWrapper injects the Genesys Cloud Messenger SDK and manages Messenger-specific events.
// All script loading, Messenger events, and errors are logged for traceability and debugging.

import { logger } from '@/utils/logger';
import { useEffect, useState } from 'react';
import { useChatStore } from '../stores/chatStore';

// Accept chatSession as a prop
export default function CloudChatWrapper({
  chatSession,
}: {
  chatSession: any;
}) {
  const { userData, isLoading, eligibility } = useChatStore();
  const [error, setError] = useState<Error | null>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const componentId = Math.random().toString(36).substring(2, 10);

  // Log component mounting
  useEffect(() => {
    logger.info('[CloudChatWrapper] Component mounted', {
      componentId,
      hasUserData: !!userData,
      isLoading,
      hasEligibility: !!eligibility,
      timestamp: new Date().toISOString(),
    });

    return () => {
      logger.info('[CloudChatWrapper] Component unmounting', {
        componentId,
        timestamp: new Date().toISOString(),
      });
    };
  }, []);

  // Only set up chat settings when userData is available
  useEffect(() => {
    // Don't proceed if userData is not available
    if (!userData || Object.keys(userData).length === 0) {
      logger.info('[CloudChatWrapper] Waiting for userData to be available', {
        componentId,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    logger.info('[CloudChatWrapper] userData is available, setting up chat', {
      componentId,
      userDataKeys: Object.keys(userData),
      timestamp: new Date().toISOString(),
    });

    try {
      // Build chatSettings from env and userData
      window.chatSettings = {
        bootstrapUrl: process.env.NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL || '',
        widgetUrl: process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL || '',
        clickToChatJs: process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS || '',
        clickToChatEndpoint:
          process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT || '',
        chatTokenEndpoint: process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT || '',
        coBrowseEndpoint:
          process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT || '',
        opsPhone: process.env.NEXT_PUBLIC_OPS_PHONE || '',
        opsPhoneHours: process.env.NEXT_PUBLIC_OPS_HOURS || '',
        ...userData,
      };

      // Log all config values to catch [object Object] issues
      Object.entries(window.chatSettings).forEach(([key, value]) => {
        if (typeof value === 'object') {
          logger.error('[CloudChatWrapper] Config key is an object', {
            key,
            value,
            timestamp: new Date().toISOString(),
          });
        }
      });

      logger.info('[CloudChatWrapper] chatSettings created', {
        componentId,
        hasSettings: !!window.chatSettings,
        settingsKeys: Object.keys(window.chatSettings),
        timestamp: new Date().toISOString(),
      });

      setInitialized(true);
    } catch (err) {
      logger.error('[CloudChatWrapper] Error setting up chat settings', {
        componentId,
        error: err,
        timestamp: new Date().toISOString(),
      });
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to set up chat settings'),
      );
    }
  }, [userData, componentId]);

  // Load scripts only after settings are initialized
  useEffect(() => {
    if (!initialized) {
      return;
    }

    const bootstrapUrl = window.chatSettings?.bootstrapUrl || '';
    const widgetUrl = window.chatSettings?.widgetUrl || '';

    if (!bootstrapUrl || !widgetUrl) {
      logger.error('[CloudChatWrapper] Missing required URLs for scripts', {
        componentId,
        hasBootstrapUrl: !!bootstrapUrl,
        hasWidgetUrl: !!widgetUrl,
        timestamp: new Date().toISOString(),
      });
      setError(new Error('Missing required script URLs'));
      return;
    }

    logger.info('[CloudChatWrapper] Loading Genesys bootstrap script', {
      componentId,
      bootstrapUrl,
      widgetUrl,
      timestamp: new Date().toISOString(),
    });

    try {
      const bootstrapScript = document.createElement('script');
      bootstrapScript.src = bootstrapUrl;
      bootstrapScript.async = true;
      bootstrapScript.onload = () => {
        logger.info('[CloudChatWrapper] Genesys bootstrap loaded', {
          componentId,
          timestamp: new Date().toISOString(),
        });

        try {
          const widgetScript = document.createElement('script');
          widgetScript.src = widgetUrl;
          widgetScript.async = true;
          widgetScript.onload = () => {
            logger.info('[CloudChatWrapper] Genesys widgets loaded', {
              componentId,
              timestamp: new Date().toISOString(),
            });
            setScriptsLoaded(true);
          };
          widgetScript.onerror = (e) => {
            logger.error('[CloudChatWrapper] Failed to load widgets script', {
              componentId,
              error: e,
              timestamp: new Date().toISOString(),
            });
            setError(new Error('Failed to load Genesys widgets script'));
          };
          document.body.appendChild(widgetScript);
        } catch (err) {
          logger.error('[CloudChatWrapper] Error loading widget script', {
            componentId,
            error: err,
            timestamp: new Date().toISOString(),
          });
          setError(
            err instanceof Error
              ? err
              : new Error('Failed to load widget script'),
          );
        }
      };
      bootstrapScript.onerror = (e) => {
        logger.error('[CloudChatWrapper] Failed to load bootstrap script', {
          componentId,
          error: e,
          timestamp: new Date().toISOString(),
        });
        setError(new Error('Failed to load Genesys bootstrap script'));
      };
      document.body.appendChild(bootstrapScript);

      // Clean up function to remove scripts
      return () => {
        try {
          if (document.body.contains(bootstrapScript)) {
            document.body.removeChild(bootstrapScript);
          }

          const widgetScriptEl = document.querySelector(
            `script[src="${widgetUrl}"]`,
          );
          if (widgetScriptEl && document.body.contains(widgetScriptEl)) {
            document.body.removeChild(widgetScriptEl);
          }

          logger.info('[CloudChatWrapper] Scripts cleaned up', {
            componentId,
            timestamp: new Date().toISOString(),
          });
        } catch (err) {
          logger.error('[CloudChatWrapper] Error cleaning up scripts', {
            componentId,
            error: err,
            timestamp: new Date().toISOString(),
          });
        }
      };
    } catch (err) {
      logger.error('[CloudChatWrapper] Error creating script elements', {
        componentId,
        error: err,
        timestamp: new Date().toISOString(),
      });
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to create script elements'),
      );
    }
  }, [initialized, componentId]);

  // Set up openGenesysChat helper after scripts are loaded
  useEffect(() => {
    if (!scriptsLoaded) {
      return;
    }

    logger.info('[CloudChatWrapper] Scripts loaded, setting up helpers', {
      componentId,
      timestamp: new Date().toISOString(),
    });

    try {
      // Provide openGenesysChat logic
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
      logger.error('[CloudChatWrapper] Error setting up helper functions', {
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
      if (window.chatSettings) {
        delete window.chatSettings;
      }
    };
  }, [scriptsLoaded, componentId]);

  // Handle loading states
  if (isLoading) {
    return <div>Loading chat configuration...</div>;
  }

  // Handle error states
  if (error) {
    return <div>Chat error: {error.message}</div>;
  }

  // Handle missing eligibility or user data
  if (!eligibility || !userData) {
    return <div>Chat configuration not available</div>;
  }

  // Don't render if chat is not open
  if (!chatSession?.isOpen) {
    return null;
  }

  // Example: Render a simple chat UI using chatSession state and methods
  return (
    <div className="cloud-chat-wrapper">
      {chatSession.isChatActive ? (
        <div>
          <div>Chat is active (Cloud)</div>
          <button onClick={chatSession.endChat}>End Chat</button>
          {/* Add message input, send, etc. as needed */}
        </div>
      ) : (
        <button onClick={chatSession.startChat}>Start Chat</button>
      )}
      {chatSession.isLoading && <div>Loading...</div>}
      {chatSession.error && (
        <div className="error">
          {typeof chatSession.error === 'string'
            ? chatSession.error
            : chatSession.error.message || JSON.stringify(chatSession.error)}
        </div>
      )}
    </div>
  );
}
