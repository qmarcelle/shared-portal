import { create } from 'zustand';
import { ChatSession } from '../models/types';

interface ChatSessionState {
  session: ChatSession | null;
  isLoading: boolean;
  error: Error | null;
  initializeSession: () => Promise<void>;
  clearSession: () => void;
}

export const useChatSessionStore = create<ChatSessionState>((set) => ({
  session: null,
  isLoading: false,
  error: null,
  initializeSession: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/chat');
      if (!response.ok) throw new Error('Failed to initialize chat session');
      const data = await response.json();
      set({ session: data, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },
  clearSession: () => set({ session: null, error: null }),
}));
