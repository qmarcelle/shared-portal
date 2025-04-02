import { render, screen } from '@testing-library/react';
import { ChatHeader } from '../../../../components/chat/core/ChatHeader';
import { useChatStore } from '../../../../tests/mocks/chatStore';

jest.mock('../../../../tests/mocks/chatStore');

describe('ChatHeader', () => {
  it('renders chat header', () => {
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      closeChat: jest.fn(),
    });

    render(<ChatHeader />);
    expect(screen.getByText('Chat Support')).toBeInTheDocument();
  });

  it('calls closeChat when close button is clicked', () => {
    const mockCloseChat = jest.fn();
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      closeChat: mockCloseChat,
    });

    render(<ChatHeader />);
    screen.getByRole('button').click();
    expect(mockCloseChat).toHaveBeenCalled();
  });
});
