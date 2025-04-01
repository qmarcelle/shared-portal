import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatButton } from '../../../components/chat/core/ChatButton';
import { useChatStore } from '../../../utils/chatStore';

// Mock the chat store
jest.mock('../../../utils/chatStore', () => ({
  useChatStore: jest.fn(),
}));

describe('ChatButton', () => {
  it('should render the chat button correctly', () => {
    // Mock the store state
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      isOpen: false,
      setOpen: jest.fn(),
      messages: [],
    });

    render(<ChatButton />);

    // Check if button is rendered
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Chat with Us');
  });

  it('should open chat when clicked', async () => {
    // Setup a mock function for setOpen
    const mockSetOpen = jest.fn();

    // Mock the store state
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      isOpen: false,
      setOpen: mockSetOpen,
      messages: [],
    });

    render(<ChatButton />);

    // Click the button
    const button = screen.getByRole('button');
    await userEvent.click(button);

    // Check if setOpen was called with true
    expect(mockSetOpen).toHaveBeenCalledWith(true);
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
