import { ChatFooter } from '@/app/chat/components/core/ChatFooter';
import { useChatStore } from '@/chat/providers';
import { AlertBar } from '@/components/foundation/AlertBar';
import { Card } from '@/components/foundation/Card';
import { Loader } from '@/components/foundation/Loader';
import { useChatEligibility } from '../../hooks/useChatEligibility';
import { ChatMessage } from '../../models/message';
import { ChatBody } from './ChatBody';
import { ChatHeader } from './ChatHeader';

export const ChatWidget = () => {
  const {
    isOpen,
    isLoading,
    isSendingMessage,
    error,
    openChat,
    addMessage,
    setError,
  } = useChatStore();
  const {
    isLoading: isEligibilityLoading,
    error: eligibilityError,
    isEligible,
  } = useChatEligibility();

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    try {
      const chatMessage: ChatMessage = {
        id: crypto.randomUUID(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
      };
      addMessage(chatMessage);
      // TODO: Implement actual message sending
    } catch (err) {
      setError('Failed to send message');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={openChat}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full"
      >
        Chat with us
      </button>
    );
  }

  const renderContent = () => {
    if (isLoading || isEligibilityLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      );
    }

    return (
      <div className="flex flex-col flex-1">
        {(error || eligibilityError) && (
          <AlertBar alerts={[error || eligibilityError || '']} />
        )}
        {!isEligible && (
          <AlertBar alerts={['Chat is not available for your current plan']} />
        )}
        <ChatBody />
        <ChatFooter
          onSendMessage={handleSendMessage}
          isSending={isSendingMessage}
          disabled={!isEligible}
        />
      </div>
    );
  };

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[600px] flex flex-col">
      <div className="flex flex-col flex-1">
        <ChatHeader />
        {renderContent()}
      </div>
    </Card>
  );
};
