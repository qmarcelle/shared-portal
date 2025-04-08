'use client';

import { useEffect, useRef } from 'react';
import { safeValidateUserData } from '../../schemas/user';
import { ChatService } from '../../services/chat/ChatService';
import { useChatStore } from '../../stores/chatStore';
import { ChatError } from '../../types/errors';
import type {
  ChatPlan,
  GenesysChatEvent,
  GenesysWidgetConfig,
  GenesysWindow,
  UserEligibility,
} from '../../types/types';

interface LegacyOnPremChatWidgetProps {
  userEligibility: UserEligibility;
  currentPlan: ChatPlan;
  onLockPlanSwitcher: (locked: boolean) => void;
  onError: (error: ChatError) => void;
}

export function LegacyOnPremChatWidget({
  userEligibility,
  currentPlan,
  onLockPlanSwitcher,
  onError,
}: LegacyOnPremChatWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chatService = useRef<ChatService | null>(null);
  const { chatSession, setError, addMessage } = useChatStore();

  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;

    const initializeWidget = () => {
      if (!containerRef.current || !chatSession) return;

      try {
        const userData = {
          config: {
            deploymentId: process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID || '',
            region: process.env.NEXT_PUBLIC_GENESYS_REGION || '',
            planId: chatSession.planId,
          },
          userInfo: {
            firstName: chatSession.jwt.currUsr?.firstName || '',
            lastName: chatSession.jwt.currUsr?.lastName || '',
            customFields: {
              planId: chatSession.planId,
              groupId: chatSession.jwt.groupId || '',
              lob: currentPlan.lineOfBusiness || '',
              lobGroup: currentPlan.lobGroup || '',
              isMedical: userEligibility.isMedical ? 'true' : 'false',
              isDental: userEligibility.isDental ? 'true' : 'false',
              isVision: userEligibility.isVision ? 'true' : 'false',
            },
          },
          SERV_Type: 'MemberPortal' as const,
          INQ_TYPE: 'MEM' as const,
          RoutingChatbotInteractionId: `chat-${Date.now()}`,
          Origin: 'portal' as const,
          Source: 'web' as const,
        };

        // Validate user data
        const validationResult = safeValidateUserData(userData);

        if (!validationResult.success) {
          throw new ChatError(
            'Invalid user data: ' + validationResult.error.message,
            'INITIALIZATION_ERROR',
            'error',
          );
        }

        const validatedUserData = validationResult.data;

        // Align with Genesys WebChat configuration
        const widgetConfig: GenesysWidgetConfig = {
          dataURL: '/chat',
          userData: validatedUserData,
          containerEl: containerRef.current,
          headerConfig: {
            title: 'Chat with Us',
            closeButton: true,
            minimizeButton: true,
          },
          styling: {
            primaryColor: '#0066CC',
            fontFamily: 'system-ui, sans-serif',
            theme: 'light',
          },
          features: {
            enableFileUpload: true,
            enableEmoji: true,
            enableTypingIndicator: true,
            confirmFormCloseEnabled: true,
            actionsMenu: true,
            maxMessageLength: 140,
          },
          autoInvite: {
            enabled: false,
            timeToInviteSeconds: 10,
            inviteTimeoutSeconds: 30,
          },
          chatButton: {
            enabled: true,
            effect: 'fade',
            openDelay: 1000,
            effectDuration: 300,
            hideDuringInvite: true,
          },
          async: {
            enabled: true,
            newMessageRestoreState: 'minimized',
          },
          logging: {
            logLevel: process.env.NODE_ENV === 'production' ? 'ERROR' : 'DEBUG',
            isEnabled: true,
          },
          ariaIdleAlertIntervals: [50, 25, 10],
          ariaCharRemainingIntervals: [75, 25, 10],
          broadcast: {
            enabled: true,
            messageDelay: 5000,
            messageTypes: ['system', 'agent', 'supervisor'],
          },
        };

        const genesys = (window as unknown as GenesysWindow).Genesys;
        if (!genesys?.Chat) {
          throw new ChatError(
            'Legacy chat API not available',
            'INITIALIZATION_ERROR',
            'error',
          );
        }

        // Register event handlers
        const handleChatStarted = () => {
          onLockPlanSwitcher(true);
        };

        const handleChatEnded = () => {
          onLockPlanSwitcher(false);
          if (chatService.current) {
            chatService.current.disconnect().catch(console.error);
          }
        };

        const handleError = (error: unknown) => {
          const chatError = new ChatError(
            'Chat error occurred',
            'MESSAGE_ERROR',
            'error',
            { originalError: error },
          );
          setError(chatError);
          onError(chatError);
        };

        // Handle broadcast messages
        const handleBroadcast = (event: GenesysChatEvent) => {
          if (event.data?.message) {
            addMessage({
              id: `broadcast-${Date.now()}`,
              content: event.data.message,
              sender: 'system',
              timestamp: event.data.timestamp || Date.now(),
              metadata: {
                type: 'broadcast',
                messageType: event.data.type,
                from: event.data.from,
              },
            });
          }
        };

        // Initialize widget with Genesys WebChat configuration
        genesys.Chat.createChatWidget(widgetConfig);

        // Subscribe to events
        genesys.Chat.on('chatStarted', handleChatStarted);
        genesys.Chat.on('chatEnded', handleChatEnded);
        genesys.Chat.on('error', handleError);
        genesys.Chat.on('broadcast', handleBroadcast);

        // Return cleanup function
        return () => {
          genesys.Chat.off('chatStarted', handleChatStarted);
          genesys.Chat.off('chatEnded', handleChatEnded);
          genesys.Chat.off('error', handleError);
          genesys.Chat.off('broadcast', handleBroadcast);
          try {
            genesys.Chat.endSession();
          } catch (e) {
            console.error('Error ending chat session:', e);
          }
        };
      } catch (error) {
        const chatError = new ChatError(
          'Failed to initialize legacy chat widget',
          'CHAT_START_ERROR',
          'error',
          { originalError: error },
        );
        setError(chatError);
        onError(chatError);
      }
    };

    const loadScript = () => {
      scriptElement = document.createElement('script');
      scriptElement.src = '/chat.js';
      scriptElement.async = true;
      scriptElement.onload = initializeWidget;
      scriptElement.onerror = () => {
        const error = new ChatError(
          'Failed to load legacy chat script',
          'INITIALIZATION_ERROR',
          'error',
        );
        setError(error);
        onError(error);
      };
      document.body.appendChild(scriptElement);
    };

    loadScript();

    return () => {
      if (scriptElement?.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
      if (chatService.current) {
        chatService.current.disconnect().catch(console.error);
      }
    };
  }, [
    currentPlan,
    userEligibility,
    chatSession,
    onLockPlanSwitcher,
    onError,
    setError,
    addMessage,
  ]);

  return (
    <div
      ref={containerRef}
      className="chat-widget-container"
      role="complementary"
      aria-label="Legacy Chat Widget"
    />
  );
}
