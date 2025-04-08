import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWidget } from '../../components/core/ChatWidget';
import { useChatStore } from '../../stores/chatStore';

// Mock the chat store
jest.mock('../../stores/chatStore');

// Cast the mock with unknown first
const mockUseChatStore = useChatStore as unknown as jest.Mock;

describe('US31158: Plan Switcher Lock During Chat', () => {
  const mockLockPlanSwitcher = jest.fn();
  const mockUnlockPlanSwitcher = jest.fn();
  const mockIsPlanSwitcherLocked = false;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup chat store mock
    mockUseChatStore.mockImplementation((selector) => {
      const state = {
        isOpen: false,
        isLoading: false,
        isSending: false,
        messages: [],
        session: null,
        isPlanSwitcherLocked: mockIsPlanSwitcherLocked,
        lockPlanSwitcher: mockLockPlanSwitcher,
        unlockPlanSwitcher: mockUnlockPlanSwitcher,
        openChat: jest.fn(),
        closeChat: jest.fn(),
        addMessage: jest.fn(),
        setError: jest.fn(),
      };
      return selector(state);
    });
  });

  it('should lock plan switcher when chat session starts', async () => {
    render(<ChatWidget />);

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

    // Verify plan switcher was locked
    expect(mockLockPlanSwitcher).toHaveBeenCalled();
  });

  it('should unlock plan switcher when chat session ends', async () => {
    render(<ChatWidget />);

    // Open chat
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    // Start chat
    const startChatButton = screen.getByRole('button', { name: /start chat/i });
    await userEvent.click(startChatButton);

    // Close chat
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    // Verify plan switcher was unlocked
    expect(mockUnlockPlanSwitcher).toHaveBeenCalled();
  });

  it('should prevent plan switching during active chat session', async () => {
    // Mock chat store to simulate active session
    mockUseChatStore.mockImplementation((selector) => {
      const state = {
        isOpen: true,
        isLoading: false,
        isSending: false,
        messages: [],
        session: { id: 'test-session' },
        isPlanSwitcherLocked: true,
        lockPlanSwitcher: mockLockPlanSwitcher,
        unlockPlanSwitcher: mockUnlockPlanSwitcher,
        openChat: jest.fn(),
        closeChat: jest.fn(),
        addMessage: jest.fn(),
        setError: jest.fn(),
      };
      return selector(state);
    });

    render(<ChatWidget />);

    // Verify plan switcher is locked
    expect(mockIsPlanSwitcherLocked).toBe(true);
  });
});
