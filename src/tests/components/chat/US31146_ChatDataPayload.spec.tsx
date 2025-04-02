import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ChatWidget } from '../../../components/chat/core/ChatWidget';
import {
  mockAvailablePlans,
  mockUserEligibility,
} from '../../../mocks/chatData';
import { ClientType, PlanInfo } from '../../../models/chat';

// Mock the chat API
jest.mock('../../../utils/chatAPI', () => ({
  startChatSession: jest.fn().mockResolvedValue({
    sessionId: 'test-session-id',
    startTime: new Date().toISOString(),
    isActive: true,
  }),
  sendChatMessage: jest.fn().mockResolvedValue({
    id: 'test-message-id',
    text: 'Test response',
    sender: 'agent',
    timestamp: Date.now(),
  }),
  endChatSession: jest.fn().mockResolvedValue({ success: true }),
}));

// Add mock for useChatStore before running tests
jest.mock('../../../utils/chatStore', () => {
  // Define mock functions within the mock declaration to avoid reference errors
  const mockReset = jest.fn();
  const mockSetOpen = jest.fn();
  const mockLockPlanSwitcher = jest.fn();
  const mockUnlockPlanSwitcher = jest.fn();
  const mockSetHasMultiplePlans = jest.fn();
  const mockAddMessage = jest.fn();

  // Create a mock store with getState functionality
  const store = {
    isOpen: false,
    setOpen: mockSetOpen,
    messages: [],
    isPlanSwitcherLocked: false,
    lockPlanSwitcher: mockLockPlanSwitcher,
    unlockPlanSwitcher: mockUnlockPlanSwitcher,
    session: null,
    setSession: jest.fn(),
    hasMultiplePlans: false,
    setHasMultiplePlans: mockSetHasMultiplePlans,
    addMessage: mockAddMessage,
    reset: mockReset,
    getState: function () {
      return this;
    },
  };

  // Return the actual implementation with the store
  return {
    useChatStore: jest.fn().mockImplementation(() => store),
  };
});

/**
 * User Story 31146: Chat Data Payload Refresh
 *
 * The chat data payload must update when a member changes plans via the plan switcher
 */
