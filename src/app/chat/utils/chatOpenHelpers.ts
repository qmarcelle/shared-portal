// Define global window interface extension at the top of the file
declare global {
  interface Window {
    openChat?: () => void;
  }
}

/**
 * Utility functions to open the chat programmatically from anywhere in the application.
 */
import { useChatStore } from '../stores/chatStore';

/**
 * Opens the chat window
 * This can be imported and used directly in any component that
 * has access to the chat store.
 */
export function openChat() {
  const store = useChatStore.getState();
  store.actions.setOpen(true);
}

/**
 * Opens the chat window and sets up a custom hook
 * to do the same when a component is mounted.
 *
 * @param openOnMount Whether to open the chat as soon as the component mounts
 * @returns An object with a function to open the chat
 *
 * @example
 * ```
 * // In a component:
 * const { openChat } = useOpenChat();
 *
 * return <button onClick={openChat}>Chat with us</button>;
 * ```
 */
export function useOpenChat(openOnMount = false) {
  const setOpen = useChatStore((state) => state.actions.setOpen);

  if (typeof window !== 'undefined' && openOnMount) {
    // Use setTimeout to ensure this runs after initial render
    setTimeout(() => {
      setOpen(true);
    }, 0);
  }

  return {
    openChat: () => setOpen(true),
  };
}

/**
 * Adds a global window method to open the chat
 * Call this once from a high-level component
 *
 * @example
 * ```
 * // In a layout component:
 * useEffect(() => {
 *   registerGlobalChatOpener();
 * }, []);
 * ```
 */
export function registerGlobalChatOpener() {
  if (typeof window !== 'undefined') {
    // Make openChat available globally
    window.openChat = openChat;
  }
}
