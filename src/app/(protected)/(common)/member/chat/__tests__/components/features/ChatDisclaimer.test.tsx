import { fireEvent, render, screen } from '@testing-library/react';
import ChatDisclaimer from '@/components/features/ChatDisclaimer';

describe('ChatDisclaimer Component', () => {
  const onAcceptMock = jest.fn();
  const onDeclineMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the disclaimer text and buttons', () => {
    render(
      <ChatDisclaimer onAccept={onAcceptMock} onDecline={onDeclineMock} />,
    );

    // Check for heading
    expect(screen.getByText('Chat Disclaimer')).toBeInTheDocument();

    // Check for disclaimer intro text
    expect(
      screen.getByText(/By choosing to use this chat service/i),
    ).toBeInTheDocument();

    // Check for disclaimer bullet points
    expect(
      screen.getByText(/This chat service is provided for general inquiries/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Information shared during this chat may be recorded/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /While we make every effort to keep your information secure/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Our support agents will never ask for your password/i),
    ).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByTestId('accept-chat')).toHaveTextContent(
      'Accept & Continue',
    );
    expect(screen.getByTestId('decline-chat')).toHaveTextContent('Decline');
  });

  it('calls onAccept when Accept button is clicked', () => {
    render(
      <ChatDisclaimer onAccept={onAcceptMock} onDecline={onDeclineMock} />,
    );

    fireEvent.click(screen.getByTestId('accept-chat'));

    expect(onAcceptMock).toHaveBeenCalledTimes(1);
    expect(onDeclineMock).not.toHaveBeenCalled();
  });

  it('calls onDecline when Decline button is clicked', () => {
    render(
      <ChatDisclaimer onAccept={onAcceptMock} onDecline={onDeclineMock} />,
    );

    fireEvent.click(screen.getByTestId('decline-chat'));

    expect(onDeclineMock).toHaveBeenCalledTimes(1);
    expect(onAcceptMock).not.toHaveBeenCalled();
  });
});
