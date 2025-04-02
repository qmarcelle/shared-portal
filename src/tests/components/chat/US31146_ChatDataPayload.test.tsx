import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useChatStore } from '../../../chat/providers';
import { ChatWidget } from '../../../components/chat/core/ChatWidget';
import {
  createMockChatConfig,
  createMockPlanInfo,
  createMockUserEligibility,
} from '../../../tests/mocks/factories';

// Mock the chat store
jest.mock('../../../chat/providers', () => ({
  useChatStore: jest.fn(),
}));

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

    // Setup chat store mock
    (useChatStore as jest.Mock).mockImplementation((selector) => {
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

      return (
        <>
          <select
            data-testid="plan-switcher"
            onChange={(e) => {
              setCurrentPlan(createMockPlanInfo({ planId: e.target.value }));
            }}
          >
            <option value="PLAN123">Plan 1</option>
            <option value="PLAN456">Plan 2</option>
            <option value="PLAN789">Plan 3</option>
          </select>
          <ChatWidget
            config={createMockChatConfig()}
            userEligibility={createMockUserEligibility()}
            currentPlan={currentPlan}
            availablePlans={[
              createMockPlanInfo({ planId: 'PLAN123' }),
              createMockPlanInfo({ planId: 'PLAN456' }),
              createMockPlanInfo({ planId: 'PLAN789' }),
            ]}
          />
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
    (useChatStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        isOpen: true,
        isLoading: false,
        isSending: false,
        messages: [],
        session: { id: 'test-session' },
        isPlanSwitcherLocked: true,
        lockPlanSwitcher: jest.fn(),
        unlockPlanSwitcher: jest.fn(),
        openChat: mockOpenChat,
        closeChat: mockCloseChat,
        addMessage: mockAddMessage,
        setError: mockSetError,
      };
      return selector(state);
    });

    render(
      <ChatWidget
        config={createMockChatConfig()}
        userEligibility={createMockUserEligibility()}
        currentPlan={createMockPlanInfo()}
        availablePlans={[createMockPlanInfo()]}
      />,
    );

    // Verify error is shown when trying to switch plans during active chat
    expect(
      screen.getByText(
        /plan switching is disabled during an active chat session/i,
      ),
    ).toBeInTheDocument();
  });
});
