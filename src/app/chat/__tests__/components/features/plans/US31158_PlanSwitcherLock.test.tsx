import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWidget } from '../../../../../../app/chat/components/core/ChatWidget';
import { ClientType } from '../../../../../../app/chat/models/plans';
import { useChatStore } from '../../../../stores/chatStore';

// Mock chat API
jest.mock('../../../../../../app/chat/services/chatAPI', () => ({
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
jest.mock('../../../../../../app/chat/services/GenesysChatService', () => {
  return {
    GenesysChatService: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue({ sessionId: 'test-session' }),
      sendMessage: jest.fn().mockResolvedValue({}),
      disconnect: jest.fn().mockResolvedValue({}),
    })),
  };
});

// Mock CobrowseService
jest.mock('../../../../../../app/chat/services/CobrowseService', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset chat store state and initialize with test data
    const store = useChatStore.getState();
    store.reset();
    store.setCurrentPlan({
      id: 'PLAN789',
      name: 'Premium Health Plan',
      lineOfBusiness: ClientType.Default,
      isChatEligible: true,
      businessHours: {
        isOpen24x7: true,
        days: [],
        timezone: 'America/New_York',
        isCurrentlyOpen: true,
        lastUpdated: Date.now(),
        source: 'api',
      },
      termsAndConditions: '',
      isActive: true,
    });
    store.setAvailablePlans([
      {
        id: 'PLAN789',
        name: 'Premium Health Plan',
        lineOfBusiness: ClientType.Default,
        isChatEligible: true,
        businessHours: {
          isOpen24x7: true,
          days: [],
          timezone: 'America/New_York',
          isCurrentlyOpen: true,
          lastUpdated: Date.now(),
          source: 'api',
        },
        termsAndConditions: '',
        isActive: true,
      },
      {
        id: 'PLAN123',
        name: 'Dental Plan',
        lineOfBusiness: ClientType.Individual,
        isChatEligible: true,
        businessHours: {
          isOpen24x7: false,
          days: [],
          timezone: 'America/New_York',
          isCurrentlyOpen: true,
          lastUpdated: Date.now(),
          source: 'api',
        },
        termsAndConditions: '',
        isActive: true,
      },
    ]);
  });

  it('should lock plan switcher when chat is started', async () => {
    // Set up components with chat widget and plan switcher
    const TestComponent = () => {
      const { isPlanSwitcherLocked } = useChatStore();

      return (
        <>
          <PlanSwitcher isPlanSwitcherLocked={isPlanSwitcherLocked} />
          <ChatWidget />
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

    // Start chat
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
          <ChatWidget />
        </>
      );
    };

    render(<TestComponent />);

    // Open chat
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    // Start chat
    const startChatButton = screen.getByRole('button', { name: /start chat/i });
    await userEvent.click(startChatButton);

    // Verify plan switcher is disabled
    await waitFor(() => {
      expect(screen.getByTestId('plan-switcher')).toBeDisabled();
    });

    // End chat
    const endChatButton = screen.getByRole('button', { name: /end chat/i });
    await userEvent.click(endChatButton);

    // Verify plan switcher is enabled
    await waitFor(() => {
      expect(screen.getByTestId('plan-switcher')).not.toBeDisabled();
    });
  });

  it('should display a warning message about locked plan switcher', async () => {
    render(<ChatWidget />);

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
