import { render, screen } from '@testing-library/react';
import { ChatButton } from '../../components/core/ChatButton';
import { useChatStore } from '../../stores/chatStore';

jest.mock('../../stores/chatStore');

describe('ChatButton', () => {
  it('renders chat button', () => {
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      openChat: jest.fn(),
    });

    render(<ChatButton />);
    expect(screen.getByText('Chat with Us')).toBeInTheDocument();
  });

  it('calls openChat when clicked', () => {
    const mockOpenChat = jest.fn();
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      openChat: mockOpenChat,
    });

    render(<ChatButton />);
    screen.getByText('Chat with Us').click();
    expect(mockOpenChat).toHaveBeenCalled();
  });

  it('calls custom onClick when provided', () => {
    const mockOnClick = jest.fn();
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      openChat: jest.fn(),
    });

    render(<ChatButton onClick={mockOnClick} />);
    screen.getByText('Chat with Us').click();
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('renders with custom label', () => {
    const customLabel = 'Get Support';
    render(<ChatButton label={customLabel} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(customLabel);
  });

  it('applies custom className', () => {
    render(<ChatButton className="custom-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
