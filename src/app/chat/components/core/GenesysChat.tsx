'use client';

import { useChat } from '../../hooks/useChat';
import { ChatErrorBoundary } from '../shared/ChatErrorBoundary';
import { LoadingSpinner } from '../shared/LoadingStates';

export const GenesysChat = () => {
  const { isReady, error } = useChat({});

  if (error) {
    return (
      <ChatErrorBoundary>
        <div className="chat-error">
          <p>{String(error)}</p>
        </div>
      </ChatErrorBoundary>
    );
  }

  if (!isReady) {
    return <LoadingSpinner />;
  }

  return (
    <div className="genesys-chat-container" data-testid="genesys-chat">
      {/* Chat will be mounted here by the useChat hook */}
    </div>
  );
};
