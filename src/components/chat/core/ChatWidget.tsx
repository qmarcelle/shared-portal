import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../../../chat/providers';
import { AlertBar } from '../../../components/foundation/AlertBar';
import { Button } from '../../../components/foundation/Button';
import { Card } from '../../../components/foundation/Card';
import { Loader } from '../../../components/foundation/Loader';
import { TextField } from '../../../components/foundation/TextField';
import { ToolTip } from '../../../components/foundation/Tooltip';
import { ChatConfig, PlanInfo, UserEligibility } from '../../../models/chat';
import '../../../styles/chat/widget.css';
import { sendChatMessage } from '../../../utils/chatAPI';
import { ChatHeader } from './ChatHeader';
import { ChatMessageLoading } from './ChatMessageLoading';

/**
 * Props interface for the ChatWidget component.
 * These props are required by the interface but not currently used in the implementation.
 * They are kept for future use and to maintain compatibility with the parent components.
 */
interface ChatWidgetProps {
  /** Chat configuration including business hours and API endpoints */
  config: ChatConfig;
  /** User's eligibility status for chat features */
  userEligibility: UserEligibility;
  /** List of available plans for the user */
  availablePlans: PlanInfo[];
  /** Currently selected plan */
  currentPlan: PlanInfo;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  // These props are intentionally unused but required by the interface
  // They will be used in future implementations for plan-specific features
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userEligibility,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  availablePlans,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentPlan,
}) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [chatStarted, setChatStarted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Using useChatStore with a selector to get only the needed state
  const {
    isLoading,
    isSending,
    messages,
    session,
    addMessage,
    closeChat,
    openChat,
    setError: setStoreError,
    lockPlanSwitcher,
    unlockPlanSwitcher,
  } = useChatStore((state) => state);

  const hasActiveSession = session?.id != null;

  // Handle scroll events to show/hide chat widget
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 100); // Show after 100px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartChat = async () => {
    try {
      setError(null);
      setStoreError(null);
      openChat();
      setChatStarted(true);
      lockPlanSwitcher();
    } catch (err) {
      const errorMessage = 'Failed to start chat session. Please try again.';
      setError(errorMessage);
      setStoreError(errorMessage);
      console.error('Error starting chat:', err);
    }
  };

  const handleClose = async () => {
    try {
      if (hasActiveSession) {
        // TODO: Implement actual session end logic
        closeChat();
      }
      setChatStarted(false);
      unlockPlanSwitcher();
    } catch (err) {
      const errorMessage = 'Failed to end chat session. Please try again.';
      setError(errorMessage);
      setStoreError(errorMessage);
      console.error('Error ending chat:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !session?.id) return;

    try {
      setError(null);
      setStoreError(null);

      // Add user message to chat
      const userMessage = {
        id: `user-${Date.now()}`,
        text: message,
        sender: 'user' as const,
        timestamp: Date.now(),
      };
      addMessage(userMessage);

      // Send message to server
      const response = await sendChatMessage(session.id, message);

      // Add server response to chat
      addMessage(response);

      // Clear input
      setMessage('');
    } catch (err) {
      const errorMessage = 'Failed to send message. Please try again.';
      setError(errorMessage);
      setStoreError(errorMessage);
      console.error('Error sending message:', err);
    }
  };

  // Add keyboard navigation handler
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Add focus management
  useEffect(() => {
    if (isVisible) {
      chatInputRef.current?.focus();
    }
  }, [isVisible]);

  return (
    <div
      className={`chat-widget ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      role="dialog"
      aria-label="Chat Support"
      aria-describedby="chat-description"
      onKeyDown={handleKeyPress}
    >
      <div id="chat-description" className="sr-only">
        Chat with our support team. Press Escape to close.
      </div>

      <ChatHeader />

      {error && <AlertBar alerts={[error]} role="alert" />}

      {!isLoading && !hasActiveSession && !chatStarted && (
        <Card className="chat-start-form">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleStartChat();
            }}
            aria-label="Start chat form"
          >
            <div className="form-group">
              <label htmlFor="serviceType">What can we help you with?</label>
              <select
                id="serviceType"
                name="serviceType"
                required
                aria-label="Service type selection"
              >
                <option value="">Select an option</option>
                <option value="GENERAL">General</option>
                <option value="CLAIMS">Claims</option>
                <option value="BENEFITS">Benefits</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="inquiryType">Select your specific inquiry:</label>
              <select
                id="inquiryType"
                name="inquiryType"
                required
                aria-label="Inquiry type selection"
              >
                <option value="">Select an option</option>
                <option value="GENERAL">General</option>
                <option value="BENEFITS">Benefits</option>
                <option value="CLAIMS">Claims</option>
              </select>
            </div>
            <div className="button-group">
              <Button
                type="primary"
                style="submit"
                label="Start Chat"
                callback={handleStartChat}
                ariaLabel="Start chat session"
              />
              <Button
                type="secondary"
                style="button"
                label="Cancel"
                callback={handleClose}
                ariaLabel="Cancel chat"
              />
            </div>
          </form>
        </Card>
      )}

      {!isLoading && hasActiveSession && chatStarted && (
        <div className="chat-body" role="log" aria-live="polite">
          <div className="messages">
            {messages.map((message) => (
              <Card
                key={message.id}
                className={`message ${message.sender}`}
                role="article"
                aria-label={`${message.sender} message`}
              >
                <span>{message.text}</span>
              </Card>
            ))}
            {isSending && <ChatMessageLoading />}
          </div>
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 p-4 border-t border-gray-200"
            aria-label="Chat message form"
          >
            <TextField
              label="Message"
              value={message}
              valueCallback={setMessage}
              hint="Type your message..."
              disabled={isSending}
              ref={chatInputRef}
              ariaLabel="Message input"
            />
            <Button
              type="primary"
              style="submit"
              label={isSending ? 'Sending...' : 'Send'}
              callback={isSending ? undefined : handleSendMessage}
              ariaLabel={isSending ? 'Sending message' : 'Send message'}
            />
          </form>
          <div
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <ToolTip
              showTooltip={showTooltip}
              label="Share your screen with the agent"
            >
              <Button
                type="secondary"
                style="button"
                label="Start Screen Share"
                className="cobrowse-button"
                ariaLabel="Start screen sharing session"
              />
            </ToolTip>
          </div>
        </div>
      )}

      {isLoading && (
        <div
          className="chat-loading"
          role="status"
          aria-label="Initializing chat"
        >
          <Loader />
          <p>Initializing chat...</p>
        </div>
      )}
    </div>
  );
};
