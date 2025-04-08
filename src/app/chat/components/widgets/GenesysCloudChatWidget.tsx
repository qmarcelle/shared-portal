'use client';

import {
  createWidgetConfig,
  getChatScriptUrl,
} from '@/app/chat/config/widget.config';
import { ChatError } from '@/app/chat/models/errors';
import {
  ChatPlan,
  GenesysWindow,
  UserEligibility,
} from '@/app/chat/models/types';
import { useChatStore } from '@/app/chat/stores/chatStore';
import { useEffect, useRef, useState } from 'react';

interface GenesysCloudChatWidgetProps {
  userEligibility: UserEligibility;
  currentPlan: ChatPlan;
  onLockPlanSwitcher: (locked: boolean) => void;
  onError: (error: ChatError) => void;
}

export const GenesysCloudChatWidget: React.FC<GenesysCloudChatWidgetProps> = ({
  userEligibility,
  currentPlan,
  onLockPlanSwitcher,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { startChat, endChat } = useChatStore();

  // Load Genesys chat script
  useEffect(() => {
    if (scriptLoaded || typeof window === 'undefined') return;

    const loadScript = () => {
      const script = document.createElement('script');
      script.src = getChatScriptUrl(true); // true for cloud
      script.id = 'genesys-chat-script';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => {
        onError(
          new ChatError(
            'Failed to load chat widget. Please try again.',
            'INITIALIZATION_ERROR',
            'error',
          ),
        );
      };
      document.head.appendChild(script);
    };

    if (!document.getElementById('genesys-chat-script')) {
      loadScript();
    } else {
      setScriptLoaded(true);
    }
  }, [scriptLoaded, onError]);

  // Initialize Genesys chat when script is loaded
  useEffect(() => {
    if (
      !scriptLoaded ||
      !containerRef.current ||
      !(window as GenesysWindow).Genesys
    ) {
      return;
    }

    try {
      const config = createWidgetConfig(currentPlan, userEligibility, true);
      config.containerEl = containerRef.current;

      (window as GenesysWindow).Genesys?.Chat.createChatWidget(config);

      // Register event handlers
      const handleChatStarted = () => {
        onLockPlanSwitcher(true);
        startChat();
      };

      const handleChatEnded = () => {
        onLockPlanSwitcher(false);
        endChat();
      };

      (window as GenesysWindow).Genesys?.Chat.on(
        'chatStarted',
        handleChatStarted,
      );
      (window as GenesysWindow).Genesys?.Chat.on('chatEnded', handleChatEnded);

      // Cleanup function
      return () => {
        if ((window as GenesysWindow).Genesys) {
          (window as GenesysWindow).Genesys?.Chat.off(
            'chatStarted',
            handleChatStarted,
          );
          (window as GenesysWindow).Genesys?.Chat.off(
            'chatEnded',
            handleChatEnded,
          );
          try {
            (window as GenesysWindow).Genesys?.Chat.endSession();
          } catch (e) {
            console.error('Error cleaning up Genesys widget:', e);
          }
        }
      };
    } catch (error) {
      onError(
        new ChatError(
          'Failed to initialize chat widget. Please try again.',
          'CHAT_START_ERROR',
          'error',
          { originalError: error },
        ),
      );
    }
  }, [
    scriptLoaded,
    currentPlan,
    userEligibility,
    onLockPlanSwitcher,
    startChat,
    endChat,
    onError,
  ]);

  return (
    <div
      ref={containerRef}
      className="chat-widget-container"
      role="complementary"
      aria-label="Chat Widget"
    />
  );
};
