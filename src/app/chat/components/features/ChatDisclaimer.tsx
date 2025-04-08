import React from 'react';

interface ChatDisclaimerProps {
  onAccept: () => void;
  onDecline: () => void;
}

const ChatDisclaimer: React.FC<ChatDisclaimerProps> = ({
  onAccept,
  onDecline,
}) => {
  return (
    <div>
      <h2>Chat Disclaimer</h2>
      <p>By choosing to use this chat service:</p>
      <ul>
        <li>This chat service is provided for general inquiries</li>
        <li>Information shared during this chat may be recorded</li>
        <li>While we make every effort to keep your information secure</li>
        <li>Our support agents will never ask for your password</li>
      </ul>
      <div>
        <button data-testid="accept-chat" onClick={onAccept}>
          Accept & Continue
        </button>
        <button data-testid="decline-chat" onClick={onDecline}>
          Decline
        </button>
      </div>
    </div>
  );
};

export default ChatDisclaimer;
