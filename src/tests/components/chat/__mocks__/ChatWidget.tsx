import React from 'react';
import { PlanInfo } from '../../../../models/chat';

interface ChatWidgetProps {
  currentPlan: PlanInfo;
  availablePlans: PlanInfo[];
  isPlanSwitcherOpen: boolean;
  openPlanSwitcher: () => void;
  closePlanSwitcher: () => void;
}

// Mock implementation of ChatWidget for testing
export const ChatWidget: React.FC<ChatWidgetProps> = ({
  currentPlan,
  availablePlans,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showForm, setShowForm] = React.useState(true);
  const [chatStarted, setChatStarted] = React.useState(false);

  const handleStartChat = () => {
    setShowForm(false);
    setChatStarted(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowForm(true);
    setChatStarted(false);
  };

  return (
    <div data-testid="chat-widget">
      {!isOpen && <button onClick={() => setIsOpen(true)}>Chat with us</button>}

      {isOpen && showForm && (
        <div data-testid="chat-form">
          <h3>Start a Chat</h3>
          {availablePlans.length > 1 && (
            <div>
              <p>Current Plan: {currentPlan.planName}</p>
              <button onClick={() => {}}>Switch</button>
            </div>
          )}
          <label htmlFor="service-type">
            Select the service you need help with:
          </label>
          <select id="service-type">
            <option value="GENERAL">General</option>
            <option value="CLAIMS">Claims</option>
            <option value="BENEFITS">Benefits</option>
          </select>

          <label htmlFor="inquiry-type">Select your specific inquiry:</label>
          <select id="inquiry-type">
            <option value="GENERAL">General</option>
            <option value="BENEFITS">Benefits</option>
            <option value="CLAIMS">Claims</option>
          </select>

          <button onClick={handleStartChat}>Start Chat</button>
          <button onClick={handleClose}>Cancel</button>
        </div>
      )}

      {isOpen && chatStarted && (
        <div data-testid="chat-body">
          <h3>Chat Session</h3>
          {availablePlans.length > 1 && (
            <div>
              <p>Chatting about plan: {currentPlan.planName}</p>
              <p>Plan switching is disabled during an active chat session</p>
            </div>
          )}
          <div className="chat-messages">
            <div className="message agent">
              Hello! How can I help you today?
            </div>
          </div>
          <button onClick={handleClose}>Close</button>
        </div>
      )}
    </div>
  );
};
