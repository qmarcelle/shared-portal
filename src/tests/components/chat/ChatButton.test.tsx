import { fireEvent, render, screen } from '@testing-library/react';
import { ChatButton } from '../../../components/chat/core/ChatButton';
import { useChatStore } from '../../../utils/chatStore';

// Mock the chat store
jest.mock('../../../utils/chatStore', () => ({
  useChatStore: jest.fn(),
}));

describe('ChatButton', () => {
  // Default mock implementation
  const mockSetOpen = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Default mock implementation
    (useChatStore as jest.Mock).mockReturnValue({
      setOpen: mockSetOpen,
    });
  });

  it('renders with default label', () => {
    render(<ChatButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Chat with us');
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

  it('opens chat when clicked', () => {
    render(<ChatButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSetOpen).toHaveBeenCalledWith(true);
  });
});
