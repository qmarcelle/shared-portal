import React, { useEffect, useState } from 'react';
import {
  ChatConfig,
  CobrowseState,
  PlanInfo,
  UserEligibility,
} from '../../../models/chat';
import { useChatStore } from '../../../utils/chatStore';
import { CobrowseService } from '../../../utils/CobrowseService';
import { GenesysChatService } from '../../../utils/GenesysChatService';
import { useAudioAlert } from '../../../utils/useAudioAlert';
import { useChatEligibility } from '../../../utils/useChatEligibility';
import { usePlanSwitcherIntegration } from '../../../utils/usePlanSwitcherIntegration';
import ChatDisclaimer from '../features/ChatDisclaimer';
import CobrowseConsent from '../features/CobrowseConsent';
import CobrowseSession from '../features/CobrowseSession';
import ChatForm from '../screens/ChatForm';
import ChatUnavailable from '../screens/ChatUnavailable';
import { ChatBody } from './ChatBody';
import { ChatButton } from './ChatButton';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';

interface ChatWidgetProps {
  userEligibility: UserEligibility;
  config: ChatConfig;
  currentPlan: PlanInfo | null;
  availablePlans: PlanInfo[];
  isPlanSwitcherOpen: boolean;
  openPlanSwitcher: () => void;
  closePlanSwitcher: () => void;
  className?: string;
}

// Component states
type ChatScreenState = 'form' | 'chat' | 'unavailable';

/**
 * Main chat widget container component
 */
