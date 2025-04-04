import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWidget } from '../../components/core/ChatWidget';
import { useChatStore } from '../../stores/chatStore';

// Mock the chat store
jest.mock('../../stores/chatStore', () => ({
  useChatStore: jest.fn(),
}));

describe('Chat Functionality Tests', () => {
  const mockOpenChat = jest.fn();
  const mockCloseChat = jest.fn();
  const mockAddMessage = jest.fn();
  const mockSetError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

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

  it('should open chat when chat button is clicked', async () => {
    render(<ChatWidget />);

    // Click the chat button
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    expect(mockOpenChat).toHaveBeenCalled();
  });

  it('should close chat when close button is clicked', async () => {
    // Mock chat as open
    (useChatStore as jest.Mock).mockImplementation((selector) => {
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

    render(<ChatWidget />);

    // Click the close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    expect(mockCloseChat).toHaveBeenCalled();
  });

  it('should send a message when the send button is clicked', async () => {
    // Mock chat as open
    (useChatStore as jest.Mock).mockImplementation((selector) => {
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

    render(<ChatWidget />);

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
