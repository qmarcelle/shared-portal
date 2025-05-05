// ChatLoader.tsx
'use client';
import { Button } from '@/components/foundation/Button';
import { ReactNode } from 'react';
import usePlanSwitcherLock from '../hooks/usePlanSwitcherLock';
import { useChatStore } from '../stores/chatStore';

interface ChatWidgetProps {
  children: ReactNode;
}

/**
 * Main chat widget component that provides:
 * - A launcher button (Start Chat / In Chat)
 * - Plan switcher locking while in chat
 * - Proper disabling based on eligibility and business hours
 */
export default function ChatWidget({ children }: ChatWidgetProps) {
  const { isEligible, isOOO, isChatActive, startChat } = useChatStore();

  // Lock plan switcher when in chat
  usePlanSwitcherLock();

  // Disable button when not eligible, out of office hours, or already in chat
  const disabled = !isEligible || isOOO || isChatActive;
  const label = isChatActive ? 'In Chat' : 'Start Chat';

  return (
    <div className="chat-widget">
      <Button
        label={label}
        callback={startChat}
        disabled={disabled}
        className="chat-launcher-button"
        type="primary"
      />

      <div className="chat-content">{children}</div>
    </div>
  );
}
