import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWidget } from '../../../components/chat/core/ChatWidget';
import { mockUserEligibility } from '../../../mocks/chatData';
import { ClientType, PlanInfo } from '../../../models/chat';
import { useChatStore } from '../../../utils/chatStore';

// Mock chat API
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

// Mock GenesysChatService
jest.mock('../../../utils/GenesysChatService', () => {
  return {
    GenesysChatService: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue({ sessionId: 'test-session' }),
      sendMessage: jest.fn().mockResolvedValue({}),
      disconnect: jest.fn().mockResolvedValue({}),
    })),
  };
});

// Mock CobrowseService
jest.mock('../../../utils/CobrowseService', () => {
  return {
    CobrowseService: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue({}),
      createSession: jest.fn().mockResolvedValue('test-code'),
      endSession: jest.fn().mockResolvedValue({}),
    })),
  };
});

/**
 * User Story 31158: Plan Switcher is Locked when a Chat is Started and Unlocked when the Chat is Closed
 *
 * - Plan switcher must be locked during active chat sessions
 * - Plan switcher must be unlocked when a chat session ends
 * - Locked state must persist while chat window remains visible
 */
describe('US31158: Plan Switcher Lock', () => {
  const mockOpenPlanSwitcher = jest.fn();
  const mockClosePlanSwitcher = jest.fn();

  // Mock plan switcher component
  const PlanSwitcher = ({
    isPlanSwitcherLocked,
  }: {
    isPlanSwitcherLocked: boolean;
  }) => (
    <select
      data-testid="plan-switcher"
      disabled={isPlanSwitcherLocked}
      title={
        isPlanSwitcherLocked
          ? 'End your chat session to switch plan information.'
          : ''
      }
    >
      <option value="plan1">Plan 1</option>
      <option value="plan2">Plan 2</option>
    </select>
  );

  // Default props for the ChatWidget component
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
    openPlanSwitcher: mockOpenPlanSwitcher,
    closePlanSwitcher: mockClosePlanSwitcher,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset chat store state
    useChatStore.getState().reset();
  });

  it('should lock plan switcher when chat is started', async () => {
    // Set up components with chat widget and plan switcher
    const TestComponent = () => {
      const { isPlanSwitcherLocked } = useChatStore();

      return (
        <>
          <PlanSwitcher isPlanSwitcherLocked={isPlanSwitcherLocked} />
          <ChatWidget {...defaultProps} />
        </>
      );
    };

    render(<TestComponent />);

    // Verify plan switcher is initially enabled
    const planSwitcher = screen.getByTestId('plan-switcher');
    expect(planSwitcher).not.toBeDisabled();

    // Open chat
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    // Complete and submit the chat form
    const serviceTypeSelect = screen.getByLabelText(/service.*help/i);
    await userEvent.selectOptions(serviceTypeSelect, 'GENERAL');

    const inquiryTypeSelect = screen.getByLabelText(/specific inquiry/i);
    await userEvent.selectOptions(inquiryTypeSelect, 'BENEFITS');

    const startChatButton = screen.getByRole('button', { name: /start chat/i });
    await userEvent.click(startChatButton);

    // Verify plan switcher is now disabled
    await waitFor(() => {
      expect(planSwitcher).toBeDisabled();
    });

    // Verify hover message is set
    expect(planSwitcher).toHaveAttribute(
      'title',
      'End your chat session to switch plan information.',
    );
  });

  it('should unlock plan switcher when chat session ends', async () => {
    const TestComponent = () => {
      const { isPlanSwitcherLocked } = useChatStore();

      return (
        <>
          <PlanSwitcher isPlanSwitcherLocked={isPlanSwitcherLocked} />
          <ChatWidget {...defaultProps} />
        </>
      );
    };

    render(<TestComponent />);

    // Open chat
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    // Submit the chat form
    const serviceTypeSelect = screen.getByLabelText(/service.*help/i);
    await userEvent.selectOptions(serviceTypeSelect, 'GENERAL');

    const inquiryTypeSelect = screen.getByLabelText(/specific inquiry/i);
    await userEvent.selectOptions(inquiryTypeSelect, 'BENEFITS');

    const startChatButton = screen.getByRole('button', { name: /start chat/i });
    await userEvent.click(startChatButton);

    // Verify plan switcher is locked
    const planSwitcher = screen.getByTestId('plan-switcher');
    await waitFor(() => {
      expect(planSwitcher).toBeDisabled();
    });

    // Close the chat
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    // Verify plan switcher is unlocked after closing chat
    await waitFor(() => {
      expect(planSwitcher).not.toBeDisabled();
    });
  });

  it('should display a warning message about locked plan switcher', async () => {
    render(<ChatWidget {...defaultProps} />);

    // Open chat
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    // Submit the chat form
    const serviceTypeSelect = screen.getByLabelText(/service.*help/i);
    await userEvent.selectOptions(serviceTypeSelect, 'GENERAL');

    const inquiryTypeSelect = screen.getByLabelText(/specific inquiry/i);
    await userEvent.selectOptions(inquiryTypeSelect, 'BENEFITS');

    const startChatButton = screen.getByRole('button', { name: /start chat/i });
    await userEvent.click(startChatButton);

    // Verify warning message about locked plan switcher is displayed
    await waitFor(() => {
      expect(
        screen.getByText(
          /plan switching is disabled during an active chat session/i,
        ),
      ).toBeInTheDocument();
    });
  });
});