describe('US31146: Chat Data Payload Refresh', () => {
  // Mock PlanSwitcher component
  const PlanSwitcher = ({
    onPlanChange,
  }: {
    onPlanChange: (plan: PlanInfo) => void;
  }) => (
    <select
      data-testid="plan-switcher"
      onChange={(e) => {
        const selectedPlan =
          mockAvailablePlans.find((plan) => plan.planId === e.target.value) ||
          mockAvailablePlans[0];
        onPlanChange(selectedPlan as unknown as PlanInfo);
      }}
    >
      {mockAvailablePlans.map((plan) => (
        <option key={plan.planId} value={plan.planId}>
          {plan.planName}
        </option>
      ))}
    </select>
  );

  // Setup props
  const defaultProps = {
    userEligibility: mockUserEligibility,
    config: {
      token: 'test-token',
      endPoint: 'https://api.example.com/chat',
      opsPhone: '1-800-123-4567',
      memberFirstname: 'John',
      memberLastname: 'Doe',
      memberId: 'MEMBER123',
      groupId: 'GROUP456',
      planId: 'PLAN789',
      planName: 'Premium Health Plan',
      businessHours: {
        isOpen24x7: true,
        days: [],
      },
    },
    currentPlan: {
      planId: 'PLAN789',
      planName: 'Premium Health Plan',
      lineOfBusiness: ClientType.Default,
      isEligibleForChat: true,
      businessHours: 'S_S_24',
    } as PlanInfo,
    availablePlans: [
      {
        planId: 'PLAN789',
        planName: 'Premium Health Plan',
        lineOfBusiness: ClientType.Default,
        isEligibleForChat: true,
        businessHours: 'S_S_24',
      },
      {
        planId: 'PLAN123',
        planName: 'Dental Plan',
        lineOfBusiness: ClientType.Individual,
        isEligibleForChat: true,
        businessHours: 'M_F_8_6',
      },
    ] as PlanInfo[],
    isPlanSwitcherOpen: false,
    openPlanSwitcher: jest.fn(),
    closePlanSwitcher: jest.fn(),
  };

  // Setup GenesysChatService mock
  jest.mock('../../../utils/GenesysChatService', () => {
    return {
      GenesysChatService: jest.fn().mockImplementation(() => ({
        initialize: jest.fn().mockImplementation((payload) => {
          // Store the payload for testing
          (window as any).lastChatPayload = payload;
          return Promise.resolve({ sessionId: 'test-session' });
        }),
        sendMessage: jest.fn().mockResolvedValue({}),
        disconnect: jest.fn().mockResolvedValue({}),
      })),
    };
  });

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    // Clear the stored payload
    (window as any).lastChatPayload = null;
  });

  it('should update chat payload when plan is switched', async () => {
    // Set up component with ability to change plans
    const TestComponent = () => {
      const [currentPlan, setCurrentPlan] = React.useState(
        defaultProps.currentPlan,
      );

      return (
        <>
          <PlanSwitcher onPlanChange={setCurrentPlan} />
          <ChatWidget {...defaultProps} currentPlan={currentPlan} />
        </>
      );
    };

    render(<TestComponent />);

    // Open chat
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    // Complete the chat form (depends on your actual form fields)
    const serviceTypeSelect = screen.getByLabelText(/service.*help/i);
    await userEvent.selectOptions(serviceTypeSelect, 'GENERAL');

    const inquiryTypeSelect = screen.getByLabelText(/specific inquiry/i);
    await userEvent.selectOptions(inquiryTypeSelect, 'BENEFITS');

    // Start chat with initial plan
    const startChatButton = screen.getByRole('button', { name: /start chat/i });
    await userEvent.click(startChatButton);

    // Wait for initialization
    await waitFor(() => {
      // Check if the payload contains the correct plan ID
      const payload = (window as any).lastChatPayload;
      expect(payload?.PLAN_ID).toBe('PLAN789');
    });

    // Close the chat
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    // Switch plan
    const planSwitcher = screen.getByTestId('plan-switcher');
    await userEvent.selectOptions(planSwitcher, 'PLAN123');

    // Reopen chat
    await userEvent.click(chatButton);

    // Complete form again
    await userEvent.selectOptions(serviceTypeSelect, 'GENERAL');
    await userEvent.selectOptions(inquiryTypeSelect, 'BENEFITS');

    // Start chat with new plan
    await userEvent.click(startChatButton);

    // Verify that the chat payload was updated with new plan info
    await waitFor(() => {
      const payload = (window as any).lastChatPayload;
      expect(payload?.PLAN_ID).toBe('PLAN123');
    });
  });

  it('should include all required payload fields', async () => {
    render(<ChatWidget {...defaultProps} />);

    // Open chat
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    // Complete the chat form
    const serviceTypeSelect = screen.getByLabelText(/service.*help/i);
    await userEvent.selectOptions(serviceTypeSelect, 'GENERAL');

    const inquiryTypeSelect = screen.getByLabelText(/specific inquiry/i);
    await userEvent.selectOptions(inquiryTypeSelect, 'BENEFITS');

    // Start chat
    const startChatButton = screen.getByRole('button', { name: /start chat/i });
    await userEvent.click(startChatButton);

    // Verify all required payload fields
    await waitFor(() => {
      const payload = (window as any).lastChatPayload;
      expect(payload).toMatchObject({
        SERV_TYPE: expect.any(String),
        firstname: expect.any(String),
        lastname: expect.any(String),
        PLAN_ID: expect.any(String),
        GROUP_ID: expect.any(String),
        MEMBER_ID: expect.any(String),
        LOB: expect.any(String),
        INQ_TYPE: expect.any(String),
        // Any other required fields
      });
    });
  });
});
