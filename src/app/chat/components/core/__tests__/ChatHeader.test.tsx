import { fireEvent, render, screen } from '@testing-library/react';
import { ChatHeader } from '../ChatHeader';

describe('ChatHeader', () => {
  it('renders with correct title', () => {
    const onClose = jest.fn();
    const title = 'Test Title';
    render(<ChatHeader title={title} onClose={onClose} />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('chat-header');

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(title);
  });

  it('renders close button with correct aria label', () => {
    const onClose = jest.fn();
    render(<ChatHeader title="Test" onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: 'Close chat' });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveClass('close-button');
    expect(closeButton).toHaveTextContent('×');
  });

  it('calls onClose handler when close button is clicked', () => {
    const onClose = jest.fn();
    render(<ChatHeader title="Test" onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: 'Close chat' });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
