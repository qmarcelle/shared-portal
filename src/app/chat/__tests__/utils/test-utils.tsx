import { render } from '@testing-library/react';
import React from 'react';
import { ChatState } from '../../stores/chatStore';
import {
  createMockChatMessage,
  createMockChatSession,
  createMockPlanInfo,
} from './factories';

export const renderWithChatStore = (
  ui: React.ReactElement,
  initialState: Partial<ChatState> = {},
) => {
  return render(<div data-testid="chat-store-provider">{ui}</div>);
};

export const mockActiveChatSession = () => {
  const session = createMockChatSession();
  const message = createMockChatMessage();

  return {
    // UI State
    isOpen: true,
    isPlanSwitcherLocked: true,
    showPlanSwitcherMessage: false,
    showCobrowseConsent: false,
    cobrowseSessionCode: null,

    // Messages State
    messages: [message],
    isSending: false,
    error: null,

    // Session State
    session,
    isInitializing: false,
    isWithinBusinessHours: true,

    // Plan Switching State
    currentPlan: createMockPlanInfo(),
    availablePlans: [createMockPlanInfo()],
    isPlanSwitcherOpen: false,

    // Actions
    openChat: jest.fn(),
    closeChat: jest.fn(),
    addMessage: jest.fn(),
    clearMessages: jest.fn(),
    setError: jest.fn(),
    initializeSession: jest.fn(),
    endSession: jest.fn(),
    setCurrentPlan: jest.fn(),
    setAvailablePlans: jest.fn(),
    openPlanSwitcher: jest.fn(),
    closePlanSwitcher: jest.fn(),
    lockPlanSwitcher: jest.fn(),
    unlockPlanSwitcher: jest.fn(),
    setShowPlanSwitcherMessage: jest.fn(),
    setCobrowseSessionCode: jest.fn(),
    setShowCobrowseConsent: jest.fn(),
    setBusinessHours: jest.fn(),
  };
};

export const mockOutOfBusinessHours = () => {
  return {
    // UI State
    isOpen: false,
    isPlanSwitcherLocked: false,
    showPlanSwitcherMessage: false,
    showCobrowseConsent: false,
    cobrowseSessionCode: null,

    // Messages State
    messages: [],
    isSending: false,
    error: null,

    // Session State
    session: null,
    isInitializing: false,
    isWithinBusinessHours: false,

    // Plan Switching State
    currentPlan: createMockPlanInfo(),
    availablePlans: [createMockPlanInfo()],
    isPlanSwitcherOpen: false,

    // Actions
    openChat: jest.fn(),
    closeChat: jest.fn(),
    addMessage: jest.fn(),
    clearMessages: jest.fn(),
    setError: jest.fn(),
    initializeSession: jest.fn(),
    endSession: jest.fn(),
    setCurrentPlan: jest.fn(),
    setAvailablePlans: jest.fn(),
    openPlanSwitcher: jest.fn(),
    closePlanSwitcher: jest.fn(),
    lockPlanSwitcher: jest.fn(),
    unlockPlanSwitcher: jest.fn(),
    setShowPlanSwitcherMessage: jest.fn(),
    setCobrowseSessionCode: jest.fn(),
    setShowCobrowseConsent: jest.fn(),
    setBusinessHours: jest.fn(),
  };
};

export const mockIneligibleUser = () => {
  return {
    // UI State
    isOpen: false,
    isPlanSwitcherLocked: false,
    showPlanSwitcherMessage: false,
    showCobrowseConsent: false,
    cobrowseSessionCode: null,

    // Messages State
    messages: [],
    isSending: false,
    error: null,

    // Session State
    session: null,
    isInitializing: false,
    isWithinBusinessHours: true,

    // Plan Switching State
    currentPlan: createMockPlanInfo({ isEligibleForChat: false }),
    availablePlans: [createMockPlanInfo({ isEligibleForChat: false })],
    isPlanSwitcherOpen: false,

    // Actions
    openChat: jest.fn(),
    closeChat: jest.fn(),
    addMessage: jest.fn(),
    clearMessages: jest.fn(),
    setError: jest.fn(),
    initializeSession: jest.fn(),
    endSession: jest.fn(),
    setCurrentPlan: jest.fn(),
    setAvailablePlans: jest.fn(),
    openPlanSwitcher: jest.fn(),
    closePlanSwitcher: jest.fn(),
    lockPlanSwitcher: jest.fn(),
    unlockPlanSwitcher: jest.fn(),
    setShowPlanSwitcherMessage: jest.fn(),
    setCobrowseSessionCode: jest.fn(),
    setShowCobrowseConsent: jest.fn(),
    setBusinessHours: jest.fn(),
  };
};
