'use client';

import { AlertBar } from '@/components/foundation/AlertBar';
import { Card } from '@/components/foundation/Card';
import { Loader } from '@/components/foundation/Loader';
import { useChatEligibility } from '../../hooks/useChatEligibility';
import { useChatStore } from '../../stores/chatStore';
import { BusinessHoursNotification } from '../business-hours/BusinessHoursNotification';
import { EligibilityCheck } from '../eligibility/EligibilityCheck';
import { ChatButton } from './ChatButton';
import { ChatHeader } from './ChatHeader';

export const ChatWidget = () => {
  const {
    isOpen,
    isLoading,
    error,
    openChat,
    closeChat,
    isChatActive,
    isWithinBusinessHours,
    currentPlan,
    startChat,
    endChat,
    availablePlans,
    businessHours,
  } = useChatStore();

  const {
    isLoading: isEligibilityLoading,
    error: eligibilityError,
    isEligible,
    eligibility,
  } = useChatEligibility();

  if (!isOpen) {
    return <ChatButton onClick={openChat} />;
  }

  const handleStartChat = () => {
    if (!isEligible || !isWithinBusinessHours || !currentPlan) return;
    startChat();
  };

  const handleEndChat = () => {
    endChat();
  };

  const handleSwitchPlan = () => {
    closeChat();
    // Trigger plan switcher to open
    const planSwitcherEvent = new CustomEvent('openPlanSwitcher');
    window.dispatchEvent(planSwitcherEvent);
  };

  const renderContent = () => {
    if (isLoading || isEligibilityLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      );
    }

    if (!isEligible && eligibility) {
      return <EligibilityCheck eligibility={eligibility} onClose={closeChat} />;
    }

    if (!isWithinBusinessHours && businessHours) {
      return (
        <BusinessHoursNotification
          businessHours={businessHours}
          onClose={closeChat}
        />
      );
    }

    if (isChatActive) {
      return (
        <div className="flex-1">
          <div id="genesys-chat-container" className="w-full h-full" />
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Show current plan info if user has multiple plans */}
        {currentPlan && availablePlans.length > 1 && (
          <div className="w-full mb-6 bg-base-200 p-4 rounded-lg">
            <h3 className="font-bold mb-2">You will be chatting about:</h3>
            <p className="mb-2">{currentPlan.name}</p>
            <button
              onClick={handleSwitchPlan}
              className="text-primary text-sm underline"
              aria-label="Switch to a different plan"
            >
              Switch Plan
            </button>
          </div>
        )}

        <button
          onClick={handleStartChat}
          className="bg-primary hover:bg-primary-focus text-white font-bold py-3 px-6 rounded-lg"
          aria-label="Start chat session"
        >
          Start Chat
        </button>
      </div>
    );
  };

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[600px] flex flex-col shadow-hard">
      <div className="flex flex-col flex-1">
        <ChatHeader
          title={
            isChatActive && availablePlans.length > 1
              ? `Chatting about: ${currentPlan?.name}`
              : 'Chat with us'
          }
          onClose={isChatActive ? handleEndChat : closeChat}
        />
        {(error || eligibilityError) && (
          <AlertBar
            alerts={[String(error || eligibilityError || 'An error occurred')]}
          />
        )}
        {renderContent()}
      </div>
    </Card>
  );
};
