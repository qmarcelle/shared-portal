'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import {
  configureCPChatAPI,
  cpChatAPI,
  createChatPayload,
} from '../services/api/cp-chat-api';
import { useChatStore } from '../stores/chatStore';
import { ChatError } from '../types/errors';
import { ChatPayload } from '../types/types';
import { ChatContainer } from './core/ChatContainer';
import { ChatContextProvider } from './providers/ChatContextProvider';

// Extend Window interface to include our chat payload
declare global {
  interface Window {
    __BCBST_CHAT_PAYLOAD?: ChatPayload;
  }
}

/**
 * Dashboard Chat Widget component that integrates with NextAuth and BCBST API
 * This component automatically initializes the chat based on user session
 */
export function DashboardChatWidget() {
  const { data: session, status } = useSession();
  const { setError, closeChat } = useChatStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const isCloudEligible = useRef(false);

  useEffect(() => {
    // Only initialize when session is loaded
    if (status !== 'authenticated' || !session?.user) {
      return;
    }

    const initializeChat = async () => {
      try {
        setIsLoading(true);

        // Configure BCBST API with session data
        configureCPChatAPI({
          headers: {
            'X-Portal-Login': session.user.id,
            Authorization: `Bearer ${(session as any).token || ''}`,
          },
        });

        // Get member ID from session
        const memberId = session.user.currUsr?.plan?.memCk;
        if (!memberId) {
          throw new ChatError('Member ID not found in session', 'AUTH_ERROR');
        }

        // Get chat info from BCBST API
        const chatInfo = await cpChatAPI.getChatInfo(memberId);

        // Determine if user is eligible for cloud chat
        isCloudEligible.current = chatInfo.cloudChatEligible;

        if (!chatInfo.chatAvailable) {
          throw new ChatError(
            'Chat is currently not available',
            'OUTSIDE_BUSINESS_HOURS',
          );
        }

        // Create chat payload with session and chat info
        const chatPayload = createChatPayload(session, chatInfo);

        // Store the chat payload for later use
        window.__BCBST_CHAT_PAYLOAD = chatPayload;

        // Based on cloudChatEligible, load appropriate scripts
        if (chatInfo.cloudChatEligible) {
          await loadCloudChatScripts();
        } else {
          await loadLegacyChatScripts();
        }

        // Mark as initialized
        setIsInitialized(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        setScriptError(
          error instanceof Error ? error.message : 'Failed to initialize chat',
        );
        setIsLoading(false);
      }
    };

    initializeChat();

    return () => {
      // Clean up if needed
      closeChat();
      // Clean up chat payload
      if (window.__BCBST_CHAT_PAYLOAD) {
        delete window.__BCBST_CHAT_PAYLOAD;
      }
    };
  }, [session, status, closeChat]);

  // Load Genesys Cloud Chat scripts
  const loadCloudChatScripts = async () => {
    return new Promise<void>((resolve, reject) => {
      try {
        // Check if scripts are already loaded
        if ((window as any).genesys?.widgets?.webchat) {
          resolve();
          return;
        }

        // Create script for Genesys Web Messenger
        const script = document.createElement('script');
        script.src =
          'https://apps.mypurecloud.com/widgets/9.0/webcomponents.min.js';
        script.async = true;

        script.onload = () => {
          console.log('Genesys Web Messenger loaded');

          // Initialize with chat payload
          if (window.__BCBST_CHAT_PAYLOAD) {
            // Create Genesys config element if needed
            const configElement = document.createElement('script');
            configElement.type = 'text/javascript';
            configElement.innerHTML = `
              window.__genesys = {
                widgets: {
                  main: {
                    theme: 'light',
                    lang: 'en',
                    customAttributes: ${JSON.stringify(window.__BCBST_CHAT_PAYLOAD || {})}
                  }
                }
              };
            `;
            document.head.appendChild(configElement);
          }

          resolve();
        };

        script.onerror = () =>
          reject(new Error('Failed to load Genesys Cloud script'));
        document.head.appendChild(script);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Load Legacy On-Prem Chat scripts
  const loadLegacyChatScripts = async () => {
    return new Promise<void>((resolve, reject) => {
      try {
        // Check if scripts are already loaded
        if ((window as any).Genesys?.Chat) {
          resolve();
          return;
        }

        // First, load the configuration script
        const configScript = document.createElement('script');
        configScript.src = '/genesys-config.js';
        configScript.async = false;

        configScript.onload = () => {
          // Add the chat payload to the window for the chat.js script to use
          if (window.__BCBST_CHAT_PAYLOAD) {
            // Add the chat payload to the window
            (window as any).GENESYS_CHAT_PAYLOAD = window.__BCBST_CHAT_PAYLOAD;
          }

          // Now load the actual chat script
          const chatScript = document.createElement('script');
          chatScript.src = '/chat.js';
          chatScript.async = true;

          chatScript.onload = () => {
            console.log('Legacy chat script loaded');
            resolve();
          };

          chatScript.onerror = () =>
            reject(new Error('Failed to load chat.js'));
          document.body.appendChild(chatScript);
        };

        configScript.onerror = () =>
          reject(new Error('Failed to load genesys-config.js'));
        document.body.appendChild(configScript);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Show loading state
  if (isLoading) {
    return <div className="chat-loading">Initializing chat...</div>;
  }

  // Show error if initialization failed
  if (scriptError) {
    return (
      <div className="chat-error">
        {scriptError}
        <button
          onClick={() => window.location.reload()}
          className="mt-2 p-2 bg-primary text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render chat container when initialized
  if (isInitialized && session) {
    return (
      <ChatContextProvider>
        <ChatContainer isCloudEligible={isCloudEligible.current} />
      </ChatContextProvider>
    );
  }

  return null;
}
