/**
 * Basic chat message interface
 */
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date | number; // Accept both Date objects and timestamp numbers
}
