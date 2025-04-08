'use client';

import { useChatContext } from '@/app/chat/components/providers/ChatContextProvider';
import { CloudChatWidget } from '@/app/chat/components/widgets/CloudChatWidget';
import { LegacyOnPremChatWidget } from '@/app/chat/components/widgets/LegacyOnPremChatWidget';
import { ENV_CONFIG } from '@/app/chat/config';
import { useChat } from '@/app/chat/hooks/useChat';
import '@/app/chat/styles/components/loading.css';
import '@/app/chat/styles/components/widget.css';
import { ChatError } from '@/app/chat/types/errors';
import type { BusinessHours } from '@/app/chat/types/types';
import { AlertBar } from '@/components/foundation/AlertBar';
import React, { useEffect, useRef, useState } from 'react';
import { ActiveChatWindow, ChatStartWindow } from '../features/chat-window';

export interface ChatWidgetProps {
  businessHours?: BusinessHours;
  onError?: (error: ChatError) => void;
  onChatStarted?: () => void;
  onChatEnded?: () => void;
  isCloudEligible?: boolean;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  onError,
  onChatStarted,
  onChatEnded,
  isCloudEligible = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [showStartWindow, setShowStartWindow] = useState(true);
  const { isInitialized, error: contextError } = useChatContext();

  const {
    isReady,
    isLoading,
    isEligible,
    isWithinBusinessHours,
    isInChat,
    selectedPlan,
    userEligibility,
    plans,
    startChat,
    lockPlanSwitcher,
  } = useChat({
    onError: (err) => {
      setAlerts([err.message]);
      onError?.(err);
    },
    onChatStarted: () => {
      setShowStartWindow(false);
      onChatStarted?.();
    },
    onChatEnded,
  });

  // Handle errors
  const handleError = (error: ChatError) => {
    setAlerts([error.message]);
    onError?.(error);
  };

  useEffect(() => {
    if (contextError) {
      setAlerts([contextError.message]);
    }
  }, [contextError]);

  const handleStartChat = () => {
    startChat();
  };

  const handleCloseChatWindow = () => {
    setShowStartWindow(false);
  };

  const handleSwitchPlan = () => {
    setShowStartWindow(false);
    // This will allow the plan switcher to open in the UI
  };

  if (!isReady || isLoading || !isInitialized) {
    return <div className="chat-loading">Loading chat...</div>;
  }

  if (!isEligible) {
    return (
      <div className="chat-error">
        You are not eligible for chat at this time.
      </div>
    );
  }

  if (!isWithinBusinessHours) {
    return (
      <div className="chat-error">
        Chat is currently closed. Please try again during business hours.
      </div>
    );
  }

  if (!selectedPlan) {
    return <div className="chat-error">No chat plan selected.</div>;
  }

  if (!userEligibility) {
    return (
      <div className="chat-loading">Loading eligibility information...</div>
    );
  }

  const hasMultiplePlans = plans && plans.length > 1;

  return (
    <div ref={containerRef} className="chat-widget">
      {alerts.length > 0 && (
        <div className="chat-alerts">
          <AlertBar alerts={alerts} />
        </div>
      )}

      {showStartWindow && !isInChat ? (
        <ChatStartWindow
          onStartChat={handleStartChat}
          onCloseChatWindow={handleCloseChatWindow}
          onSwitchPlan={handleSwitchPlan}
          currentPlan={selectedPlan}
          hasMultiplePlans={hasMultiplePlans}
        />
      ) : (
        <ActiveChatWindow
          currentPlan={selectedPlan}
          hasMultiplePlans={hasMultiplePlans}
        >
          <div className="chat-container">
            {isCloudEligible || ENV_CONFIG.provider === 'cloud' ? (
              <CloudChatWidget
                containerRef={containerRef}
                currentPlan={selectedPlan}
                onLockPlanSwitcher={lockPlanSwitcher}
                onError={handleError}
              />
            ) : (
              <LegacyOnPremChatWidget
                userEligibility={userEligibility}
                currentPlan={selectedPlan}
                onLockPlanSwitcher={lockPlanSwitcher}
                onError={handleError}
              />
            )}
          </div>
        </ActiveChatWindow>
      )}
    </div>
  );
};
