import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatHeader } from '../../../components/chat/core/ChatHeader';
import { useChatStore } from '../../../utils/chatStore';

// Mock the chat store
jest.mock('../../../utils/chatStore', () => ({
  useChatStore: jest.fn(),
}));

describe('ChatHeader', () => {
  let mockSetOpen: jest.Mock;

  beforeEach(() => {
    mockSetOpen = jest.fn();
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      setOpen: mockSetOpen,
    });
  });

  test('renders with default title', () => {
    render(<ChatHeader />);

    const heading = screen.getByRole('heading', { name: 'Chat with us' });
    expect(heading).toBeInTheDocument();
  });

  test('renders with custom title', () => {
    render(<ChatHeader title="Custom Header Title" />);

    const heading = screen.getByRole('heading', {
      name: 'Custom Header Title',
    });
    expect(heading).toBeInTheDocument();
  });

  test('renders with Amplify title when isAmplifyMember is true', () => {
    render(<ChatHeader isAmplifyMember={true} />);

    const heading = screen.getByRole('heading', {
      name: 'Chat with an advisor',
    });
    expect(heading).toBeInTheDocument();
  });

  test('applies additional className', () => {
    render(<ChatHeader className="test-class" />);

    const header = screen.getByRole('heading').parentElement;
    expect(header?.className).toContain('test-class');
  });

  test('calls setOpen(false) when close button is clicked', () => {
    render(<ChatHeader />);

    const closeButton = screen.getByRole('button', { name: 'Close chat' });
    fireEvent.click(closeButton);

    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it('should close chat when close button is clicked', async () => {
    // Setup mock function
    const mockSetOpen = jest.fn();

    // Mock the store state with proper type casting
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      setOpen: mockSetOpen,
      session: null,
    });

    render(<ChatHeader title="Chat With Us" />);

    // Check if the title is rendered
    expect(screen.getByText('Chat With Us')).toBeInTheDocument();

    // Check if close button works
    const closeButton = screen.getByRole('button');
    await userEvent.click(closeButton);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it('should render the header with close button', async () => {
    // Setup mock function
    const mockSetOpen = jest.fn();

    // Mock the store state
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      setOpen: mockSetOpen,
      session: null,
    });

    render(<ChatHeader title="Chat Support" />);

    // Check if the title is rendered
    expect(screen.getByText('Chat Support')).toBeInTheDocument();

    // Check if close button works
    const closeButton = screen.getByRole('button');
    await userEvent.click(closeButton);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});
