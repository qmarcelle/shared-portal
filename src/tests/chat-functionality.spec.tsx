import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Create a simple test component that mimics a chat interface
const ChatComponent = () => {
  const [messages, setMessages] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, inputValue]);
      setInputValue('');
    }
  };

  return (
    <div>
      <div data-testid="messages">
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <input
        data-testid="message-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

describe('Chat Functionality Tests', () => {
  it('should send a message when the Send button is clicked', async () => {
    render(<ChatComponent />);

    // Type a message
    const input = screen.getByTestId('message-input');
    await userEvent.type(input, 'Hello, this is a test message');

    // Click the send button
    const sendButton = screen.getByRole('button', { name: /send/i });
    await userEvent.click(sendButton);

    // Check that the message appears in the chat
    const messages = screen.getByTestId('messages');
    expect(messages).toHaveTextContent('Hello, this is a test message');
  });

  it('should clear the input field after sending a message', async () => {
    render(<ChatComponent />);

    // Type a message
    const input = screen.getByTestId('message-input');
    await userEvent.type(input, 'Test message');

    // Click the send button
    const sendButton = screen.getByRole('button', { name: /send/i });
    await userEvent.click(sendButton);

    // Check that the input field is cleared
    expect(input).toHaveValue('');
  });
});
