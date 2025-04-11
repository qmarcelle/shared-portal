import { Button } from '@/components/foundation/Button';
import { useChatStore } from '../stores/chatStore';

interface ChatTriggerProps {
  label?: string;
  className?: string;
  onOpen?: () => void;
}

export function ChatTrigger({
  label = 'Chat with Us',
  className = '',
  onOpen,
}: ChatTriggerProps) {
  const { openChat, isOpen } = useChatStore();

  const handleClick = () => {
    openChat();
    onOpen?.();
  };

  return (
    <Button
      type="primary"
      label={label}
      callback={!isOpen ? handleClick : undefined}
      className={className}
      disabled={isOpen}
    />
  );
}
