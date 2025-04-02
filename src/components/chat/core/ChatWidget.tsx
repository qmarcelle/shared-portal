import React, { useState } from 'react';
import { ChatConfig, PlanInfo, UserEligibility } from '../../../models/chat';
import { useChatStore } from '../../../utils/chatStore';
import { ChatHeader } from './ChatHeader';

interface ChatSession {
  id: string;
  startTime: number;
  agentId?: string;
}

interface ChatState {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  messages: Array<{ id: string; text: string; sender: string }>;
  addMessage: (message: { id: string; text: string; sender: string }) => void;
  session: ChatSession | null;
  isPlanSwitcherLocked: boolean;
}

interface ChatWidgetProps {
  userEligibility?: UserEligibility;
  config?: ChatConfig;
  currentPlan?: PlanInfo;
  availablePlans?: PlanInfo[];
  isPlanSwitcherOpen?: boolean;
  openPlanSwitcher?: () => void;
  closePlanSwitcher?: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  userEligibility,
  config,
  currentPlan,
  availablePlans,
  isPlanSwitcherOpen = false,
  openPlanSwitcher = () => {},
  closePlanSwitcher = () => {},
}) => {
  const { isOpen, messages, session } = useChatStore((state) => ({
    isOpen: state.isOpen,
    messages: state.messages,
    session: state.session,
  })) as ChatState;
  const [showCobrowseConsent, setShowCobrowseConsent] = useState(false);
  const [cobrowseSessionCode, setCobrowseSessionCode] = useState<string | null>(
    null,
  );
  const [showForm, setShowForm] = useState(true);
  const [chatStarted, setChatStarted] = useState(false);

  const handleStartChat = () => {
    setShowForm(false);
    setChatStarted(true);
  };

  const handleClose = () => {
    setShowForm(true);
    setChatStarted(false);
    closePlanSwitcher();
  };

  if (!isOpen) return null;

  // Check if user is eligible and within business hours
  const isEligible = userEligibility?.isChatEligibleMember || false;
  const isWithinBusinessHours = config?.businessHours?.isOpen || false;

  // Determine which screen to show
  const isUnavailable = !isEligible || !isWithinBusinessHours;
  const hasActiveSession = session !== null;

  return (
    <div className="chat-widget">
      <ChatHeader />

      {isUnavailable && (
        <div className="chat-unavailable">
          <h3>Chat is currently unavailable</h3>
          {!isWithinBusinessHours && (
            <p>Please try again during our business hours</p>
          )}
        </div>
      )}

      {!isUnavailable && !hasActiveSession && showForm && (
        <div className="chat-form">
          <h3>How can we help you?</h3>
          {currentPlan && (
            <div>
              <p>Current Plan: {currentPlan.planName}</p>
              {!isPlanSwitcherOpen && (
                <button onClick={openPlanSwitcher}>Switch Plan</button>
              )}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleStartChat();
            }}
          >
            <div>
              <label htmlFor="serviceType">What can we help you with?</label>
              <select id="serviceType" name="serviceType">
                <option value="">Select an option</option>
                <option value="GENERAL">General</option>
                <option value="CLAIMS">Claims</option>
                <option value="BENEFITS">Benefits</option>
              </select>
            </div>
            <div>
              <label htmlFor="inquiryType">Select your specific inquiry:</label>
              <select id="inquiryType" name="inquiryType">
                <option value="">Select an option</option>
                <option value="GENERAL">General</option>
                <option value="BENEFITS">Benefits</option>
                <option value="CLAIMS">Claims</option>
              </select>
            </div>
            <button type="submit">Start Chat</button>
            <button type="button" onClick={handleClose}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {hasActiveSession && chatStarted && (
        <div className="chat-body">
          <div className="messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Send message logic would go here
              }}
            >
              <input type="text" placeholder="Type your message..." />
              <button type="submit">Send</button>
            </form>
          </div>
          <button
            onClick={() => setShowCobrowseConsent(true)}
            className="cobrowse-button"
          >
            Share my screen
          </button>
          <button onClick={handleClose}>Close Chat</button>
        </div>
      )}

      {showCobrowseConsent && (
        <div className="cobrowse-consent">
          <h3>Our agent would like to view your screen</h3>
          <p>This will help us assist you better.</p>
          <button
            onClick={() => {
              setShowCobrowseConsent(false);
              setCobrowseSessionCode('123456');
            }}
          >
            I Agree
          </button>
          <button onClick={() => setShowCobrowseConsent(false)}>Cancel</button>
        </div>
      )}

      {cobrowseSessionCode && (
        <div className="cobrowse-code">
          <h3>Provide this code to the agent</h3>
          <div className="code">{cobrowseSessionCode}</div>
        </div>
      )}
    </div>
  );
};
