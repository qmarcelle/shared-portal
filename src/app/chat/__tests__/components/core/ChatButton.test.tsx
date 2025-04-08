import { fireEvent, render, screen } from '@testing-library/react';
import { ChatButton } from '../ChatButton';

describe('ChatButton', () => {
  it('renders with correct text', () => {
    const onClick = jest.fn();
    render(<ChatButton onClick={onClick} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Chat with Us');
  });

  it('calls onClick handler when clicked', () => {
    const onClick = jest.fn();
    render(<ChatButton onClick={onClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has correct className', () => {
    const onClick = jest.fn();
    render(<ChatButton onClick={onClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('chat-button');
  });
});
