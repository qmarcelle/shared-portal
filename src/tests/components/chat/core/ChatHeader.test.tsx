import { render, screen } from '@testing-library/react';
import { ChatHeader } from '../../../../components/chat/core/ChatHeader';
import { useChatStore } from '../../../../utils/chatStore';

// Mock the chat store
jest.mock('../../../../utils/chatStore', () => ({
  useChatStore: jest.fn(),
}));

describe('ChatHeader', () => {
  it('renders with default title', () => {
    // Mock the store state
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      isOpen: true,
      setOpen: jest.fn(),
    });

    render(<ChatHeader />);

    // Check if title is rendered
    const titleElement = screen.getByText('Chat with Us');
    expect(titleElement).toBeInTheDocument();

    // Check if close button is rendered
    const closeButton = screen.getByRole('button', { name: /close chat/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<ChatHeader title="Custom Header Title" />);

    const titleElement = screen.getByText('Custom Header Title');
    expect(titleElement).toBeInTheDocument();
  });

  it('renders Amplify title for Amplify members', () => {
    render(<ChatHeader isAmplifyMember={true} />);

    const titleElement = screen.getByText('Amplify Support');
    expect(titleElement).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ChatHeader className="test-class" />);

    const headerElement = screen.getByRole('heading', {
      level: 2,
    }).parentElement;
    expect(headerElement).toHaveClass('test-class');
  });

  it('closes chat when close button is clicked', () => {
    const mockSetOpen = jest.fn();

    // Mock the store state
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      isOpen: true,
      setOpen: mockSetOpen,
    });

    render(<ChatHeader />);

    const closeButton = screen.getByRole('button', { name: /close chat/i });
    closeButton.click();

    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it('gives priority to Amplify title over custom title', () => {
    // Mock the store state
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      isOpen: true,
      setOpen: jest.fn(),
    });

    render(<ChatHeader title="Chat With Us" isAmplifyMember={true} />);

    // Should display Amplify title, not the custom title
    const titleElement = screen.getByText('Amplify Support');
    expect(titleElement).toBeInTheDocument();

    // Should not display the custom title
    expect(screen.queryByText('Chat With Us')).not.toBeInTheDocument();
  });
});
