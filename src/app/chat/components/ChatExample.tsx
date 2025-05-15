'use client';

/**
 * ChatExample Component
 *
 * Example usage of the chat components.
 * Shows how to integrate the ChatProvider, ChatWidget, and ChatControls.
 */

import { useState } from 'react';
import { ChatControls, ChatProvider, ChatWidget } from './';

export default function ChatExample() {
  const [showChat, setShowChat] = useState(false);

  const handleChatOpen = () => {
    console.log('Chat was opened');
  };

  const handleChatClose = () => {
    console.log('Chat was closed');
  };

  const handleError = (error: Error) => {
    console.error('Chat error:', error);
  };

  return (
    <ChatProvider>
      <div className="chat-example">
        <h2>Chat Example</h2>

        {/* Chat toggle button */}
        <button onClick={() => setShowChat(!showChat)}>
          {showChat ? 'Hide Chat Widget' : 'Show Chat Widget'}
        </button>

        {/* Chat controls (only shown when widget is visible) */}
        {showChat && (
          <div className="chat-controls-container">
            <ChatControls
              buttonText="Need Help?"
              className="custom-chat-button"
              onClick={() => console.log('Chat button clicked')}
            />
          </div>
        )}

        {/* Chat widget (only mounted when showChat is true) */}
        {showChat && (
          <ChatWidget
            containerId="custom-chat-container"
            hideCoBrowse={true}
            showLoaderStatus={true}
            onChatOpened={handleChatOpen}
            onChatClosed={handleChatClose}
            onError={handleError}
          />
        )}
      </div>
    </ChatProvider>
  );
}
