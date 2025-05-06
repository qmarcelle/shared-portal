import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWidget } from '@/components/ChatWidget';
import { useChatStore } from '../../../stores/chatStore';

// Mock the chat store
jest.mock('../../../stores/chatStore');

// Cast the mock with unknown first
const mockUseChatStore = useChatStore as unknown as jest.Mock;

describe('Chat Functionality Tests', () => {
  const mockOpenChat = jest.fn();
  const mockCloseChat = jest.fn();
  const mockAddMessage = jest.fn();
  const mockSetError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

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

  it('should open chat when chat button is clicked', async () => {
    render(
      <ChatWidget
        memberId="test-member"
        planId="test-plan"
        planName="Test Plan"
        hasMultiplePlans={true}
        onLockPlanSwitcher={jest.fn()}
        onOpenPlanSwitcher={jest.fn()}
      />,
    );

    // Click the chat button
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    expect(mockOpenChat).toHaveBeenCalled();
  });

  it('should close chat when close button is clicked', async () => {
    // Mock chat as open
    mockUseChatStore.mockImplementation((selector) => {
      const state = {
        isOpen: true,
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

    render(
      <ChatWidget
        memberId="test-member"
        planId="test-plan"
        planName="Test Plan"
        hasMultiplePlans={true}
        onLockPlanSwitcher={jest.fn()}
        onOpenPlanSwitcher={jest.fn()}
      />,
    );

    // Click the close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    expect(mockCloseChat).toHaveBeenCalled();
  });

  it('should send a message when the send button is clicked', async () => {
    // Mock chat as open
    mockUseChatStore.mockImplementation((selector) => {
      const state = {
        isOpen: true,
        isLoading: false,
        isSending: false,
        messages: [],
        session: { id: 'test-session' },
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

    render(
      <ChatWidget
        memberId="test-member"
        planId="test-plan"
        planName="Test Plan"
        hasMultiplePlans={true}
        onLockPlanSwitcher={jest.fn()}
        onOpenPlanSwitcher={jest.fn()}
      />,
    );

    // Type a message
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Hello, this is a test message');

    // Click the send button
    const sendButton = screen.getByRole('button', { name: /send/i });
    await userEvent.click(sendButton);

    expect(mockAddMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Hello, this is a test message',
        sender: 'user',
      }),
    );
  });
});
