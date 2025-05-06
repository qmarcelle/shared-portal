// src/app/chat/layout.tsx
import ChatLoader from '@/app/@chat/components/ChatLoader';
import { ReactNode } from 'react';

interface ChatLayoutProps {
  children: ReactNode;
  params: { memberId: string; planId: string };
}

export default function ChatLayout({ children, params }: ChatLayoutProps) {
  const memberId = Number(params.memberId);
  const planId = params.planId;

  return (
    <div className="chat-layout">
      <ChatLoader memberId={memberId} planId={planId} />
      {children}
    </div>
  );
}
