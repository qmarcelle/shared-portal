export interface ChatSession {
  sessionId: string;
  startTime: string;
}

export const startChatSession = jest.fn().mockResolvedValue({
  sessionId: 'test-session-id',
  startTime: new Date().toISOString(),
  isActive: true,
});

export const endChatSession = jest.fn().mockResolvedValue({ success: true });

export const sendMessage = async (
  sessionId: string,
  message: string,
): Promise<void> => {
  // Implementation for sending messages
};

export const sendChatMessage = jest.fn().mockResolvedValue({
  id: 'test-message-id',
  text: 'Test response',
  sender: 'agent',
  timestamp: Date.now(),
});

export const checkChatEligibility = jest.fn().mockResolvedValue({
  isEligible: true,
  chatGroup: 'Test_Chat',
  workingHours: 'M_F_8_6',
});
