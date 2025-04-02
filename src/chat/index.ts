// Re-export providers
export { ChatStoreProvider, useChatStore, type ChatState } from './providers';

// Re-export hooks
export * from './hooks/useChatStore';

// Export a convenience function to initialize the chat service
export const initializeChat = () => {
  // Initialize any global chat services here
  console.log('Chat service initialized');

  // Return a cleanup function
  return () => {
    console.log('Chat service cleanup');
  };
};
