import { render } from '@testing-library/react';
import React from 'react';
import type { ChatActions, ChatState } from '../../stores/chatStore';
import {
  createMockChatMessage,
  createMockChatSession,
  createMockPlanInfo,
} from './factories';

export const renderWithChatStore = (
  ui: React.ReactElement,
  initialState: Partial<ChatState & ChatActions> = {},
) => {
  return render(
    <div data-testid="chat-store-provider" {...initialState}>
      {ui}
    </div>,
  );
};

export const mockActiveChatSession = () => {
  const session = createMockChatSession();
  const message = createMockChatMessage();

  return {
    // Session State
    session,
    chatJWT: session.user,
    isAuthenticated: true,
    isExpired: false,

    // UI State
    isOpen: true,
    isMinimized: false,
    isTransitioning: false,
    isSendingMessage: false,
    isLoading: false,

    // Chat State
    messages: [message],
    lastMessageId: message.id,
    currentPlan: createMockPlanInfo(),
    isPlanSwitcherLocked: false,
    error: null,
    chatSession: session,

    // Actions
    initializeSession: jest.fn(),
    clearSession: jest.fn(),
    checkExpiration: jest.fn(),
    openChat: jest.fn(),
    closeChat: jest.fn(),
    minimizeChat: jest.fn(),
    maximizeChat: jest.fn(),
    startChat: jest.fn(),
    endChat: jest.fn(),
    sendMessage: jest.fn(),
    addMessage: jest.fn(),
    clearMessages: jest.fn(),
    setError: jest.fn(),
    lockPlanSwitcher: jest.fn(),
    unlockPlanSwitcher: jest.fn(),
    setSession: jest.fn(),
  };
};

export const mockOutOfBusinessHours = () => {
  return {
    // Session State
    session: null,
    chatJWT: null,
    isAuthenticated: false,
    isExpired: false,

    // UI State
    isOpen: false,
    isMinimized: false,
    isTransitioning: false,
    isSendingMessage: false,
    isLoading: false,

    // Chat State
    messages: [],
    lastMessageId: null,
    currentPlan: null,
    isPlanSwitcherLocked: false,
    error: null,
    chatSession: null,

    // Actions
    initializeSession: jest.fn(),
    clearSession: jest.fn(),
    checkExpiration: jest.fn(),
    openChat: jest.fn(),
    closeChat: jest.fn(),
    minimizeChat: jest.fn(),
    maximizeChat: jest.fn(),
    startChat: jest.fn(),
    endChat: jest.fn(),
    sendMessage: jest.fn(),
    addMessage: jest.fn(),
    clearMessages: jest.fn(),
    setError: jest.fn(),
    lockPlanSwitcher: jest.fn(),
    unlockPlanSwitcher: jest.fn(),
    setSession: jest.fn(),
  };
};

export const mockIneligibleUser = () => {
  const session = createMockChatSession({ isEligibleForChat: false });

  return {
    // Session State
    session,
    chatJWT: session.user,
    isAuthenticated: true,
    isExpired: false,

    // UI State
    isOpen: false,
    isMinimized: false,
    isTransitioning: false,
    isSendingMessage: false,
    isLoading: false,

    // Chat State
    messages: [],
    lastMessageId: null,
    currentPlan: createMockPlanInfo({ isEligibleForChat: false }),
    isPlanSwitcherLocked: false,
    error: null,
    chatSession: session,

    // Actions
    initializeSession: jest.fn(),
    clearSession: jest.fn(),
    checkExpiration: jest.fn(),
    openChat: jest.fn(),
    closeChat: jest.fn(),
    minimizeChat: jest.fn(),
    maximizeChat: jest.fn(),
    startChat: jest.fn(),
    endChat: jest.fn(),
    sendMessage: jest.fn(),
    addMessage: jest.fn(),
    clearMessages: jest.fn(),
    setError: jest.fn(),
    lockPlanSwitcher: jest.fn(),
    unlockPlanSwitcher: jest.fn(),
    setSession: jest.fn(),
  };
};
