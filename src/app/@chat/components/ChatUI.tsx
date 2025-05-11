'use client';

import { useChatStore } from '../stores/chatStore';

interface ChatSessionProps {
  isOpen: boolean;
  isChatActive: boolean;
  isLoading: boolean;
  error: Error | string | null;
  startChat: () => void;
  endChat: () => void;
}

interface ChatUIProps {
  chatSession: ChatSessionProps;
  mode: 'legacy' | 'cloud';
}

/**
 * Shared UI component for chat interfaces
 * Used by both legacy and cloud chat wrappers to maintain consistent UI
 */
export function ChatUI({ chatSession, mode }: ChatUIProps) {
  const { isPlanSwitcherLocked } = useChatStore();

  if (!chatSession.isOpen) {
    return null;
  }

  return (
    <div className={`chat-ui chat-ui-${mode}`}>
      {chatSession.isChatActive ? (
        <div className="chat-active">
          <div className="chat-header">
            <span>Chat is active ({mode})</span>
            {isPlanSwitcherLocked && (
              <span className="plan-switcher-locked">
                Plan switching is disabled during chat
              </span>
            )}
          </div>
          <button
            className="chat-end-button"
            onClick={chatSession.endChat}
            aria-label="End chat session"
          >
            End Chat
          </button>
        </div>
      ) : (
        <button
          className="chat-start-button"
          onClick={chatSession.startChat}
          aria-label="Start a new chat session"
        >
          Start Chat
        </button>
      )}

      {chatSession.isLoading && <div className="chat-loading">Loading...</div>}

      {chatSession.error && (
        <div className="chat-error">
          {typeof chatSession.error === 'string'
            ? chatSession.error
            : chatSession.error.message || JSON.stringify(chatSession.error)}
        </div>
      )}
    </div>
  );
}