export const ChatWidget: React.FC<ChatWidgetProps> = ({
  userEligibility,
  config,
  currentPlan,
  availablePlans,
  isPlanSwitcherOpen,
  openPlanSwitcher,
  closePlanSwitcher,
  className = '',
}) => {
  const {
    isOpen,
    setOpen,
    messages,
    addMessage,
    isPlanSwitcherLocked,
    lockPlanSwitcher,
    unlockPlanSwitcher,
  } = useChatStore();

  const [chatService] = useState(() => new GenesysChatService(config));
  const [cobrowseService] = useState(() => new CobrowseService(config));
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [screenState, setScreenState] = useState<ChatScreenState>('form');
  const [cobrowseState, setCobrowseState] = useState<CobrowseState>('inactive');
  const [showCobrowseConsent, setShowCobrowseConsent] = useState(false);
  const [serviceType, setServiceType] = useState('');
  const [inquiryType, setInquiryType] = useState('');

  // Check eligibility based on current plan
  const { isEligible, isWithinHours, reason } = useChatEligibility({
    currentPlan,
  });

  // Initialize audio alert hook
  const { playAlert, initializeAudio } = useAudioAlert(
    '/audio/notification.mp3',
  );

  // Initialize plan switcher integration
  const {
    showSwitchPlanOption,
    handleSwitchPlan,
    displayPlanInfo,
    currentPlanName,
  } = usePlanSwitcherIntegration({
    currentPlan,
    availablePlans,
    isPlanSwitcherOpen,
    openPlanSwitcher,
    closePlanSwitcher,
  });

  // Determine which screen to show
  useEffect(() => {
    if (!isEligible || !isWithinHours) {
      setScreenState('unavailable');
    } else if (messages.length === 0 && !isSessionActive) {
      setScreenState('form');
    } else {
      setScreenState('chat');
    }
  }, [isEligible, isWithinHours, messages.length, isSessionActive]);

  // Initialize audio with user interaction
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', initializeAudio, { once: true });
    }

    return () => {
      document.removeEventListener('click', initializeAudio);
    };
  }, [isOpen, initializeAudio]);

  // Handle form submission
  const handleFormSubmit = async (
    formServiceType: string,
    formInquiryType: string,
  ) => {
    setServiceType(formServiceType);
    setInquiryType(formInquiryType);

    try {
      // Initialize chat session
      await chatService.initialize({
        firstname: userEligibility.memberFirstname,
        lastname: userEligibility.memberLastName,
        MEMBER_ID: `${userEligibility.subscriberID}-${userEligibility.sfx}`,
        GROUP_ID: userEligibility.groupId,
        PLAN_ID: userEligibility.memberMedicalPlanID,
        LOB: currentPlan?.lineOfBusiness || '',
        SERV_TYPE: formServiceType,
        INQ_TYPE: formInquiryType,
        MEMBER_DOB: userEligibility.memberDOB,
        RoutingChatbotInteractionId:
          userEligibility.RoutingChatbotInteractionId || '',
        coverage_eligibility: userEligibility.coverage_eligibility || '',
        lob_group: userEligibility.lob_group || '',
        Origin: userEligibility.Origin || 'MemberPortal',
        Source: userEligibility.Source || 'WebChat',
      });

      setIsSessionActive(true);
      lockPlanSwitcher();

      // Send initial greeting message
      addMessage({
        text: 'How can we help you today?',
        sender: 'bot',
      });

      // Update screen state
      setScreenState('chat');
    } catch (error) {
      console.error('Error initializing chat session:', error);
      addMessage({
        text: 'There was an error starting your chat session. Please try again later.',
        sender: 'bot',
      });
    }
  };

  // Handle sending messages
  const handleSendMessage = async (message: string) => {
    try {
      // Add user message to the chat
      addMessage({
        text: message,
        sender: 'user',
      });

      // Send message
      await chatService.sendMessage(message);

      // Add mock response for now (in real implementation, this would come from the service)
      setTimeout(() => {
        addMessage({
          text: 'Thank you for your message. An agent will be with you shortly.',
          sender: 'bot',
        });
        playAlert();
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        text: 'There was an error sending your message. Please try again.',
        sender: 'bot',
      });
    }
  };

  // Handle closing the chat
  const handleCloseChat = async () => {
    if (isSessionActive) {
      try {
        await chatService.disconnect();
      } catch (error) {
        console.error('Error disconnecting chat:', error);
      }
      setIsSessionActive(false);
    }

    // Reset cobrowse if active
    if (cobrowseState !== 'inactive') {
      try {
        await cobrowseService.endSession();
        setCobrowseState('inactive');
      } catch (error) {
        console.error('Error ending cobrowse session:', error);
      }
    }

    unlockPlanSwitcher();
    setOpen(false);
  };

  // Handle cobrowse actions
  const handleCobrowseConsentResponse = async (accepted: boolean) => {
    setShowCobrowseConsent(false);

    if (accepted) {
      try {
        await cobrowseService.initialize();
        setCobrowseState('pending');
      } catch (error) {
        console.error('Error initializing cobrowse:', error);
        addMessage({
          text: 'There was an error starting screen sharing. Please try again later.',
          sender: 'bot',
        });
      }
    }
  };

  // If chat is not open, render just the button
  if (!isOpen) {
    return <ChatButton label="Chat with us" className={className} />;
  }

  // Render the appropriate screen based on state
  const renderScreen = () => {
    if (screenState === 'unavailable') {
      return (
        <ChatUnavailable
          reason={!isEligible ? 'ineligible' : 'outside-hours'}
          opsPhone={config.opsPhone}
          opsHours={config.opsPhoneHours}
          onClose={handleCloseChat}
        />
      );
    }

    if (screenState === 'form') {
      return (
        <ChatForm
          onSubmit={handleFormSubmit}
          onCancel={handleCloseChat}
          currentPlan={currentPlan}
          isIDCardEligible={userEligibility.isIDCardEligible}
          isDentalEligible={userEligibility.isDental}
          isCobraEligible={userEligibility.isCobraEligible}
        />
      );
    }

    return (
      <>
        <ChatBody
          showPlanInfo={displayPlanInfo && isSessionActive}
          planName={currentPlanName || ''}
        />

        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={!isEligible || !isWithinHours || isPlanSwitcherLocked}
          placeholder={
            !isEligible
              ? 'Chat is not available for this plan'
              : !isWithinHours
                ? 'Chat is outside business hours'
                : isPlanSwitcherLocked
                  ? 'Please end current chat before starting a new one'
                  : 'Type a message...'
          }
        />

        <ChatDisclaimer currentPlan={currentPlan} />
      </>
    );
  };

  return (
    <>
      <div
        className={`fixed bottom-4 right-4 z-50 flex flex-col bg-white rounded-lg shadow-lg w-[360px] h-[520px] max-h-[80vh] overflow-hidden ${className}`}
      >
        <ChatHeader
          title="Chat with us"
          isAmplifyMember={userEligibility.isAmplifyMem}
          onClose={handleCloseChat}
        />

        {renderScreen()}

        {/* Plan switcher option for multi-plan members before chat starts */}
        {showSwitchPlanOption && screenState === 'form' && (
          <div className="p-3 bg-secondary-focus text-neutral text-sm border-t border-tertiary-4">
            <span className="font-semibold">Current Plan:</span>{' '}
            {currentPlanName}
            <button
              onClick={handleSwitchPlan}
              className="ml-2 text-primary underline"
              type="button"
            >
              Switch
            </button>
          </div>
        )}

        {/* Plan switcher locked message */}
        {isPlanSwitcherLocked && (
          <div className="p-2 bg-warning-content text-warning text-xs text-center">
            Plan switching is disabled during an active chat session
          </div>
        )}
      </div>

      {/* Cobrowse consent dialog */}
      {showCobrowseConsent && (
        <CobrowseConsent
          onAccept={() => handleCobrowseConsentResponse(true)}
          onDecline={() => handleCobrowseConsentResponse(false)}
        />
      )}

      {/* Cobrowse session indicator */}
      {cobrowseState !== 'inactive' && (
        <CobrowseSession
          sessionState={cobrowseState}
          cobrowseService={cobrowseService}
          onStateChange={setCobrowseState}
        />
      )}
    </>
  );
};

export default ChatWidget;
