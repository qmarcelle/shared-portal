'use client';

import { ChatError } from '@/app/chat/types/errors';

interface ChatErrorHandlerProps {
  error: ChatError;
  onRetry?: () => void;
  onClose?: () => void;
}

export const ChatErrorHandler: React.FC<ChatErrorHandlerProps> = ({
  error,
  onRetry,
  onClose,
}) => {
  const isRecoverable = error.severity === 'warning';

  return (
    <div className="chat-error-container" role="alert">
      <div className="chat-error-content">
        <h3>{isRecoverable ? 'Warning' : 'Error'}</h3>
        <p>{error.message}</p>
        <div className="chat-error-actions">
          {onRetry && !isRecoverable && (
            <button onClick={onRetry} className="retry-button">
              Retry
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="close-button">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
