import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ChatWidget } from '../../components/core/ChatWidget';
import { useChatStore } from '../../stores/chatStore';
import { createMockPlanInfo } from '../utils/factories';

// Mock the chat store
jest.mock('../../stores/chatStore', () => ({
  useChatStore: jest.fn(),
}));

// Cast the mock with unknown first
const mockUseChatStore = useChatStore as unknown as jest.Mock;

/**
 * User Story 31146: Chat Data Payload Refresh
 *
 * The chat data payload must update when a member changes plans via the plan switcher
 */
describe('US31146: Chat Data Payload Update', () => {
  const mockOpenChat = jest.fn();
  const mockCloseChat = jest.fn();
  const mockAddMessage = jest.fn();
  const mockSetError = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Use the properly cast mock
    mockUseChatStore.mockImplementation((selector) => {
      const state = {
        isOpen: false,
        isLoading: false,
        isSending: false,
        messages: [],
        session: null,
        isPlanSwitcherLocked: false,
        lockPlanSwitcher: jest.fn(),
        unlockPlanSwitcher: jest.fn(),
        openChat: mockOpenChat,
        closeChat: mockCloseChat,
        addMessage: mockAddMessage,
        setError: mockSetError,
      };
      return selector(state);
    });
  });

  it('should update chat payload when plan is switched', async () => {
    // Set up component with ability to change plans
    const TestComponent = () => {
      const [currentPlan, setCurrentPlan] =
        React.useState(createMockPlanInfo());

      // Update store when plan changes
      React.useEffect(() => {
        const store = useChatStore.getState();
        store.setCurrentPlan(currentPlan);
        store.setAvailablePlans([
          createMockPlanInfo({ id: 'PLAN123' }),
          createMockPlanInfo({ id: 'PLAN456' }),
          createMockPlanInfo({ id: 'PLAN789' }),
        ]);
      }, [currentPlan]);

      return (
        <>
          <select
            data-testid="plan-switcher"
            onChange={(e) => {
              setCurrentPlan(createMockPlanInfo({ id: e.target.value }));
            }}
          >
            <option value="PLAN123">Plan 1</option>
            <option value="PLAN456">Plan 2</option>
            <option value="PLAN789">Plan 3</option>
          </select>
          <ChatWidget />
        </>
      );
    };

    render(<TestComponent />);

    // Open chat
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    // Complete the chat form
    const serviceTypeSelect = screen.getByLabelText(/service.*help/i);
    await userEvent.selectOptions(serviceTypeSelect, 'GENERAL');

    const inquiryTypeSelect = screen.getByLabelText(/specific inquiry/i);
    await userEvent.selectOptions(inquiryTypeSelect, 'BENEFITS');

    // Start chat with initial plan
    const startChatButton = screen.getByRole('button', { name: /start chat/i });
    await userEvent.click(startChatButton);

    // Switch plan
    const planSwitcher = screen.getByTestId('plan-switcher');
    await userEvent.selectOptions(planSwitcher, 'PLAN789');

    // Wait for initialization
    await waitFor(() => {
      // Check if the chat was reopened with new plan
      expect(mockCloseChat).toHaveBeenCalled();
      expect(mockOpenChat).toHaveBeenCalled();
    });
  });

  it('should handle plan switch during active chat session', async () => {
    // Mock chat store to simulate active session
    mockUseChatStore.mockImplementation((selector) => {
      const state = {
        isOpen: true,
        isLoading: false,
        isSending: false,
        messages: [],
        session: { id: 'test-session' },
        isPlanSwitcherLocked: true,
        currentPlan: createMockPlanInfo(),
        availablePlans: [createMockPlanInfo()],
        lockPlanSwitcher: jest.fn(),
        unlockPlanSwitcher: jest.fn(),
        openChat: mockOpenChat,
        closeChat: mockCloseChat,
        addMessage: mockAddMessage,
        setError: mockSetError,
      };
      return selector(state);
    });

    render(<ChatWidget />);

    // Verify error is shown when trying to switch plans during active chat
    expect(
      screen.getByText(
        /plan switching is disabled during an active chat session/i,
      ),
    ).toBeInTheDocument();
  });
});
