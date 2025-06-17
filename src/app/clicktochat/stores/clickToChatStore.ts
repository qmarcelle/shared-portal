import { create } from 'zustand';

interface ChatState {
  chatActive: boolean;
  setChatActive: (locked: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chatActive: false,
  setChatActive: (active) => set({
    chatActive: active
  }),
}));
