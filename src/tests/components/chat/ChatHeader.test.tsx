import { fireEvent, render, screen } from '@testing-library/react';
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
    (useChatStore as jest.Mock).mockReturnValue({
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
});
