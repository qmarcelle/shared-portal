'use client';
import { Button } from '@/components/foundation/Button';
import {
  closeIcon as CloseIcon,
  downIcon as DownIcon,
  upIcon as UpIcon,
} from '@/components/foundation/Icons';
import { useChatStore } from '../stores/chatStore';

/**
 * Minimize / Maximize / Close buttons during active chat
 */
export default function ChatControls() {
  const { isChatActive, isMinimized, endChat, minimizeChat, maximizeChat } =
    useChatStore();
  if (!isChatActive) return null;

  return (
    <div className="chat-controls">
      {isMinimized ? (
        <Button
          icon={<UpIcon />}
          callback={maximizeChat}
          type="ghost"
          className="chat-control-button"
          label="Maximize chat"
        />
      ) : (
        <Button
          icon={<DownIcon />}
          callback={minimizeChat}
          type="ghost"
          className="chat-control-button"
          label="Minimize chat"
        />
      )}
      <Button
        icon={<CloseIcon />}
        callback={endChat}
        type="ghost"
        className="chat-control-button"
        label="Close chat"
      />
    </div>
  );
}
