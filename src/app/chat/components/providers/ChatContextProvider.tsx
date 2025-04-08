import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { ChatProvider } from '../../services/chat/ChatProvider';
import type {
  ChatSession,
  GenesysUserData,
  ChatConfig as ProviderConfig,
} from '../../types/types';

interface ChatContextType {
  provider: ChatProvider | null;
  session: ChatSession | null;
  isInitialized: boolean;
  error: Error | null;
}

const ChatContext = createContext<ChatContextType>({
  provider: null,
  session: null,
  isInitialized: false,
  error: null,
});

export const useChatContext = () => useContext(ChatContext);

interface ChatContextProviderProps {
  children: ReactNode;
  config?: ProviderConfig;
  userData?: Partial<GenesysUserData>;
}

export function ChatContextProvider({
  children,
  config,
  userData,
}: ChatContextProviderProps) {
  const [provider, setProvider] = useState<ChatProvider | null>(null);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!config || !userData) {
      setIsInitialized(true);
      return;
    }

    const initializeChat = async () => {
      try {
        const chatProvider = new ChatProvider(config);
        await chatProvider.initialize(userData);
        setProvider(chatProvider);
        setIsInitialized(true);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to initialize chat'),
        );
      }
    };

    initializeChat();

    return () => {
      if (provider) {
        provider.disconnect().catch(console.error);
      }
    };
  }, [config, userData]);

  useEffect(() => {
    if (provider) {
      const session = provider.getCurrentSession();
      setSession(session);
    }
  }, [provider]);

  return (
    <ChatContext.Provider value={{ provider, session, isInitialized, error }}>
      {children}
    </ChatContext.Provider>
  );
}
