import React, { createContext, useMemo } from 'react';
import { ChatService } from '../services/ChatService';

export const ChatServiceContext = createContext<ChatService | null>(null);

interface ChatServiceProviderProps {
  children: React.ReactNode;
  memberId: string;
  planId: string;
  planName: string;
  hasMultiplePlans: boolean;
  onLockPlanSwitcher: (locked: boolean) => void;
}

export function ChatServiceProvider(
  props: ChatServiceProviderProps,
): JSX.Element {
  const chatService = useMemo(
    () =>
      new ChatService(
        props.memberId,
        props.planId,
        props.planName,
        props.hasMultiplePlans,
        props.onLockPlanSwitcher,
      ),
    [
      props.memberId,
      props.planId,
      props.planName,
      props.hasMultiplePlans,
      props.onLockPlanSwitcher,
    ],
  );

  return (
    <ChatServiceContext.Provider value={chatService}>
      {props.children}
    </ChatServiceContext.Provider>
  );
}
