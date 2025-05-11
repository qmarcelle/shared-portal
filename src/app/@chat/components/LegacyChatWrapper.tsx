'use client';
console.log('[Genesys] 💥 Legacy wrapper mounted');
import '@/../public/assets/genesys/plugins/widgets.min.css';
import { useChatStore } from '@/app/@chat/stores/chatStore';
import { GenesysScript } from '@/app/components/GenesysScript';
import { logger } from '@/utils/logger';
import { useEffect, useState } from 'react';
import {
  hideInquiryDropdown,
  injectNewMessageBadge,
  injectPlanSwitcher,
} from '../utils/chatDomUtils';

/**
 * Legacy chat implementation wrapper
 * Loads Genesys chat.js script with beforeInteractive strategy
 * Ensures proper integration with click_to_chat.js implementation
 */
export default function LegacyChatWrapper({
  chatSession,
}: {
  chatSession: any;
}) {
  // Get chat store state with proper typing
  const {
    userData,
    formInputs,
    chatGroup,
    isPlanSwitcherLocked,
    isLoading,
    eligibility,
  } = useChatStore();
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [genesysReady, setGenesysReady] = useState(false);
  const componentId = Math.random().toString(36).substring(2, 10);
  const chatMode = useChatStore((state) => state.chatMode);
  const [settingsInjected, setSettingsInjected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Log component mounting with detailed state info
  useEffect(() => {
    logger.info('[LegacyChatWrapper] Component mounted', {
      componentId,
      hasUserData: !!userData,
      hasFormInputs: Array.isArray(formInputs) && formInputs.length > 0,
      chatGroup,
      isLoading,
      chatMode,
      timestamp: new Date().toISOString(),
    });
    return () => {
      logger.info('[LegacyChatWrapper] Component unmounting', {
        componentId,
        timestamp: new Date().toISOString(),
      });
    };
  }, []);

  // Debug log for current values
  useEffect(() => {
    if (typeof window !== 'undefined' && window.chatSettings) {
      logger.info('[LegacyChatWrapper] Current chatSettings', {
        bootstrapUrl: window.chatSettings.bootstrapUrl,
        widgetUrl: window.chatSettings.widgetUrl,
        clickToChatJs: window.chatSettings.clickToChatJs,
        clickToChatEndpoint: window.chatSettings.clickToChatEndpoint,
        chatTokenEndpoint: window.chatSettings.chatTokenEndpoint,
        coBrowseEndpoint: window.chatSettings.coBrowseEndpoint,
        timestamp: new Date().toISOString(),
      });
    }
  }, []);

  // Listen for the genesys-ready event from the main scripts
  useEffect(() => {
    const handleGenesysReady = () => {
      logger.info(
        '[LegacyChatWrapper] Genesys scripts fully loaded and ready',
        {
          componentId,
          timestamp: new Date().toISOString(),
        },
      );
      setGenesysReady(true);
      setScriptsLoaded(true);
    };

    // Register listener for the custom event
    window.addEventListener('genesys-ready', handleGenesysReady);

    // Backup: also check for existing _genesys.widgets object
    if (window._genesys?.widgets) {
      logger.info('[LegacyChatWrapper] _genesys.widgets already available', {
        componentId,
        timestamp: new Date().toISOString(),
      });
      setGenesysReady(true);
      setScriptsLoaded(true);
    }

    return () => {
      window.removeEventListener('genesys-ready', handleGenesysReady);
    };
  }, []);

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

    const applyCustomizations = () => {
      try {
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
        setError(
          error instanceof Error
            ? error
            : new Error('Failed to apply chat customizations'),
        );
      }
    };

    applyCustomizations();
    const timer = setTimeout(applyCustomizations, 1000);
    return () => clearTimeout(timer);
  }, [scriptsLoaded, componentId]);

  // Inject chatSettings once for legacy mode - ONLY when userData is available
  useEffect(() => {
    // Don't proceed if userData is not available
    if (!userData || Object.keys(userData).length === 0) {
      logger.info('[LegacyChatWrapper] Waiting for userData to be available', {
        componentId,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    logger.info('[LegacyChatWrapper] userData is available, setting up chat', {
      componentId,
      userDataKeys: Object.keys(userData),
      timestamp: new Date().toISOString(),
    });

    if (!settingsInjected) {
      try {
        window.chatSettings = {
          widgetUrl: process.env.NEXT_PUBLIC_LEGACY_CHAT_URL!,
          clickToChatJs: process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS!,
          clickToChatEndpoint: process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT!,
          chatTokenEndpoint: process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT!,
          coBrowseEndpoint: process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT!,
          opsPhone: process.env.NEXT_PUBLIC_OPS_PHONE!,
          opsPhoneHours: process.env.NEXT_PUBLIC_OPS_HOURS!,
        };

        // Log all config values to catch [object Object] issues
        Object.entries(window.chatSettings).forEach(([key, value]) => {
          if (typeof value === 'object') {
            logger.error('[LegacyChatWrapper] Config key is an object', {
              key,
              value,
              timestamp: new Date().toISOString(),
            });
          }
        });

        logger.info('[LegacyChatWrapper] chatSettings injected', {
          componentId,
          hasSettings: !!window.chatSettings,
          timestamp: new Date().toISOString(),
        });

        setSettingsInjected(true);
      } catch (error) {
        logger.error('[LegacyChatWrapper] Error injecting chat settings', {
          componentId,
          error,
          timestamp: new Date().toISOString(),
        });
        setError(
          error instanceof Error
            ? error
            : new Error('Failed to inject chat settings'),
        );
      }
    }
  }, [userData, settingsInjected, componentId]);

  // Setup chat settings and options - ONLY when userData and genesysReady are both available
  useEffect(() => {
    // Skip if not in legacy mode or if still loading
    if (chatMode !== 'legacy') return;

    // Skip if userData or genesys isn't ready
    if (!userData || !genesysReady) {
      logger.info(
        '[LegacyChatWrapper] Waiting for userData and genesys to be ready',
        {
          componentId,
          hasUserData: !!userData,
          genesysReady,
          timestamp: new Date().toISOString(),
        },
      );
      return;
    }

    // Defensive: close any previous chat session
    if (typeof window.CXBus?.command === 'function') {
      try {
        window.CXBus.command('WebChat.close');
      } catch (e) {
        logger.error(
          '[LegacyChatWrapper] Error closing previous chat session',
          {
            componentId,
            error: e,
            timestamp: new Date().toISOString(),
          },
        );
      }
    }

    logger.info('[LegacyChatWrapper] Setting up chat with userData', {
      componentId,
      hasUserData: !!userData,
      timestamp: new Date().toISOString(),
    });

    // Safely access and update chatSettings
    if (typeof window !== 'undefined' && window.chatSettings) {
      try {
        const chatSettings = window.chatSettings;
        window.chatSettings = {
          ...chatSettings,
          ...userData,
        };

        // Check for required fields
        const requiredFields = [
          'clickToChatEndpoint',
          'chatTokenEndpoint',
          'opsPhone',
          'opsPhoneHours',
        ];

        const missingFields = requiredFields.filter(
          (key) =>
            !window.chatSettings ||
            !window.chatSettings[key] ||
            window.chatSettings[key] === '',
        );

        if (missingFields.length > 0) {
          logger.warn(
            '[LegacyChatWrapper] Missing required chatSettings fields',
            {
              componentId,
              missingFields,
              timestamp: new Date().toISOString(),
            },
          );
        } else {
          logger.info(
            '[LegacyChatWrapper] All required chatSettings fields are present',
            {
              componentId,
              timestamp: new Date().toISOString(),
            },
          );
        }

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

        // If Genesys is ready, enable the chat button
        if (window._genesys?.widgets?.webchat) {
          logger.info('[LegacyChatWrapper] Enabling chat button', {
            componentId,
            timestamp: new Date().toISOString(),
          });

          window._genesys.widgets.webchat.chatButton = {
            enabled: true,
            openDelay: 100,
            effectDuration: 200,
            hideDuringInvite: false,
            template:
              '<div class="cx-widget cx-webchat-chat-button cx-side-button">Chat Now</div>',
          };

          window._genesys.widgets.webchat.position = {
            bottom: { px: 20 },
            right: { px: 20 },
            width: { pct: 50 },
            height: { px: 400 },
          };
        }
      } catch (error) {
        logger.error('[LegacyChatWrapper] Error configuring chat settings', {
          componentId,
          error,
          timestamp: new Date().toISOString(),
        });
        setError(
          error instanceof Error
            ? error
            : new Error('Failed to configure chat settings'),
        );
      }
    } else {
      logger.warn('[LegacyChatWrapper] window.chatSettings is undefined', {
        componentId,
        timestamp: new Date().toISOString(),
      });
    }

    return () => {
      // Only clean up our custom functions, not the scripts
      if (window.openGenesysChat) delete window.openGenesysChat;
    };
  }, [userData, componentId, chatMode, genesysReady]);

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

  return (
    <>
      <GenesysScript
        deploymentId={process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID || ''}
      />
      <div className="legacy-chat-wrapper">
        {chatSession.isChatActive ? (
          <div>
            <div>Chat is active (Legacy)</div>
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
    </>
  );
}
