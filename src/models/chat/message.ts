export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: number;
}
