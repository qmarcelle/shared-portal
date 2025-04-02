import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClientType, PlanInfo } from './__mocks__/chatModels';
import { ChatWidget } from './__mocks__/ChatWidget';
import { renderWithChatProvider, setupChatTests } from './ChatTestSetup';

// Mock the chat store
jest.mock('../../../app/chat/stores/chatStore', () => {
  return {
    ...jest.requireActual('./__mocks__/chatStore'),
  };
});

// Import the chat store after mocking
import { useChatStore } from '../../../app/chat/stores/chatStore';

// Setup MSW for tests
setupChatTests();

// Mock PlanSwitcher component
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

describe('US31158: Plan Switcher Lock', () => {
  const mockOpenPlanSwitcher = jest.fn();

  // Mock plans
  const eligiblePlan: PlanInfo = {
    planId: 'MBSSOV2E',
    planName: 'Premium Health Plan',
    lineOfBusiness: ClientType.Default,
    isEligibleForChat: true,
    businessHours: 'S_S_24', // 24/7 availability
  } as PlanInfo;

  // Default props
  const defaultProps = {
    currentPlan: eligiblePlan,
    availablePlans: [eligiblePlan],
    isPlanSwitcherOpen: false,
    openPlanSwitcher: mockOpenPlanSwitcher,
    closePlanSwitcher: jest.fn(),
  };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    // Reset chat store
    useChatStore.getState().setOpen(false);
    useChatStore.getState().unlockPlanSwitcher();
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

    renderWithChatProvider(<TestComponent />);

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

  it('should unlock plan switcher when chat is closed', async () => {
    // Set up component
    const TestComponent = () => {
      const { isPlanSwitcherLocked } = useChatStore();

      return (
        <>
          <PlanSwitcher isPlanSwitcherLocked={isPlanSwitcherLocked} />
          <ChatWidget {...defaultProps} />
        </>
      );
    };

    renderWithChatProvider(<TestComponent />);

    // Start a chat
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

    // Verify plan switcher is unlocked
    await waitFor(() => {
      expect(planSwitcher).not.toBeDisabled();
    });
  });

  it('should display a warning message about locked plan switcher', async () => {
    renderWithChatProvider(<ChatWidget {...defaultProps} />);

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
